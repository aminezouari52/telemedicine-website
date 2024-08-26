const express = require("express");
const authCheck = require("../../middlewares/auth");

const router = express.Router();

const doctorController = require("../../controllers/doctor.controller");

router.route("/:id").patch(authCheck, doctorController.updateDoctor);

// router.post("/profile-image", (req, res) => {
//   res.send("success");
// });

router
  .route("/profile-image")
  .post(authCheck, doctorController.uploadProfilePicture);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management and retrieval
 *
 * @swagger
 * /doctors/{id}:
 *   patch:
 *     summary: Update a doctor
 *     description: Logged in doctors can only update their own information.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               phone:
 *                 type: string
 *               address:
 *                  type: string
 *               city:
 *                  type: string
 *               zip:
 *                  type: number
 *               description:
 *                  type: string
 *               hospital:
 *                  type: string
 *               specialty:
 *                  type: string
 *               price:
 *                  type: number
 *               degrees:
 *                  type: array
 *                  items:
 *                    type: string
 *               certifications:
 *                  type: array
 *                  items:
 *                    type: string
 *               schedule:
 *                  type: array
 *                  items:
 *                    type: string
 *               experience:
 *                    type: string
 *             example:
 *               firstName: john
 *               lastName: doe
 *               age: 32
 *               phone: 23423432
 *               address: 123 Health St, Apt 4B
 *               city: Medicity
 *               zip: 12345
 *               description: Experienced cardiologist specializing in heart surgeries and patient care.
 *               hospital: Hôpital Mongi Slim
 *               specialty: Généraliste
 *               price: 150
 *               degrees:
 *                 - "MD in Cardiology"
 *                 - "PhD in Cardiovascular Medicine"
 *               certifications:
 *                 - "American Board of Internal Medicine Certification"
 *                 - "Advanced Cardiac Life Support (ACLS)"
 *               schedule:
 *                 - "Lundi"
 *                 - "Samedi"
 *               experience: +5 ans
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Doctor'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
