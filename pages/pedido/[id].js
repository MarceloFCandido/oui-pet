import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSnackbar } from 'notistack';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/error';
import { decodeToken } from '../../utils/auth';
import classes from '../../utils/classes';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      state;
  }
}

function Order({ params }) {
  const orderId = params.id;

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const [etherValue, setEtherValue] = useState('');
  const [etherValueUpdated, setEtherValueUpdated] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();

      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }

      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'BRL',
          },
        });

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  async function payWithCash() {
    try {
      const user = decodeToken(userInfo.token);

      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`,
        {
          id: order._id,
          status: 'PAID',
          email_address: user.email,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'PAY_SUCCESS', payload: data });

      enqueueSnackbar('Pedido Pago', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });

      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      console.log(details);
      try {
        dispatch({ type: 'PAY_REQUEST' });

        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: 'PAY_SUCCESS', payload: data });

        enqueueSnackbar('Pedido Pago', { variant: 'success' });
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });

        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });

      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'DELIVER_SUCCESS', payload: data });

      enqueueSnackbar('Pedido foi entregue', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });

      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  async function refreshEtherValue() {
    setEtherValueUpdated(true);

    const { data: { ethereum: { brl: brlEtherValue } } } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl');

    const convertBrlToEtherValue = itemsPrice / brlEtherValue;

    setEtherValue(convertBrlToEtherValue);

    setTimeout(() => {
      setEtherValueUpdated(false);
      setEtherValue('');
    }, 5000);
  }

  function payWithEther() {
    // Endere??o da carteira do Iagor
    const to = '0xB88008609C6b9F4167F581d504AFA21197a1D2D0';

    window.open(
      `https://pay.buildship.dev/to/${to}?value=${etherValue}`,
      'payment',
      'width=500, height=800'
    );
  }

  return (
    <Layout title={`Pedido ${orderId}`}>
      <Typography component="h1" variant="h1">
        Pedido {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography sx={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Endere??o de Entrega
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status:{' '}
                  {isDelivered ? `Entregue em ${deliveredAt}` : 'N??o entregue'}
                </ListItem>
              </List>
            </Card>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    M??todo de pagamento
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid ? `Pago em ${paidAt}` : 'N??o pago'}
                </ListItem>
              </List>
            </Card>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Itens do Pedido
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Imagem</TableCell>
                          <TableCell>Nome</TableCell>
                          <TableCell align="right">Quantidade</TableCell>
                          <TableCell align="right">Pre??o</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/produto/${item.slug}`} passHref>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell>
                              <NextLink href={`/produto/${item.slug}`} passHref>
                                <Link>
                                  <Typography>{item.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>R$ {item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Resumo do Pedido</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Itens:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">R$ {itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Frete:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">R$ {taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>R$ {totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {paymentMethod !== 'Dinheiro' && (
                  <Typography
                    variant="h1"
                    component="h3"
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Aten????o, n??o realize pagamentos por essa plataforma foram
                    implementados somente para fins educativos, n??o nos
                    responsabilizamos por nenhuma transa????o feita.
                  </Typography>
                )}
                {!isPaid && (
                  <ListItem
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between"
                    }}
                  >
                    {
                      paymentMethod === "PayPal" && (
                          isPending ? (
                            <CircularProgress />
                          ) : (
                            <Box sx={classes.fullWidth}>
                              <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                              />
                            </Box>
                          )
                      )
                    }
                    {
                      paymentMethod === "CryptoMoeda" && (
                        <>
                          <Button
                            onClick={refreshEtherValue}
                            variant="contained"
                            sx={{
                              width: "20%"
                            }}
                            disabled={etherValueUpdated}
                          >
                            <Refresh sx={{
                              width: 30,
                              height: 50
                            }} />
                          </Button>
                          <Button
                            onClick={payWithEther}
                            variant="contained"
                            sx={{
                              width: "100%",
                              ml: 1,
                              boxSizing: "content-box",
                              height: "50px"
                            }}
                            disabled={!etherValueUpdated}
                          >
                            <Image
                              src="/images/ethereum.svg"
                              alt="Pagar com Etherum"
                              width={30}
                              height={30}
                            />
                            <Typography
                              component='span'
                              variant='p'
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {etherValue}
                            </Typography>
                          </Button>
                        </>
                      )
                    }
                    {
                      paymentMethod === 'Dinheiro' && (
                        <Button
                          onClick={payWithCash}
                          variant="contained"
                          sx={{
                            width: '100%',
                          }}
                        >
                          Pagar com Dinheiro
                        </Button>
                      )
                    }
                  </ListItem>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress />}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={deliverOrderHandler}
                    >
                      Entregar Pedido
                    </Button>
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
