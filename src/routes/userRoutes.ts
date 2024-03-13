// userRoutes.ts
import express from 'express';
import { viewGroceryItems, bookGroceryItems } from '../controllers/userController';
import { userAuth } from '../middlewares/userAuthMiddleware';

const router = express.Router();

// Apply user authentication middleware to all routes in this router
router.use(userAuth);

// Define routes
router.get('/grocery-items', viewGroceryItems);
router.post('/book-items', bookGroceryItems);

export default router;
