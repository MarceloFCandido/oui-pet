import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, List, ListItem, TextField, Typography, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';
import countries from 'country-list-js';

const emptyForm = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: ""
};

export default function Shipping() {

  const [form, setForm] = useState(emptyForm);

  const updateProperty = ({ target: { value, name } }) => {
    setForm({
      ...form,
      [name]: value
    });
  }

  const router = useRouter();

  const { state, dispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/comprar');
    }

    setForm(shippingAddress);
  }, [router, userInfo, shippingAddress]);

  const submitHandler = () => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: form,
    });

    Cookies.set(
      'shippingAddress',
      JSON.stringify(form)
    );

    router.push('/pagamento');
  };

  return (
    <Layout title="Endereço de Entrega">
      <CheckoutWizard activeStep={1} />
      <Form onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Endereço de entrega
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              name="fullName"
              label="Nome completo"
              required
              onChange={updateProperty}
              value={form.fullName}
            />
          </ListItem>
          {/* FIXME Esse label não funciona bem com o componente 'Select' */}
          <ListItem>
            <Select
              variant="outlined"
              fullWidth
              name="country"
              label="País"
              required
              onChange={updateProperty}
              value={form.country}
            >
              {countries.names().sort().map((country, idx) => (
                <MenuItem
                  key={`${country}_${idx}`}
                  value={country}
                >
                  {country}
                </MenuItem>
              ))}
            </Select>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              name="postalCode"
              label="CEP"
              required
              onChange={updateProperty}
              value={form.postalCode}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              name="city"
              label="Cidade"
              required
              onChange={updateProperty}
              value={form.city}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              name="address"
              label="Endereço"
              required
              onChange={updateProperty}
              value={form.address}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continuar
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}
