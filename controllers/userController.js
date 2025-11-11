const UserDAO = require("../daos/userDao");
const bcrypt = require("bcryptjs");

const UserController = {
  getAll(req, res) {
    try {
      const users = UserDAO.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
  getById(req, res) {
    try {
      const user = UserDAO.getById(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },
  create(req, res) {
    try {
      const { username, password, isAdmin } = req.body;
      if (!username || !password)
        return res.status(400).json({ error: "Missing required fields" });
      const hashed = bcrypt.hashSync(password, 10);
      const result = UserDAO.create({ username, password: hashed, isAdmin });
      res.status(201).json({ id: result.id, username, isAdmin: isAdmin || 0 });
    } catch (err) {
      res.status(500).json({ error: "Failed to create user" });
    }
  },
  update(req, res) {
    try {
      const { username, password, isAdmin } = req.body;
      const id = req.params.id;
      const existing = UserDAO.getById(id);
      if (!existing) return res.status(404).json({ error: "Not found" });
      const hashed = password
        ? bcrypt.hashSync(password, 10)
        : existing.password;
      UserDAO.update(id, { username, password: hashed, isAdmin });
      res.json({ message: "Updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update user" });
    }
  },
  delete(req, res) {
    try {
      const id = req.params.id;
      const existing = UserDAO.getById(id);
      if (!existing) return res.status(404).json({ error: "Not found" });
      UserDAO.delete(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};

module.exports = UserController;
