import React from 'react';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from '@mui/material';
import classes from "../utils/classes"

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <Card>
      <NextLink href={`/produto/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={product.image}
            title={product.name}
            sx={classes.cardMediaImage}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>R$ {product.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          Adicionar ao Carrinho
        </Button>
      </CardActions>
    </Card>
  );
}
