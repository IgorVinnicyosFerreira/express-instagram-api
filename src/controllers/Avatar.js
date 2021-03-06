const UserModel = require('../models/User');
const FileModel = require('../models/File');
const error = require('../util/Error');

module.exports = {
  async get(request, response) {
    const user = await UserModel.findById(request.user._id).populate('avatar');

    return response.json(user.avatar);
  },

  async create(request, response) {
    try {
      if (!request.file) return response.status(400).json(error('Arquivo não informado', 'file'));

      const user = await UserModel.findById(request.user._id).populate('avatar');

      if (user.avatar) {
        await user.avatar.remove();
      }

      const file = await FileModel.create({ path: request.file.key });

      user.avatar = file;

      await user.save();

      return response.json(file);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    try {
      const user = await UserModel.findById(request.user._id).populate('avatar');

      await user.avatar.remove();

      user.avatar = undefined;
      await user.save();

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
