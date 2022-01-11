import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

import Layout from '../components/Layout';
import Form from '../components/Form';
import UserPanel from '../components/UserPanel';
import classes from '../utils/classes';

function Profile() {
  const { state, dispatch } = useContext(Store);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);
  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();

    if (password !== confirmPassword) {
      enqueueSnackbar('Senha incompatível', { variant: 'error' });
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title="Perfil">
      <Grid container spacing={1}>
        <UserPanel current='perfil' />

        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Perfil
                </Typography>
              </ListItem>
              <ListItem>
                <Form onSubmit={handleSubmit(submitHandler)}>
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Nome"
                            inputProps={{ type: 'name' }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === 'minLength'
                                  ? 'Nome maior que 1'
                                  : 'Nome obrigatório'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            inputProps={{ type: 'email' }}
                            error={Boolean(errors.email)}
                            helperText={
                              errors.email
                                ? errors.email.type === 'pattern'
                                  ? 'Email inválido'
                                  : 'Email é obrigatório'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Senha maior que 5',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password ? 'Senha maior que 5' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Confirmar Senha maior que 5',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirmar Senha"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.password
                                ? 'Confirmar Senha maior que 5'
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
                        Atualizar
                      </Button>
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

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
