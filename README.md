# Oui Pet

<p align="center">
  <img src="./public/images/logo.svg" width="200px"/>
</p>

Projeto final da discilina de Programação Web 2021/2 do CEFET-MG campus 2.

O objetivo do projeto é desenvolver um e-commerce de produtos para animais com a funcionalidade de realizar pagamentos via criptomoedas.

O que foi desenvolvido na entrega do Front-End:

- Tela de cadastro de usuários e produtos.
- Checkout completo em diferentes tipos de pagamentos.
- Painel de administrador e edição de usuários e produtos.
- Página de pesquisar produtos.
- Avaliação dos produtos pelo usuário
- Página de perfil para os clientes

<br>

# Integrantes:

Gabriel Arrighi Silva

Iagor de Sousa Penaranda Silva

Marcelo Lopes de Macedo Ferreira Candido

<br>

# Instalação

## Arquivo .env:

Crie um arquivo com o nome .env na raiz do projeto com o seguinte conteúdo:

```
MONGODB_URI=mongodb://127.0.0.1:27017/oui-pet
JWT_SECRET=oui-pet
PAYPAL_CLIENT_ID=AQVUYr85_EGhCFRfBzYPtN8r-xAcLzME9RPT2DjLKUH7DImgGDeYhpNog5zGK7cszl7DfrH0UWW5GI5v
CLOUDINARY_CLOUD_NAME=dnb0h7nxh
CLOUDINARY_API_KEY='326728717932598'
CLOUDINARY_API_SECRET=wEmeP1MprjRCBiS3y2nk7vuqXaw
```

<br>

## Instalação do MongoDB:

Linux:

```
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod.service
```

Windowns 10:

```


```

<br>

## Execute os comandos:

```
npm i

npm run dev
```

<br>

## Populando o banco de dados:

Acesse a página:

```
localhost:3000/api/seed
```

<br>

## Usuário ADM:

```
e-mail: admin@email.com

senha: 123456
```
