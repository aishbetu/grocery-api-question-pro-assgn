// adminController.ts
import { Request, Response } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import fs from 'fs';
import util from 'util';
import pool from '../../database';
import { upload } from '../middlewares/multerConfig';

interface GroceryItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
    inventory: number;
}

const uploadSingle = util.promisify(upload.single('image'));

export const addGroceryItem = async (req: Request, res: Response) => {
    try {
        await uploadSingle(req, res); // Await the result of the promisified middleware

        const { name, price, inventory } = req.body;
        const imageFile = req.file; // Access the uploaded file using req.file
        console.log(req.file);
        
        // Check if image file is provided
        if (!imageFile) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Move the uploaded file to a location on your server
        const fileName = Date.now() + '-' + imageFile.originalname;
        const uploadPath = './uploads/' + fileName;

        // Create a read stream from the uploaded file
        const readStream = fs.createReadStream(imageFile.path);

        // Create a write stream to the desired location
        const writeStream = fs.createWriteStream(uploadPath);

        // Pipe the read stream to the write stream to copy the file
        readStream.pipe(writeStream);

        // Insert the grocery item into the database
        await pool.query('INSERT INTO grocery_items (name, price, image_url, inventory) VALUES (?, ?, ?, ?)', [name, price, uploadPath, inventory]);

        res.status(201).json({ message: 'Grocery item added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const viewGroceryItems = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM grocery_items');
        const groceryItems: GroceryItem[] = rows.map((row: RowDataPacket) => ({
            id: row.id,
            name: row.name,
            price: row.price,
            image_url: row.image_url,
            inventory: row.inventory
        }));
        res.json(groceryItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeGroceryItem = async (req: Request, res: Response) => {
    const itemId = req.params.id;

    try {
        await pool.query('DELETE FROM grocery_items WHERE id = ?', [itemId]);
        res.json({ message: 'Grocery item removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Import necessary modules and dependencies

// Define the updateGroceryItem function
export const updateGroceryItem = async (req: Request, res: Response) => {
    try {
        // Handle file upload if a new image is provided
        await uploadSingle(req, res);

        // Extract the updated information from the request body
        const { name, price, inventory } = req.body;
        const imageFile = req.file;

        // Check if the ID is provided in the request parameters
        const itemId = req.params.id;
        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }

        // Check if the image file is provided
        let imageUrl = ''; // Initialize imageUrl variable
        if (imageFile) {
            // If a new image is provided, save it and update the imageUrl
            const fileName = Date.now() + '-' + imageFile.originalname;
            const uploadPath = './uploads/' + fileName;

            // Create a read stream from the uploaded file
            const readStream = fs.createReadStream(imageFile.path);

            // Create a write stream to the desired location
            const writeStream = fs.createWriteStream(uploadPath);

            // Pipe the read stream to the write stream to copy the file
            readStream.pipe(writeStream);

            imageUrl = uploadPath;
        }

        // Update the grocery item in the database
        const query = 'UPDATE grocery_items SET name = ?, price = ?, image_url = ?, inventory = ? WHERE id = ?';
        const values = [name, price, imageUrl, inventory, itemId];
        await pool.query(query, values);

        res.status(200).json({ message: 'Grocery item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const manageInventory = async (req: Request, res: Response) => {
    const itemId = req.params.id;
    const { inventory } = req.body;

    try {
        await pool.query('UPDATE grocery_items SET inventory = ? WHERE id = ?', [inventory, itemId]);
        res.json({ message: 'Inventory managed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
