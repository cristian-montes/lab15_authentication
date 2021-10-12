const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class UserService {

  //CREATES A NEW USER AND CHECKS IF THE EMAIL IS ALREADY EXISTING
  static async create({ email, password, roleTitle }){
   
    const userInDB = await User.findExistingEmail(email);

    if(userInDB){
      throw new Error('Email credentials already exists');
  
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
   

    const user = await User.insert({
      email, 
      hashPassword,
      roleTitle
    });

    return user;
  }


  //SINGS IN AN EXISTING USER
  static async siginAuthorization({ email, password }){
    
    const userInDB = await User.findExistingEmail(email);

    if(!userInDB){
      const err = new Error('Wrong credentials, please try again');
      return err.status = 401;
    }
    
    const passwordComparation = await bcrypt.compare(
      password, 
      userInDB.hashPassword
    );

    if(!passwordComparation){
      const err = new Error('Wrong credentials, please try again');
      return err.status = 401;
    }
    
    return userInDB;
  }

  //--------------------------------------------------------------------------------//
  static async upgradeCustomer(id, objBody){
    const updgrades = await User.upgradesCustomerById(id, objBody);
    return updgrades;
  }




};
