const HealthcareResourceDAO = require("../daos/healthcareResourceDao");

const HealthcareResourceController = {
  getAll(req, res) {
    try {
      const resources = HealthcareResourceDAO.getAll();
      res.json(resources);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  },
  getById(req, res) {
    try {
      const resource = HealthcareResourceDAO.getById(req.params.id);
      if (!resource) return res.status(404).json({ error: "Not found" });
      res.json(resource);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  },
  create(req, res) {
    try {
      const resource = req.body;
      if (!resource.name || !resource.category)
        return res.status(400).json({ error: "Missing required fields" });
      const result = HealthcareResourceDAO.create(resource);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to create resource" });
    }
  },
  update(req, res) {
    try {
      const resource = req.body;
      const id = req.params.id;
      const existing = HealthcareResourceDAO.getById(id);
      if (!existing) return res.status(404).json({ error: "Not found" });
      HealthcareResourceDAO.update(id, resource);
      res.json({ message: "Updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update resource" });
    }
  },
  delete(req, res) {
    try {
      const id = req.params.id;
      const existing = HealthcareResourceDAO.getById(id);
      if (!existing) return res.status(404).json({ error: "Not found" });
      HealthcareResourceDAO.delete(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete resource" });
    }
  },
};

module.exports = HealthcareResourceController;
