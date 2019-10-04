const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  let token = request.headers['authorization'];

  if (!token) return response.status(401).json({ auth: false, message: 'Token não informado' });

  token = token.replace('Bearer ', '');

  if (token === '') return response.status(401).json({ auth: false, message: 'Token inválido' });

  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) return response.status(401).json({ auth: false, message: 'Falha ao autenticar' });

    request.user = {
      _id: decoded._id,
      username: decoded.username
    };
    next();
  });
};
