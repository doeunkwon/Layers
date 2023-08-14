import express, { type Request, type Response } from 'express';
import { sql } from '../../utils/sqlImport';
import { getItemCore, responseCallback, responseCallbackDelete, responseCallbackPost, responseCallbackUpdate } from '../../utils/responseCallback';
const router = express.Router();

// Endpoint for creating a specific clothing item
router.post('/', (req: Request, res: Response): void => {
  const { image, category, title, brands, size, color, uid } = req.body;
  const insertClothingItem = async (): Promise<any> => {
    try {
      await sql`INSERT INTO backend_schema.clothing_item (image, category, title, brands, size, color, uid)
        VALUES (${image}, ${category},${title}, ${brands}, ${size}, ${color}, ${uid})
      `;

      responseCallbackPost(null, res, 'Clothing Item')
    } catch (error) {
      responseCallbackPost(error, res)
    }
  };
  void insertClothingItem();
});

// Endpoint for deleting a specific outfit
router.delete('/:ciid', (req: any, res: any): void => {
  const { ciid } = req.params;
  const deleteItem = async (ciid: string): Promise<void> => {
    try {
      await sql`DELETE FROM backend_schema.clothing_item WHERE ciid = ${ciid}`;
  
      // gives successful feedback on clothing items that don't exist
      responseCallbackDelete(null, ciid, res, 'Clothing Item')
    } catch (error) {
      responseCallbackDelete(error, ciid, res)
    }

  };

  void deleteItem(ciid);
});

// Endpoint for updating a specific outfit
router.put('/:ciid', (req: any, res: any): void => {
    // Extract outfit data from the request body
    const { ciid } = req.params;
    const { image, category, title, brands, size, color } = req.body;

    const updateItem = async (ciid: string): Promise<void> => {
      // Update the outfit in the database
      try {
        const item = await getItemCore(ciid);
        await sql`
          UPDATE backend_schema.clothing_item
          SET image = ${image},
              category = ${category},
              title = ${title},
              brands = ${brands},
              size = ${size},
              color = ${color}
          WHERE ciid = ${ciid}
        `;

        // responds with successful update even when no changes are made
        responseCallbackUpdate(null, ciid, res, item, "Clothing Item");
      } catch (error) {
        responseCallbackUpdate(error, ciid, res)
      }
  
    };

    void updateItem(ciid);
});

module.exports = router;