//middleware to check if the user is authenticated
//Import jwt to decode the token
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    //extract the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    //verify  to decode the token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //extract the user id from the token
    const userId = decodedToken.userId;
    //check if the user id is present
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
