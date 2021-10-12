const pool = require('../utils/pool');

module.exports = class Role {
  // id;
  // role_title;

  constructor(row){
    this.id = row.id;
    this.role_title = row.role_title;
  }

  static async findByTitle(role_title){
    const { rows } = await pool.query('SELECT * FROM roles WHERE role_title=$1', [role_title.toUpperCase()]);

    if (!rows[0]) return null;

    return new Role(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM roles WHERE id=$1', [id]);
    
    if (!rows[0]) return null;
    
    return new Role(rows[0]);
  }







};
