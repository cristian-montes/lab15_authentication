const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class UserService {

    
  static async create({ email, password }){
   
    const userInDB = await User.findExistingEmail(email);
    if(userInDB){
      const err = new Error('Email already exists');
      return err.status = 400;
      
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
   

    const user = await User.insert({
      email, 
      hashPassword,
    });

    return user;
  }






};
