import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  AppBar,
  Container,
  CssBaseline,
  createTheme,
  Grid,
  Link,
  Toolbar,
  ThemeProvider,
  Typography,
} from '@mui/material';

import useStyles from '../utils/styles';

export default function Layout({ title, description, children }) {
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: 'light',
      primary: {
        main: '#EFC600',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const classes = useStyles();
  return (
    <div>
      <Head>
        {description && <meta name="description" content={description}></meta>}
        <link rel="icon" href="images/logo.svg" type="image/svg" />
        <title>{title ? `${title} - Oui Pet` : 'Oui Pet'}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Image
                  src="/images/logo.svg"
                  layout="intrinsic"
                  alt="logomarca. Garçon francês com pano na mão."
                  width={60}
                  height={79.135}
                />
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  <Image
                    src="/images/carrinho.svg"
                    layout="intrinsic"
                    alt="imagem de um carrinho de compra"
                    width={60}
                    height={47}
                  />
                </Link>
              </NextLink>
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Grid container justifyContent="flex-end">
            <Grid item md={8}>
              <h1>Contato</h1>
            </Grid>
            <Grid item md={2}>
              <Image
                src="/images/logo-rodape.svg"
                alt="imagem da logo do oui pet. Garçon françês segurando um pano na mão."
                width={80}
                height={100.56}
                layout="intrinsic"
              />
            </Grid>
          </Grid>
        </footer>
      </ThemeProvider>
    </div>
  );
}
