const pool = require('../config/db');
class BaseModel {
  constructor(table) { this.table = table; }
  async all(where = '', params = []) {
    const q = `SELECT * FROM ${this.table} ${where} ORDER BY created_at DESC`;
    const { rows } = await pool.query(q, params);
    return rows;
  }
  async find(id) {
    const { rows } = await pool.query(`SELECT * FROM ${this.table} WHERE id=$1`, [id]);
    return rows[0] || null;
  }
  async findOne(field, val) {
    const { rows } = await pool.query(`SELECT * FROM ${this.table} WHERE ${field}=$1`, [val]);
    return rows[0] || null;
  }
  async create(data) {
    const keys = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await pool.query(`INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${placeholders}) RETURNING *`, vals);
    return rows[0];
  }
  async update(id, data) {
    const keys = Object.keys(data);
    const vals = Object.values(data);
    const set = keys.map((k, i) => `${k}=$${i + 1}`).join(',');
    const { rows } = await pool.query(`UPDATE ${this.table} SET ${set} WHERE id=$${keys.length + 1} RETURNING *`, [...vals, id]);
    return rows[0];
  }
  async remove(id) {
    await pool.query(`DELETE FROM ${this.table} WHERE id=$1`, [id]);
    return true;
  }
  async query(sql, params){ const {rows}=await pool.query(sql,params); return rows; }
}
module.exports = BaseModel;
