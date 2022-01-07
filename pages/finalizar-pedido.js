import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { getError } from '../utils/error';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import { Store } from '../utils/Store';
import classes from '../utils/classes';

function PlaceOrder() {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);

  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );

  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/pagamento');
    }

    if (cartItems.length === 0) {
      router.push('/carrinho');
    }
  }, []);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    closeSnackbar();

    try {
      setLoading(true);

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/pedido/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Finalizar Compra">
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Finalizar Compra
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Endereço de Entrega
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Método de Pagamento
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
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
                        <TableCell align="right">Preço</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
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
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={placeOrderHandler}
                >
                  Finalizar Compra
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
