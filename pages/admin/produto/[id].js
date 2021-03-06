import React, { useEffect, useContext, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';
import {
  Button,
  Card,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import Form from '../../../components/Form';
import classes from '../../../utils/classes';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

function ProductEdit({ params }) {
  const productId = params.id;

  const { state } = useContext(Store);

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [isFeatured, setIsFeatured] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });

          let data;
          if (productId !== `novo-produto`) {
            data = (await axios.get(`/api/admin/products/${productId}`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            })).data;
          }

          dispatch({ type: 'FETCH_SUCCESS' });

          setValue('name', data?.name || '');
          setValue('slug', data?.slug || '');
          setValue('price', data?.price || '');
          setValue('image', data?.image || '');
          setValue('featuredImage', data?.featuredImage || '');
          setIsFeatured(data?.isFeatured || '');
          setValue('category', data?.category || '');
          setValue('brand', data?.brand || '');
          setValue('countInStock', data?.countInStock || '');
          setValue('description', data?.description || '');
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0];

    const bodyFormData = new FormData();

    bodyFormData.append('file', file);

    try {
      dispatch({ type: 'UPLOAD_REQUEST' });

      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);

      enqueueSnackbar('Arquivo anexado com sucesso', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submit = async (data) => {
    closeSnackbar();

    try {
      if (productId === 'novo-produto') {
        dispatch({ type: 'CREATE_REQUEST' });

        await axios.post(
          `/api/admin/products`,
          { ...data, isFeatured: isFeatured },
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );

        dispatch({ type: 'CREATE_SUCCESS' });

        enqueueSnackbar('Produto criado com sucesso', { variant: 'success' });
      } else {
        dispatch({ type: 'UPDATE_REQUEST' });

        await axios.put(
          `/api/admin/products/${productId}`,
          { ...data, isFeatured: isFeatured },
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );

        dispatch({ type: 'UPDATE_SUCCESS' });

        enqueueSnackbar('Produto atualizado com sucesso!', {
          variant: 'success',
        });
      }

      router.push('/admin/produtos');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title={productId === 'novo-produto' ? `Novo produto` : `Editar produto ${productId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <NextLink href="/admin/painel" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Painel do Administrador"></ListItemText>
                </ListItem>
              </NextLink>

              <NextLink href="/admin/pedidos" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Pedidos"></ListItemText>
                </ListItem>
              </NextLink>

              <NextLink href="/admin/produtos" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Produtos"></ListItemText>
                </ListItem>
              </NextLink>

              <NextLink href="/admin/usuarios" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Usu??rios"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  {productId === 'novo-produto' ? `Novo produto` : `Editar produto ${productId}`}
                </Typography>
              </ListItem>

              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && <Typography sx={classes.error}>{error}</Typography>}
              </ListItem>

              <ListItem>
                <Form onSubmit={handleSubmit(submit)}>
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Nome"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Nome ?? obrigat??rio' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'Slug ?? obrigat??rio' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Pre??o"
                            error={Boolean(errors.price)}
                            helperText={
                              errors.price ? 'Pre??o ?? obrigat??rio' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="image"
                            label="Imagem"
                            error={Boolean(errors.image)}
                            helperText={
                              errors.image ? 'Imagem ?? obrigat??rio' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button variant="contained" component="label">
                        Anexar Arquivo
                        <input type="file" onChange={uploadHandler} hidden />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>

                    <ListItem>
                      <FormControlLabel
                        label='?? destaque?'
                        control={(
                          <Checkbox
                            name='isFeatured'
                            checked={isFeatured}
                            onClick={(e) => setIsFeatured(e.target.checked)}
                          />
                        )}
                      />
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="featuredImage"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: isFeatured,
                        }}
                        render={({ field }) => (
                          <TextField
                            id="featuredImage"
                            fullWidth
                            label="Imagem de destaque"
                            error={Boolean(errors.featuredImage)}
                            helperText={
                              errors.featuredImage
                                ? 'Imagem de destaque ?? obrigat??ria'
                                : ''
                            }
                            variant="outlined"
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button variant="contained" component="label">
                        Anexar Arquivo
                        <input
                          type="file"
                          onChange={(e) => uploadHandler(e, 'featuredImage')}
                          hidden
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Categoria"
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? 'Categoria ?? obrigat??ria' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="brand"
                            label="Marca"
                            error={Boolean(errors.brand)}
                            helperText={
                              errors.brand ? 'Marca ?? obrigat??ria' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Quantidade em estoque"
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? 'Quantidade em estoque ?? obrigat??ria'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            id="description"
                            label="Descri????o"
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? 'Descri????o ?? obrigat??ria'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        {productId === 'novo-produto' ? `Criar` : `Atualizar`}
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </Form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
