import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NexLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderHistory() {
  const { state } = useContext(Store);

  const router = useRouter();

  const classes = useStyles();

  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Histórico de Pedidos">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NexLink href="/perfil" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Perfil do Usuário"></ListItemText>
                </ListItem>
              </NexLink>
              <NexLink href="/historico-de-pedidos" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Histórico de Pedidos"></ListItemText>
                </ListItem>
              </NexLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Histórico de Pedidos
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATA</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAGO</TableCell>
                          <TableCell>ENTREGA</TableCell>
                          <TableCell>AÇÃO</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `pago em ${order.paidAt}`
                                : 'não pago'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `entregue em ${order.deliveredAt}`
                                : 'não entregue'}
                            </TableCell>
                            <TableCell>
                              <NexLink href={`/pedido/${order._id}`} passHref>
                                <Button variant="contained">Detalhes</Button>
                              </NexLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
