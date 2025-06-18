import express from "express";
import { fetchAndStoreListings, getListings } from "../controllers/listingController.js";

const router = express.Router();

/**
 * @swagger
 * /api/listings/{customerId}:
 *   get:
 *     summary: Fetch and store listings for a customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Successfully fetched and stored listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inserted:
 *                   type: number
 *                   description: Number of new listings inserted
 *       400:
 *         description: Missing customerId
 *       500:
 *         description: Server error
 */
router.get("/:customerId", fetchAndStoreListings);

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Get listings for a customer
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title or description
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of items to return
 *     responses:
 *       200:
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: Total number of listings
 *                 listings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       listingId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       image:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Missing customerId
 *       500:
 *         description: Server error
 */
router.get("/", getListings);

export default router;
