import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';

export default function Payment() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('');
  const { state, dispatch } = useContext(Store);

  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/comprar');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Método de pagamento é obrigatório', {
        variant: 'error',
      });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/finalizar-pedido');
    }
  };
  return (
    <Layout title="Método de Pagamento">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <Form onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Método de Pagamento
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Método de Pagamento"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Bitcoin"
                  value="Bitcoin"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Dinheiro"
                  value="Dinheiro"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continuar
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push('/shipping')}
              color="secondary"
            >
              Voltar
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}
