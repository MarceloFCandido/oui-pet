import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  await db.disconnect();

  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);
  console.log(req.body)

  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.featuredImage = req.body.featuredImage;
    product.isFeatured = req.body.isFeatured;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    await product.save();
    await db.disconnect();

    res.send({ message: 'Produto Atualizado com Sucesso' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Produto não encontrado' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  if (product) {
    await product.remove();
    await db.disconnect();

    res.send({ message: 'Produto deletado' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Produto não encontrado' });
  }
});

export default handler;
