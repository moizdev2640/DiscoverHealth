const db = require("../db");

const UserDAO = {
  getAll() {
    return db.prepare("SELECT id, username, isAdmin FROM users").all();
  },
  getById(id) {
    return db
      .prepare("SELECT id, username, isAdmin FROM users WHERE id = ?")
      .get(id);
  },
  getByUsername(username) {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  },
  create(user) {
    const stmt = db.prepare(
      "INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)"
    );
    const info = stmt.run(user.username, user.password, user.isAdmin || 0);
    return { id: info.lastInsertRowid };
  },
  update(id, user) {
    const stmt = db.prepare(
      "UPDATE users SET username = ?, password = ?, isAdmin = ? WHERE id = ?"
    );
    return stmt.run(user.username, user.password, user.isAdmin, id);
  },
  delete(id) {
    return db.prepare("DELETE FROM users WHERE id = ?").run(id);
  },
};

module.exports = UserDAO;
