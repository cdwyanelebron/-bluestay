const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');

// Protected Routes
router.get('/conversations', authMiddleware, chatController.getConversations);
router.post('/conversations', authMiddleware, chatController.createConversation);
router.get('/conversations/:conversationId/messages', authMiddleware, chatController.getConversationMessages);
router.post('/messages', authMiddleware, chatController.sendMessage);
router.put('/conversations/:conversationId/read', authMiddleware, chatController.markAsRead);
router.delete('/conversations/:id', authMiddleware, chatController.deleteConversation);

module.exports = router;
