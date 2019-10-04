const UserModel = require('../models/User');

module.exports = {
  async create(request, response, next) {
    const { name, username, birthday, genre } = request.body;

    try {
      const userExists = await UserModel.findOne({ username: username });

      if (userExists) {
        throw `Já existe um usuário cadastrado com o username ${username}`;
      }

      const user = await UserModel.create({ name, username, birthday, genre });

      request.user = user;

      next();
    } catch (exc) {
      return response.status(400).json({ error: exc });
    }
  }
};
