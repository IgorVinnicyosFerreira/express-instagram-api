const UserModel = require('../models/User');
const error = require('../util/Error');

module.exports = {
  async index(request, response) {
    const { searchTerm } = request.query;

    try {
      const query = searchTerm
        ? {
            $or: [
              { name: new RegExp(`^${searchTerm}`, 'i') },
              { username: new RegExp(`^${searchTerm}`, 'i') }
            ]
          }
        : {};

      const users = await UserModel.find(query)
        .populate('avatar')
        .sort({ name: searchTerm ? -1 : 1 });

      return response.json(users);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async get(request, response) {
    const { id } = request.params;

    try {
      const user = await UserModel.findById(id);

      if (!user) return response.status(204).json({ msg: 'Usuário não encontrado' });

      return response.json(user);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async create(request, response, next) {
    const { name, username, birthday, genre } = request.body;

    try {
      const userExists = await UserModel.findOne({ username: username });

      if (userExists)
        return response
          .status(400)
          .json(error(`Já existe um usuário cadastrado com o username ${username}`, 'username'));

      const user = await UserModel.create({ name, username, birthday, genre });

      request.user = user;
      next();
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async update(request, response) {
    const { name, username, birthday, genre, email, phone, bio } = request.body;
    const user_id = request.user._id;

    try {
      const user = await UserModel.findById(user_id);

      if (!user) return response.status(400).json(error('Usuário inexistente'));

      user.overwrite({ name, username, birthday, genre, email, phone, bio });

      await user.save();

      return response.json(user);
    } catch (exc) {
      return response.status(500).status(error(exc.message));
    }
  }
};
