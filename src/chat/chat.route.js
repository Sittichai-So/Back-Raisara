import express from 'express';
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  toggleReaction,
  markAsRead,
  searchMessages
} from '../controllers/chat.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/:roomId/messages', getMessages);
router.post('/:roomId/messages', upload.single('file'), sendMessage);
router.put('/messages/:messageId', updateMessage);
router.delete('/messages/:messageId', deleteMessage);


router.post('/messages/:messageId/reactions', toggleReaction);

router.post('/:roomId/read', markAsRead);

router.get('/:roomId/search', searchMessages);

export default router;