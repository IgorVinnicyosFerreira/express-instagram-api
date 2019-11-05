const PostModel = require('../models/Post');
const FileModel = require('../models/File');
const error = require('../util/Error');

module.exports = {

  async index(request, response) {
    const page = request.query.page || 1;
    const pageSize = 15;

    try {
      const postList = await PostModel
        .find()
        .sort({ createdAt: -1 })
        .populate('media')
        .skip((pageSize * page) - pageSize)
        .limit(pageSize);

      return response.json(postList);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async get(request, response) {
    const { id } = request.params;

    try {
      const post = await PostModel.findById(id).populate('media');

      return response.json(post);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async create(request, response) {
    const { description, location, noComments } = request.body;
    const files = request.files;
    const userId = request.user._id;

    try {

      const post = new PostModel({
        author: userId,
        description,
        location,
        media: [],
        noComments
      });


      files.forEach(async ({ key }, index) => {
        const file = await FileModel.create({ path: key });
        post.media.push(file);

        if (index + 1 === files.length) {
          await post.save();
          return response.json({ success: true, post });
        };
      });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    const { id } = request.params;

    try {
      const post = await PostModel.findById(id).populate('media');

      post.media.forEach(async (file, index) => {
        await file.remove();

        if (index + 1 === post.media.length)
          post.remove();
      });

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
