import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  Grid,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Share } from '@mui/icons-material';
import { useSnackbar } from 'notistack';


import Layout from '../components/Layout';
import UserPanel from '../components/UserPanel';
import ReviewsPanel from '../components/ReviewsPanel';
import classes from '../utils/classes';
import { Store } from '../utils/Store';

function Avaliacoes() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [reviews, setReviews] = useState([])

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const loadReviews = async (id) => {
      return await fetch(`/api/users/reviews/${id}`);
    }

    const flux = async () => {
      const reviews = await (await loadReviews(userInfo._id)).json();
      setReviews(reviews)
    }

    flux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fonte: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
  function shareToClipboard() {
    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator
          .clipboard
          .writeText(`${window.location.protocol}//${window.location.host}/usuario/${userInfo._id}`);
      }
    });

    const key = enqueueSnackbar("Link copiado para área de transferência!", {
      variant: "success"
    });

    setTimeout(() => { closeSnackbar(key) }, 7000);
  }

  return (
    <Layout title="Avaliações">
      <Grid container spacing={1}>
        <UserPanel current='avaliacoes' />

        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Grid container spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography component="h1" variant="h1">
                      Avaliações
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Tooltip title="Link do seu perfil público">
                      <IconButton color='primary' onClick={shareToClipboard}>
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </ListItem>

              <ReviewsPanel reviews={reviews} />
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Avaliacoes), { ssr: false });
