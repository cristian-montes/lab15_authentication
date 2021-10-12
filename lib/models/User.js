const pool =  require('../utils/pool');
const Role = require('./Role');
const jwt = require('jsonwebtoken');

module.exports = class User {
  // id;
  // email;
  // hashPassword;
  // role;

  constructor(row){
    this.id =  row.id;
    this.email = row.email;
    this.hashPassword = row.password_hash;
    this.role = row.role;
  }

  //INSERTS NEW USER INTO THE DB
  static async insert({ email, hashPassword, roleTitle }){

    const role =  await Role.findByTitle(roleTitle);
    
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *', [email, hashPassword, role.id]
    );
    return new User({ ...rows[0], role:role.role_title });


  }


  //LOOKS FOR EXISTING USER IN THE DB... HELPER FUNCTION TO THE ABOVE
  static async findExistingEmail(email){
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email=$1', [email]
    );

    if(!rows[0]) return null;
   
    const role = await Role.findById(rows[0].role_id);
 
    return new User({ ...rows[0], role:role.role_title });
  }

  //LOOKS FOR EXISTING USER BY ID... GET ME CRUD ROUTE
  static async findUserById(id){
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id=$1', [id]
    );

    if(!rows[0]) return null;
    
    return new User(rows[0]);
  }
    

  authToken(){
    return jwt.sign(this.toJSON(), process.env.APP_SECRETE, {
      expiresIn: '24h'
    });
  }


  toJSON(){
    return{
      id:this.id,
      email: this.email,
      role: this.role
    };
  }


};
