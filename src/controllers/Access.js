const AccessModel = require('../models/Access');
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const error = require('../util/Error');

module.exports = {
  async login(request, response) {
    const { username, password } = request.body;

    try {
      const user = await UserModel.findOne({ username });

      if (!user)
        return response.status(400).json(error('Username inválido', 'username'));

      const access = await AccessModel.findOne({ user });

      const validPassword = await bcrypt.compare(`${password}`, access.password);

      if (!validPassword)
        response.status(400).json(error('Senha inválida', 'password'));

      const token = await jwt.sign({ _id: user._id, username }, process.env.SECRET);

      return response.header('authorization', token).json(user);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async create(request, response) {
    const { password } = request.body;
    const user = request.user;

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(`${password}`, salt);

      const access = await AccessModel.create({ user, password: hash });

      return response.json(access);
    } catch (exc) {
      await UserModel.deleteOne({ _id: user._id });

      return response.status(500).json(error(exc.message));
    }
  }
};
