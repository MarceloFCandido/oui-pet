import Product from "../models/Product";

export default async function (userId) {
  return (
    await Product.find({}))
    .map(({ name, reviews }) => ({
      name,
      ...reviews
        .filter(({ user }) => user?.toString() === userId)
        .map(({ comment, rating, updatedAt }) => ({ comment, rating, updatedAt: updatedAt.toISOString() }))[0]
    }))
    .filter(({ updatedAt }) => updatedAt
    );
}
