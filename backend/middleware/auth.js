const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  //try catch block to handle errors
  try {
    //extract token from the request headers split to delete the bearer part and take the token
    const token = req.headers.authorization.split(' ')[1]
    //verify  to decode the token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
    //extract the user id from the token
    const userId = decodedToken.userId
    //
    req.auth = {
      userId: userId,
    }
    //tout est ok on passe à la fonction next
    next()
  } catch (error) {
    res.status(401).json({ error })
  }
}
