import nc from 'next-connect';

import db from '../../../../utils/db';
import Product from '../../../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const userId = req.query.id;

  const selectedReviews = (await Product.find({}))
    .map(({ name, reviews }) => ({
      name,
      ...reviews
        .filter(({ user }) => user?.toString() === userId)
        .map(({ comment, rating, updatedAt }) => ({ comment, rating, updatedAt }))[0]
    }))
    .filter(({ updatedAt }) => updatedAt);

  await db.disconnect();

  res.status(200).send(selectedReviews);
});

export default handler;
