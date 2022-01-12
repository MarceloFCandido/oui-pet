import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Store } from '../utils/Store';

import Layout from '../components/Layout';
import UserPanel from '../components/UserPanel';
import classes from '../utils/classes';
import ReviewsPanel from '../components/ReviewsPanel';

function Avaliacoes() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [reviews, setReviews] = useState([])

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

  return (
    <Layout title="Avaliações">
      <Grid container spacing={1}>
        <UserPanel current='avaliacoes' />

        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Avaliações
                </Typography>
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
