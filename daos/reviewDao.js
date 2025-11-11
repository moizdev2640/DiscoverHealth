const db = require("../db");

const ReviewDAO = {
  getAll() {
    return db.prepare("SELECT * FROM reviews").all();
  },
  getById(id) {
    return db.prepare("SELECT * FROM reviews WHERE id = ?").get(id);
  },
  getByResourceId(resource_id) {
    return db
      .prepare("SELECT * FROM reviews WHERE resource_id = ?")
      .all(resource_id);
  },
  create(review) {
    const stmt = db.prepare(
      "INSERT INTO reviews (resource_id, review, user_id) VALUES (?, ?, ?)"
    );
    const info = stmt.run(review.resource_id, review.review, review.user_id);
    return { id: info.lastInsertRowid };
  },
  update(id, review) {
    const stmt = db.prepare(
      "UPDATE reviews SET resource_id = ?, review = ?, user_id = ? WHERE id = ?"
    );
    return stmt.run(review.resource_id, review.review, review.user_id, id);
  },
  delete(id) {
    return db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
  },
};

module.exports = ReviewDAO;
