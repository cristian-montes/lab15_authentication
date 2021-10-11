const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
     
    try {
      const user = await UserService.create({ ...req.body, roleTitle: 'CUSTOMER' });

      res.cookie('userId', user.authToken(), {
        httpOnly: true,
        maxAge:ONE_DAY_IN_MS,
      });

      res.send(user);
    } catch (err) {
      err.status = 400;
      next(err);    
    }
  })
  .post('/signin', async (req, res, next) => {
    try {
      const user = await UserService.siginAuthorization(req.body);

      res.cookie('userId', user.id, {
        httpOnly: true,
        maxAge:ONE_DAY_IN_MS,
      });
      res.send(user);

    } catch (error) {
      error.status = 401;
      next(error);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try {

      const signedUser = await User.findUserById(req.userId);
      res.send(signedUser);

    } catch (error) {
      next(error);
    }
  });
