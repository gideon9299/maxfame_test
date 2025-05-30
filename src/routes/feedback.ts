import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Feedback } from "../models/feedback";

const router = Router();

// Zod validation schemas
const createFeedbackSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email format"),
  feedback: z.string().min(1, "Feedback is required").trim(),
  rate: z
    .number()
    .int()
    .min(1, "Rate must be at least 1")
    .max(5, "Rate must be at most 5"),
});

const updateFeedbackSchema = z.object({
  name: z.string().min(1, "Name is required").trim().optional(),
  email: z.string().email("Invalid email format").optional(),
  feedback: z.string().min(1, "Feedback is required").trim().optional(),
  rate: z
    .number()
    .int()
    .min(1, "Rate must be at least 1")
    .max(5, "Rate must be at most 5")
    .optional(),
});

const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

// Validation middleware
const validateCreateFeedback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = createFeedbackSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }
    res.status(400).json({ message: "Invalid request data" });
  }
};

const validateUpdateFeedback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = updateFeedbackSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }
    res.status(400).json({ message: "Invalid request data" });
  }
};

const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    idParamSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid ID format",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }
    res.status(400).json({ message: "Invalid ID format" });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - feedback
 *         - rate
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Name of the person providing feedback
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the person providing feedback
 *         feedback:
 *           type: string
 *           description: The feedback content
 *         rate:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateFeedbackRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - feedback
 *         - rate
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the person providing feedback
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the person providing feedback
 *         feedback:
 *           type: string
 *           description: The feedback content
 *         rate:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *     UpdateFeedbackRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the person providing feedback
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the person providing feedback
 *         feedback:
 *           type: string
 *           description: The feedback content
 *         rate:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation error"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */

/**
 * Feedback Controller Functions
 */
const feedbackController = {
  // Create a new feedback
  async create(req: Request, res: Response) {
    try {
      const feedback = new Feedback(req.body);
      await feedback.save();
      res.status(201).json(feedback);
    } catch (error: any) {
      res.status(400).json({
        message: error?.message || "Error creating feedback",
        error: error.code === 11000 ? "Duplicate entry" : undefined,
      });
    }
  },

  // Get all feedback
  async getAll(req: Request, res: Response) {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      res.json(feedbacks);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error?.message || "Error fetching feedback" });
    }
  },

  // Get feedback by ID
  async getById(req: Request, res: Response) {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        res.status(404).json({ message: "Feedback not found" });
        return;
      }
      res.json(feedback);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error?.message || "Error fetching feedback" });
    }
  },

  // Update feedback
  async update(req: Request, res: Response) {
    try {
      // Don't update empty objects
      if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "No data provided for update" });
        return;
      }

      const feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!feedback) {
        res.status(404).json({ message: "Feedback not found" });
        return;
      }
      res.json(feedback);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error?.message || "Error updating feedback" });
    }
  },

  // Delete feedback
  async delete(req: Request, res: Response) {
    try {
      const feedback = await Feedback.findByIdAndDelete(req.params.id);
      if (!feedback) {
        res.status(404).json({ message: "Feedback not found" });
        return;
      }
      res.json({ message: "Feedback deleted successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error?.message || "Error deleting feedback" });
    }
  },

  // Get feedback statistics
  async getStats(req: Request, res: Response) {
    try {
      const stats = await Feedback.aggregate([
        {
          $group: {
            _id: null,
            totalFeedbacks: { $sum: 1 },
            averageRating: { $avg: "$rate" },
            ratings: {
              $push: "$rate",
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalFeedbacks: 1,
            averageRating: { $round: ["$averageRating", 2] },
            ratingDistribution: {
              rating5: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    cond: { $eq: ["$$this", 5] },
                  },
                },
              },
              rating4: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    cond: { $eq: ["$$this", 4] },
                  },
                },
              },
              rating3: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    cond: { $eq: ["$$this", 3] },
                  },
                },
              },
              rating2: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    cond: { $eq: ["$$this", 2] },
                  },
                },
              },
              rating1: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    cond: { $eq: ["$$this", 1] },
                  },
                },
              },
            },
          },
        },
      ]);

      const result =
        stats.length > 0
          ? stats[0]
          : {
              totalFeedbacks: 0,
              averageRating: 0,
              ratingDistribution: {
                rating5: 0,
                rating4: 0,
                rating3: 0,
                rating2: 0,
                rating1: 0,
              },
            };

      res.json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: error?.message || "Error generating feedback statistics",
        });
    }
  },
};

/**
 * Feedback Routes
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeedbackRequest'
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Validation error or invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/", validateCreateFeedback, feedbackController.create);

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback (sorted by creation date, newest first)
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: List of all feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 */
router.get("/", feedbackController.getAll);

/**
 * @swagger
 * /api/feedback/stats:
 *   get:
 *     summary: Get feedback statistics
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Feedback statistics including total count, average rating, and rating distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalFeedbacks:
 *                   type: number
 *                   description: Total number of feedback entries
 *                 averageRating:
 *                   type: number
 *                   description: Average rating (rounded to 2 decimal places)
 *                 ratingDistribution:
 *                   type: object
 *                   properties:
 *                     rating5:
 *                       type: number
 *                     rating4:
 *                       type: number
 *                     rating3:
 *                       type: number
 *                     rating2:
 *                       type: number
 *                     rating1:
 *                       type: number
 */
router.get("/stats", feedbackController.getStats);

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get a feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Feedback ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Feedback details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Feedback not found
 */
router.get("/:id", validateIdParam, feedbackController.getById);

/**
 * @swagger
 * /api/feedback/{id}:
 *   put:
 *     summary: Update a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Feedback ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeedbackRequest'
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Validation error or invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Feedback not found
 */
router.put(
  "/:id",
  validateIdParam,
  validateUpdateFeedback,
  feedbackController.update
);

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Feedback ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback deleted successfully"
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Feedback not found
 */
router.delete("/:id", validateIdParam, feedbackController.delete);

export default router;
