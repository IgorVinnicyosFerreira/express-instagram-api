const UserModel = require('../models/User');

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
      return response.status(400).json({ error: exc });
    }
  },

  async get(request, response) {
    const { id } = request.params;

    try {
      const user = await UserModel.findById(id);

      if (!user) throw 'Usuário não encontrado';

      return response.json(user);
    } catch (exc) {
      return response.status(400).json({ error: exc });
    }
  },

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
  },

  async update(request, response) {
    const { name, username, birthday, genre, email, phone, bio } = request.body;
    const user_id = request.user._id;

    try {
      const user = await UserModel.findById(user_id);

      if (!user) throw 'Usuário não encontrado';

      user.overwrite({ name, username, birthday, genre, email, phone, bio });

      await user.save();

      return response.json(user);
    } catch (exc) {
      return response.status(400).status({ error: exc });
    }
  }
};
