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
  InputBase,
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
  FormControl,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import classes from '../utils/classes';

export default function Layout({ title, description, children }) {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
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

  const [query, setQuery] = useState('');

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/pesquisar?query=${query}`);
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
    Cookies.remove('shippinhAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  const isDesktop = useMediaQuery('(min-width:600px)');

  return (
    <>
      <Head>
        {description && <meta name="description" content={description}></meta>}
        <link rel="icon" href="images/logo.svg" type="image/svg" />
        <title>{title ? `${title} - Oui Pet` : 'Oui Pet'}</title>
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                sx={classes.menuButton}
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
              >
                <MenuIcon sx={classes.navbarButton} />
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

            <Box sx={isDesktop ? classes.visible : classes.hidden}>
              <FormControl color="primary" onSubmit={submitHandler}>
                <Box sx={classes.searchForm}>
                  <InputBase
                    name="query"
                    sx={classes.searchInput}
                    placeholder="Pesquisar"
                    color="primary"
                    onChange={queryChangeHandler}
                  />

                  <IconButton
                    type="submit"
                    sx={classes.searchButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </FormControl>
            </Box>

            <Box sx={classes.navRight}>
              <Box>
                <Switch checked={darkMode} onChange={darkModeChangeHandler} />
              </Box>

              <Box>
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
              </Box>

              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    sx={classes.navbarButton}
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

                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/avaliacoes')
                      }
                    >
                      Avaliações
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
                <Button sx={classes.navbarButton}>
                  <NextLink href="/login" passHref>
                    <Link>
                      <Typography component="span">Login</Typography>
                    </Link>
                  </NextLink>
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container sx={classes.main} component="main">
          {children}
        </Container>

        <Box sx={classes.footer} component="footer">
          <Box />

          <Box>
            <h1>Contato</h1>
          </Box>

          <Box>
            <Image
              src="/images/logo-rodape.svg"
              alt="imagem da logo do oui pet. Garçon françês segurando um pano na mão."
              width={80}
              height={100.56}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
