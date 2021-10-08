const pool =  require('../utils/pool');

module.exports = class User {
  // id;
  // email;
  // hashPassword;

  constructor(row){
    this.id =  row.id;
    this.email = row.email;
    this.hashPassword = row.password_hash;
  }

  //INSERTS NEW USER INTO THE DB
  static async insert({ email, hashPassword }){

    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', [email, hashPassword]
    );
    return new User(rows[0]);
  }

  //LOOKS FOR EXISTING USER IN THE DB... HELPER FUNCTION TO THE ABOVE
  static async findExistingEmail(email){
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email=$1', [email]
    );
    if(!rows[0]) return null;
        
    return new User(rows[0]);
  }
    

  //!!!!!!!!UNDERSTAND THIS MORE!!!!! ASK FOR HELP!!!!
  toJSON(){
    return{
      id:this.id,
      email: this.email
    };
  }


};
