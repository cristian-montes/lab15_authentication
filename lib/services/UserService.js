const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class UserService {

    
  static async create({ email, password }){
   
    const userInDB = await User.findExistingEmail(email);
    if(userInDB){
      throw new Error('email already exists, please a new email');
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
