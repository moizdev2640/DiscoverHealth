const UserDAO = require("../daos/userDao");
const bcrypt = require("bcryptjs");

const AuthController = {
  async register(req, res) {
    try {
      const { username, password, isAdmin } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      // Check if user already exists
      const existingUser = UserDAO.getByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create user
      const result = UserDAO.create({
        username,
        password: hashedPassword,
        isAdmin: isAdmin || 0,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: result.id,
          username,
          isAdmin: isAdmin || 0,
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      // Find user
      const user = UserDAO.getByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user info without password
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to login" });
    }
  },
};

module.exports = AuthController;
