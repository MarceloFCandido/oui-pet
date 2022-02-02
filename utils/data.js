import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@email.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Gabriel',
      email: 'gabriel@email.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
    {
      name: 'Iagor',
      email: 'iagor@email.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
    {
      name: 'Marcelo',
      email: 'marcelo@email.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Casinha de cachorro',
      slug: 'casinha-cachorro',
      category: 'Casa',
      image: '/images/casinha-cao.jpg',
      isFeatured: true,
      featuredImage: '/images/casinha-cao.jpg',
      price: 80,
      brand: 'Oui',
      rating: 4.2,
      numReviews: 0,
      countInStock: 4,
      description: 'Casinha para cães. Muito grande',
    },
    {
      name: 'Casinha de hamster',
      slug: 'casinha-hamster',
      category: 'Casa',
      image: '/images/casinha-hamister.jpg',
      isFeatured: true,
      featuredImage: '/images/casinha-hamister.jpg',
      price: 20,
      brand: 'Oui',
      rating: 4.5,
      numReviews: 0,
      countInStock: 10,
      description: 'Casinha para hamster. Com brinquedo',
    },
    {
      name: 'Arranhador felino',
      slug: 'arranhador-felino',
      category: 'brinquedo',
      image: '/images/aranhador.jpg',
      isFeatured: true,
      featuredImage: '/images/aranhador.jpg',
      price: 10,
      brand: 'Felino',
      rating: 4.8,
      numReviews: 0,
      countInStock: 20,
      description: 'Arranhador felino para gatos. Muito divertido',
    },
    {
      name: 'Mordedor canino',
      slug: 'mordedor-canino',
      category: 'brinquedo',
      image: '/images/mordedor.jpg',
      price: 8,
      brand: 'Dog',
      rating: 4.7,
      numReviews: 0,
      countInStock: 10,
      description: 'Mordedor para cães. Muito divertido',
    },
    {
      name: 'Porta ração',
      slug: 'porta-racao',
      category: 'brinquedo',
      image: '/images/bolinha-racao.jpg',
      price: 10,
      brand: 'Ração',
      rating: 4.1,
      numReviews: 0,
      countInStock: 3,
      description: 'Porta ração. Muito divertido',
    },
    {
      name: 'Casa para felinos arranhar',
      slug: 'casa-felino-arranhador',
      category: 'brinquedo',
      image: '/images/casa-arranhadora.jpg',
      price: 50,
      brand: 'Cat',
      rating: 4.5,
      numReviews: 0,
      countInStock: 3,
      description: 'Casinha para gatos arranhar. Muito divertido',
    },
  ],
};

export default data;
