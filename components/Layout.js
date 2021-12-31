import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  createTheme,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  ThemeProvider,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import { getError } from '../utils/error';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function Layout({ title, description, children }) {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

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
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#EFC600',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const classes = useStyles();

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);

    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

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
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Image
                    src="/images/logo.svg"
                    alt="logomarca. Garçon francês com pano na mão."
                    width={60}
                    height={79.135}
                  />
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Categorias</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/pesquisar?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div className={classes.grow}></div>
            <div>
              <List className={classes.navRight}>
                <ListItem>
                  <Switch checked={darkMode} onChange={darkModeChangeHandler} />
                </ListItem>
                <ListItem>
                  <div>
                    <NextLink href="/carrinho" passHref>
                      <Link>
                        {cart.cartItems.length > 0 ? (
                          <Badge
                            color="secondary"
                            badgeContent={cart.cartItems.length}
                          >
                            <Image
                              src="/images/carrinho.svg"
                              alt="imagem de um carrinho de compra"
                              width={60}
                              height={47}
                            />
                          </Badge>
                        ) : (
                          <Image
                            src="/images/carrinho.svg"
                            alt="imagem de um carrinho de compra"
                            width={60}
                            height={47}
                          />
                        )}
                      </Link>
                    </NextLink>
                  </div>
                </ListItem>
                <ListItem>
                  {userInfo ? (
                    <>
                      <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={loginClickHandler}
                        className={classes.navbarButton}
                      >
                        {userInfo.name}
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={loginMenuCloseHandler}
                      >
                        <MenuItem
                          onClick={(e) => loginMenuCloseHandler(e, '/perfil')}
                        >
                          Perfil
                        </MenuItem>
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, '/historico-de-pedidos')
                          }
                        >
                          Histórico de Pedidos
                        </MenuItem>
                        {userInfo.isAdmin && (
                          <MenuItem
                            onClick={(e) =>
                              loginMenuCloseHandler(e, '/admin/painel')
                            }
                          >
                            Painel do Administrador
                          </MenuItem>
                        )}
                        <MenuItem onClick={logoutClickHandler}>Sair</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <NextLink href="/login" passHref>
                      <Link>
                        <Typography component="span">Login</Typography>
                      </Link>
                    </NextLink>
                  )}
                </ListItem>
              </List>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <div></div>
          <div>
            <h1>Contato</h1>
          </div>
          <div>
            <Image
              src="/images/logo-rodape.svg"
              alt="imagem da logo do oui pet. Garçon françês segurando um pano na mão."
              width={80}
              height={100.56}
            />
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
