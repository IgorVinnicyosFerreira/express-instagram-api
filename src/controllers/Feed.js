const PostModel = require('../Models/Post');
const UserModel = require('../Models/User');

module.exports = {

    async index(request, response){
        const userId = reques.user._id;

        try {
            const user = await UserModel.findById(userId);

            //procurar posts dos usuarios que o usuario segue
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}