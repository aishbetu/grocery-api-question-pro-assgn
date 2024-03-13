// adminRoutes.ts
import { Router } from 'express';
import { addGroceryItem, viewGroceryItems, removeGroceryItem, updateGroceryItem, manageInventory } from '../controllers/adminController';
import { adminAuth } from '../middlewares/adminAuthMiddleware';

const router = Router();

// Apply adminAuth middleware to all routes in this file
router.use(adminAuth);

// Routes for admin functionalities
router.post('/grocery-items', addGroceryItem);  // Add new grocery item
router.get('/grocery-items', viewGroceryItems);  // View existing grocery items
router.delete('/grocery-items/:id', removeGroceryItem);  // Remove grocery item
router.put('/grocery-items/:id', updateGroceryItem);  // Update grocery item details
router.patch('/inventory/:id', manageInventory);  // Manage inventory levels

export default router;
