import express, { type Request, type Response } from 'express';
import { pool } from '../../utils/sqlImport';
import { responseCallbackDelete, responseCallbackPost, responseCallbackUpdate, responseCallbackGet } from '../../utils/responseCallback';
import { checkAuthenticated } from '../../middleware/auth';
import axios from 'axios';
import { downloadURLFromS3 } from '../../s3/download-url-from-s3';
import { uploadURIToS3 } from '../../s3/upload-uri-to-s3';
const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
  const userId = req.user;
  const getUser = async (): Promise<void> => {
    try {
      const user = await pool.query('SELECT uid, first_name, last_name, email, username, profile_picture FROM backend_schema.user WHERE uid = $1', [userId]);
      const result = user.rows[0];

      responseCallbackGet(null, result, res, 'User');
    } catch (error) {
      responseCallbackGet(error, null, res);
    }
  };

  void getUser();
});
// Endpoint for creating a specific user
router.post('/', checkAuthenticated, (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    private_option,
    profile_picture,
    followers,
    following
  } = req.body;

  const insertUser = async (): Promise<void> => {
    try {
      await pool.query(`
      INSERT INTO backend_schema.user (
        first_name, last_name, email, username, password, private_option, followers, following, profile_picture
        ) VALUES ( 
          $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [first_name, last_name, email, username, password, private_option, followers, following, profile_picture]);

      responseCallbackPost(null, res, 'User');
    } catch (error) {
      responseCallbackPost(error, res);
    }
  };
  void insertUser();
});

// Endpoint for deleting a specific user
router.delete('/', checkAuthenticated, (req: Request, res: Response): void => {
  const userId = req.user as string;

  if (userId == null) return;

  const deleteUser = async (): Promise<void> => {
    try {
      const deleteUser = await pool.query('DELETE FROM backend_schema.user WHERE uid = $1', [userId]);
      responseCallbackDelete(null, userId, res, 'User', deleteUser.rowCount);
    } catch (error) {
      responseCallbackDelete(error, userId, res, 'User');
    }
  };

  void deleteUser();
});

// Endpoints for updating a specific user
router.put('/', checkAuthenticated, (req: Request, res: Response): void => {
  const userId = req.user as string;

  if (userId == null) return;

  const {
    first_name,
    last_name,
    email,
    username,
    password,
    private_option,
    profile_picture,
    followers,
    following
  } = req.body;
  const updateUser = async (): Promise<void> => {
    try {
      const updateUser = await pool.query(`UPDATE backend_schema.user
        SET first_name = $1,
            last_name = $2,
            email = $3,
            username = $4,
            password = $5,
            private = $6,
            followers = $7,
            following = $8,
            profile_picture = $9
        WHERE uid = $10`,
      [first_name, last_name, email, username, password, private_option, followers, following, profile_picture, userId]);
      // responds with successful update even when no changes are made
      responseCallbackUpdate(null, userId, res, 'User', updateUser.rowCount);
    } catch (error) {
      responseCallbackUpdate(error, userId, res, 'User');
    }
  };

  void updateUser();
});

// Endpoints for updating a specific user's profile picture with image URL
router.put('/update-profile-picture', (req: Request, res: Response): void => {
  const userId = req.user as string;
  const { profile_picture } = req.body; // URI of frontend

  if (!userId || !profile_picture) {
    res.status(400).json({ error: 'Invalid userId or profile_picture' });
  }

  const updateProfilePicture = async (userId: string): Promise<void> => {
    try {
      const response = await axios.get(profile_picture, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
      await uploadURIToS3(imageBuffer, userId); // upload URI to S3
    
      const URL = await downloadURLFromS3(userId); // getting URL from S3
      console.log(URL);
      const updateProfilePicture = await pool.query(`
      UPDATE backend_schema.user
      SET profile_picture = $1
      WHERE  uid = $2
      `, [URL, userId]);
      responseCallbackUpdate(null, userId, res, 'Profile Picture URL', updateProfilePicture.rowCount);
    } catch (error) {
      console.error(error);
      responseCallbackUpdate(error, userId, res, 'Profile Picture URL');
    }
  };

  void updateProfilePicture(userId);
});

module.exports = router;
