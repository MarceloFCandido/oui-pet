import nc from 'next-connect';

import db from '../../../../utils/db';
import selectedReviews from '../../../../utils/selectedReviews';

const handler = nc();

handler.get(async (req, res) => {
  const userId = req.query.id;

  await db.connect();

  const reviews = await selectedReviews(userId);

  await db.disconnect();

  res.status(200).send(reviews);
});

export default handler;
