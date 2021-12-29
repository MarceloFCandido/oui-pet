import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import { AppBar, Container, Link, Toolbar, Typography } from '@mui/material';

import useStyles from '../utils/styles';

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>Oui Pet</title>
        <link rel="icon" href="images/logo.svg" type="image/svg" />
      </Head>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              <Image
                src="/images/logo.svg"
                layout="intrinsic"
                alt="logomarca. Garçon francês com pano na mão."
                width={100}
                height={138.27}
              />
            </Link>
          </NextLink>
        </Toolbar>
        <div className={classes.grow}></div>
        <div>
          <NextLink href="/cart" passHref>
            <Link>
              <Image
                src="/images/carrinho.svg"
                layout="intrinsic"
                alt="imagem de um carrinho de compra"
                width={102}
                height={72}
              />
            </Link>
          </NextLink>
          <NextLink href="/login" passHref>
            <Link>Login</Link>
          </NextLink>
        </div>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        <Typography>Contato</Typography>
      </footer>
    </div>
  );
}
