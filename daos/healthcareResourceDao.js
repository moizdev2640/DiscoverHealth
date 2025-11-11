const db = require("../db");

const HealthcareResourceDAO = {
  getAll() {
    return db.prepare("SELECT * FROM healthcare_resources").all();
  },
  getById(id) {
    return db
      .prepare("SELECT * FROM healthcare_resources WHERE id = ?")
      .get(id);
  },
  create(resource) {
    const stmt = db.prepare(
      `INSERT INTO healthcare_resources (name, category, country, region, lat, lon, description, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      resource.name,
      resource.category,
      resource.country,
      resource.region,
      resource.lat,
      resource.lon,
      resource.description,
      resource.recommendations || 0
    );
    return { id: info.lastInsertRowid };
  },
  update(id, resource) {
    const stmt = db.prepare(
      `UPDATE healthcare_resources SET name = ?, category = ?, country = ?, region = ?, lat = ?, lon = ?, description = ?, recommendations = ? WHERE id = ?`
    );
    return stmt.run(
      resource.name,
      resource.category,
      resource.country,
      resource.region,
      resource.lat,
      resource.lon,
      resource.description,
      resource.recommendations,
      id
    );
  },
  delete(id) {
    return db.prepare("DELETE FROM healthcare_resources WHERE id = ?").run(id);
  },
};

module.exports = HealthcareResourceDAO;
