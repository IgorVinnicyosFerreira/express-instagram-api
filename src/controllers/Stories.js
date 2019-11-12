const StorieModel = require('../models/Stories');
const FileModel = require('../models/File');
const UserModel = require('../models/User');
const error = require('../util/Error');

module.exports = {
  async index(request, response) {
    const userId = request.user._id;
    const { page } = request.query;
    const pageSize = 10;

    try {
      const user = await UserModel.findById(userId);
      const stories = await StorieModel.find({ author: { $in: user.followings } })
        .sort({ createdAt: 1 })
        .skip(pageSize * page - pageSize)
        .limit(pageSize)
        .populate('media')
        .populate({
          path: 'author',
          select: {
            name: 1,
            avatar: 1
          },
          populate: {
            path: 'avatar',
            select: {
              url: 1,
              path: 1
            }
          }
        });

      return response.json(stories);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },
  async create(request, response) {
    const path = request.file.key;
    const userId = request.user._id;

    try {
      const file = await FileModel.create({ path });

      await StorieModel.create({
        media: file,
        author: userId
      });

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    const { storiesId } = request.params;

    try {
      const stories = await StorieModel.findById(storiesId).populate('media');

      await stories.media.remove();
      await stories.remove();

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
