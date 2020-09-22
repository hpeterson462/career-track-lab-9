const pool = require("../utils/pool");

module.exports = class Log {
  recipe_id;
  date_of_event;
  notes;
  rating;

  constructor(row) {
    this.recipe_id = row.recipe_id;
    this.date_of_event = row.date_of_event;
    this.notes = row.notes;
    this.rating = row.rating;
  }

  static async insert(log) {
    const { rows } = await pool.query(
      `INSERT into logs (recipe_id, date_of_event, notes, rating) 
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [log.recipe_id, log.date_of_event, log.notes, log.rating]
    );

    return new Log(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM logs'
    );

    return rows.map(row => new Log(row));
  }
}