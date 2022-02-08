# Oui Pet

<p align="center">
  <a href="https://oui-pet-gim.vercel.app" target="_blanc" style="display: block">
    <img src="./public/images/logo.svg" width="200px"/>
  </a>
  Deploy feito na <a href="https://oui-pet-gim.vercel.app" target="_blanc">Vercel</a>
</p>

Projeto final da disciplina de Programação Web 2021/2 do CEFET-MG campus 2.

O objetivo do projeto é desenvolver um e-commerce de produtos para animais com a funcionalidade de realizar pagamentos via criptomoedas.

O que foi desenvolvido na entrega do Front-End:

- Tela de cadastro de usuários e produtos.
- Checkout completo em diferentes tipos de pagamentos.
- Painel de administrador e edição de usuários e produtos.
- Página de pesquisar produtos.
- Avaliação dos produtos pelo usuário
- Página de perfil para os clientes

## Integrantes

<div style="display: flex; justify-content: space-evenly">
  <a href="https://github.com/AllrightIsHere" align="center" style="border-radius: 8px; background-color: rgba(0, 0, 0, 0.1); overflow: hidden;">
    <img src="https://github.com/AllrightIsHere.png" height="auto" width="200" alt="Gabriel Arrighi Silva">
    <h3>Gabriel Arrighi</h3>
  </a>
  <a href="https://github.com/IagorSs" align="center" style="border-radius: 8px; background-color: rgba(0, 0, 0, 0.1); overflow: hidden;">
    <img src="https://github.com/IagorSs.png" height="auto" width="200" alt="Iagor de Sousa Penaranda Silva">
    <h3>Iagor de Sousa</h3>
  </a>
  <a href="https://github.com/MarceloFCandido" align="center" style="border-radius: 8px; background-color: rgba(0, 0, 0, 0.1); overflow: hidden;">
    <img src="https://github.com/MarceloFCandido.png" height="auto" width="200" alt="Marcelo Lopes de Macedo Ferreira Cândido">
    <h3>Marcelo Lopes</h3>
  </a>
</div>

## Instalação

### MongoDB

#### Linux

```bash
$sudo apt update
$sudo apt install mongodb-org
$sudo systemctl start mongod.service
```

#### Windows 10

Faça o download da [versão community](https://www.mongodb.com/try/download/community) e sigas nas etapas

### Dependências do projeto

```bash
$npm install
```

## Configuração

### Arquivo .env

O projeto tem um arquivo `.env.example`, a partir dele você deve criar o arquivo `.env` e preencher os valores de cada uma das variáveis.

## Testando se tudo deu certo

**DEPOIS** de ter feito todos os passos anteriores você pode rodar o comando abaixo para começar a rodar o projeto

```bash
$npm run dev
```

Se tiver dado tudo certo você poderá acessar o site no [localhost:3000](http://localhost:3000)

## Populando o banco de dados

Acessar a rota [/api/seed](http://localhost:3000/api/seed) para popular o banco com dados iniciais.

Os dados que serão usados para popular a base podem ser encontrados em [utils/data.js](./utils/data.js).
