import nc from 'next-connect';
import Product from '../../../../models/Product';
import { isAuth, isAdmin } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();

  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();

  const newProduct = new Product(req.body);
  const product = await newProduct.save();

  await db.disconnect();

  res.send({ message: 'Produto criado', product });
});

export default handler;
