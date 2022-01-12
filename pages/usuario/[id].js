import dynamic from 'next/dynamic';
import React from 'react';
import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';

import db from '../../utils/db';
import User from '../../models/User';
import Layout from '../../components/Layout';
import ReviewsPanel from '../../components/ReviewsPanel';
import classes from '../../utils/classes';
import selectedReviews from '../../utils/selectedReviews';

function PerfilPublicoUsuario({ name, reviews }) {
  return (
    <Layout title={`Perfil - ${name} `}>
      <Grid container spacing={1}>
        <Grid item md={12} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  {name}
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

export default dynamic(() => Promise.resolve(PerfilPublicoUsuario), { ssr: false });

export async function getServerSideProps({ params: { id } }) {
  await db.connect();

  const userDoc = await User.findOne({ _id: id }).lean();
  const { name } = db.convertDocToObj(userDoc);

  const reviews = await selectedReviews(id);

  await db.disconnect();

  return {
    props: {
      name,
      reviews,
    },
  };
}