const express = require("express");
const controller = require("../controllers/healthcareResourceController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HealthcareResources
 *   description: Healthcare resources management
 */
/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Get all healthcare resources
 *     tags: [HealthcareResources]
 *     responses:
 *       200:
 *         description: List of resources
 *   post:
 *     summary: Create a healthcare resource
 *     tags: [HealthcareResources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthcareResource'
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get a resource by ID
 *     tags: [HealthcareResources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resource found
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a resource by ID
 *     tags: [HealthcareResources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthcareResource'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a resource by ID
 *     tags: [HealthcareResources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
