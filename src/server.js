require('dotenv-safe').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');

const server = express();

mongoose.connect(
  'mongodb+srv://instagram-api:5wulwVIMVMCaKT0F@cluster0-5eu39.mongodb.net/instagram?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));
server.use(routes);
server.listen(3333);
