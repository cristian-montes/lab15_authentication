module.exports = (req, res, next) => {

  const { userId } = req.cookies;
  if(!userId){
    throw new Error('Must be signed in to continue');
  }

  req.userId = userId;

  next();
};
