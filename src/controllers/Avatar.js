const UserModel = require('../models/User');
const FileModel = require('../models/File');
const fs = require('fs');

module.exports = {
  async get(request, response) {
    const user = await UserModel.findById(request.user._id).populate('avatar');

    return response.json(user.avatar);
  },

  async save(request, response) {
    try {
      if (!request.file) throw 'Arquivo não informado';

      const user = await UserModel.findById(request.user._id).populate('avatar');

      if (user.avatar) {
        await user.avatar.remove();
      }

      const file = await FileModel.create({ path: request.file.key });

      user.avatar = file;

      await user.save();

      return response.json(file);
    } catch (exc) {
      return response.status(400).json({ error: exc });
    }
  }
};
