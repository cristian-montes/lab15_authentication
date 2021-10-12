const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {
    const { userId } = req.cookies;
    req.user = jwt.verify(userId, process.env.APP_SECRETE);
    next();
  } catch (error) {
    error.status = 401;
    next(error);
    
  }



};


// if(!req.user){
//   throw new Error('Must be signed in to continue');
// }
