const UserModel = require('../models/User');

module.exports = {

    async index(request, response){
        const userId = request.user._id;
        const { searchTerm, page } = request.query;

        try {  
            const pageSize = 10;

            const searchQuery = searchTerm
            ? {
                $or: [
                  { name: new RegExp(`^${searchTerm}`, 'i') },
                  { username: new RegExp(`^${searchTerm}`, 'i') }
                ]
              }
            : {};

            const user = await UserModel.findById(userId)
            .populate({
                path: 'followers',
                match: {
                    ...searchQuery,
                },
                options: {
                    skip: (pageSize * page) - pageSize,
                    sort: { username : 1 },
                    limit: pageSize
                }
            });

            return response.json(user.followers);
        } catch (error) {
            return response.status(400).json({ error : error.message });
        }
    }

}