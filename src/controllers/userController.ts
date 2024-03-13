// userController.ts
import { NextFunction, Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../database';


interface GroceryItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
}

interface AuthenticatedRequest extends Request {
    user?: {
        id: string; 
    };
}
// Function to view available grocery items
export const viewGroceryItems = async (req: Request, res: Response) => {
    try {
        // Query to fetch available grocery items from the database
        const query = 'SELECT id, name, price, image_url FROM grocery_items WHERE inventory > 0';
        const [rows] = await pool.query<RowDataPacket[]>(query); // Provide type assertion for rows

        // If no grocery items are found
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No available grocery items found' });
        }

        // Send the list of available grocery items as the response
        res.status(200).json({ message: 'List of available grocery items', items: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to book multiple grocery items in a single order
export const bookGroceryItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get user ID from the authenticated user
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID not found' });
        }

        // Generate a unique order ID using UUID v4
        const orderId = uuidv4();

        // Extract the list of grocery items to be booked from the request body
        const { items } = req.body;

        // Begin a database transaction
    await pool.getConnection().then(async (conn) => {
        try {
            // Start transaction
            await conn.beginTransaction();

            // Loop through each item and insert booking record into bookingHistory table
            for (const item of items) {
                const { itemId, quantity } = item;

                // Insert booking record for the current item
                const query = 'INSERT INTO bookingHistory (userId, orderId, itemId, quantity) VALUES (?, ?, ?, ?)';
                await conn.query(query, [userId, orderId, itemId, quantity]);
                }

                // Commit the transaction
                await conn.commit();

                res.status(200).json({ message: 'Grocery items booked successfully', orderId });
            } catch (error) {
                // Rollback the transaction if any error occurs
                await conn.rollback();
                throw error;
            } finally {
                // Release the connection back to the pool
                conn.release();
            }
        }).catch(error => {
            console.error('Error obtaining connection:', error);
            res.status(500).json({ message: 'Server error' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
