const ReviewDAO = require("../daos/reviewDao");

const ReviewController = {
  getAll(req, res) {
    try {
      const reviews = ReviewDAO.getAll();
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  },
  getById(req, res) {
    try {
      const review = ReviewDAO.getById(req.params.id);
      if (!review) return res.status(404).json({ error: "Not found" });
      res.json(review);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch review" });
    }
  },
  getByResourceId(req, res) {
    try {
      const reviews = ReviewDAO.getByResourceId(req.params.resource_id);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  },
  create(req, res) {
    try {
      const review = req.body;
      if (!review.resource_id || !review.review || !review.user_id)
        return res.status(400).json({ error: "Missing required fields" });
      const result = ReviewDAO.create(review);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to create review" });
    }
  },
  update(req, res) {
    try {
      const review = req.body;
      const id = req.params.id;
      const existing = ReviewDAO.getById(id);
      if (!existing) return res.status(404).json({ error: "Not found" });
      ReviewDAO.update(id, review);
      res.json({ message: "Updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update review" });
    }
  },
  delete(req, res) {
    try {
      const id = req.params.id;
      const existing = ReviewDAO.getById(id);
      if (!existing) return res.status(404).json({ error: "Not found" });
      ReviewDAO.delete(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  },
};

module.exports = ReviewController;
