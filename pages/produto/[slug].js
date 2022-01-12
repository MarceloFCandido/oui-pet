import React, { useContext, useEffect, useState } from 'react';
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
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import ReviewsPanel from '../../components/ReviewsPanel';
import db from '../../utils/db';
import { getError } from '../../utils/error';
import Product from '../../models/Product';
import { Store } from '../../utils/Store';
import classes from '../../utils/classes';

export default function ProductScreen(props) {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);

  const { userInfo } = state;

  const { product } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      setLoading(false);

      enqueueSnackbar('Avaliação enviada com sucesso', { variant: 'success' });

      fetchReviews();
    } catch (err) {
      setLoading(false);

      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);

      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!product) {
    return <Box>Produto não encontrado!</Box>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('Desculpe. Produto indisponível.');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/carrinho');
  };

  return (
    <Layout title={product.name}>
      <Box sx={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>voltar</Typography>
          </Link>
        </NextLink>
      </Box>

      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>Categoria: {product.category}</Typography>
            </ListItem>

            <ListItem>
              <Typography>Marca: {product.brand}</Typography>
            </ListItem>

            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <Link href="#reviews">
                <Typography>({product.numReviews} avaliações)</Typography>
              </Link>
            </ListItem>

            <ListItem>
              <Typography>Descrição: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>

        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Preço</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>R$ {product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'Em estoque' : 'Indisponível'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Adicionar ao carrinho
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

      <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Avaliações dos clientes
          </Typography>
        </ListItem>

        {reviews.length === 0 && <ListItem>Sem avaliação</ListItem>}

        <ReviewsPanel reviews={reviews} />

        <ListItem>
          {userInfo ? (
            <Form onSubmit={submitHandler}>
              <List>
                <ListItem>
                  <Typography variant="h2">Sua Avaliação</Typography>
                </ListItem>

                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Avaliar"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>

                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>

                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Enviar
                  </Button>

                  {loading && <CircularProgress></CircularProgress>}
                </ListItem>
              </List>
            </Form>
          ) : (
            <Typography variant="h2">
              Por favor{', '}
              <Link href={`/login?redirect=/produto/${product.slug}`}>
                login
              </Link>{' '}
              para avaliar.
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();
  await db.disconnect();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
