import nc from 'next-connect';

import db from '../../../../utils/db';
import Product from '../../../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const userId = req.query.id;

  const productsWithReviews = (await Product.find({}))
    .filter(({ reviews }) => reviews.length)
    .map(({ name, reviews }) => ({ name, reviews }));

  await db.disconnect();

  const selectedReviews = productsWithReviews
    .map(({ name, reviews }) => ({
      name,
      reviews: reviews
        .filter(({ user }) => user.toString() === userId)
        .map(({ comment, createdAt, rating, updatedAt }) => ({ comment, createdAt, rating, updatedAt }))
    }))
    .filter(({ reviews }) => reviews.length);

  res.status(200).send(selectedReviews)
});

export default handler;
