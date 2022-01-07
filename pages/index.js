import NextLink from 'next/link';
import Carousel from 'react-material-ui-carousel';
import { Grid, Link, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import Product from '../models/Product';
import ProductItem from '../components/ProductItem';
import db from '../utils/db';
import classes from '../utils/classes';
import Image from 'next/image';

export default function Home(props) {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);

  const { topRatedProducts, featuredProducts } = props;

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('Desculpe, produto fora de estoque');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/carrinho');
  };

  return (
    <Layout>
      <Carousel>
        {featuredProducts.map((product) => (
          <NextLink
            key={product._id}
            href={`/produto/${product.slug}`}
            passHref
          >
            <Link sx={[classes.flex, classes.center]}>
              <Image
                src={product.featuredImage}
                alt={product.name}
                width={1200}
                height={300}
              />
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography variant="h2">Produtos Populares</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();

  const featuredProductsDocs = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean()
    .limit(3);

  const topRatedProductsDocs = await Product.find({}, '-reviews')
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);

  await db.disconnect();

  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}
