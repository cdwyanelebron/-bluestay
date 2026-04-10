const { Message, Conversation } = require('../models/Chat');
const User = require('../models/User');

// Get Conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate('participants', 'name avatar')
      .populate('listing', 'title')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Conversation Messages
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Verify participant
    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: 'conversationId and content are required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Verify participant
    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to message in this conversation' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: req.user.userId,
      content,
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    await message.populate('sender', 'name avatar');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Conversation
exports.createConversation = async (req, res) => {
  try {
    const { recipientId, listingId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'recipientId is required' });
    }

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      participants: { $all: [req.user.userId, recipientId] },
    });

    if (existing) {
      return res.status(200).json({ conversation: existing });
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [req.user.userId, recipientId],
      listing: listingId,
    });

    await conversation.save();
    await conversation.populate('participants', 'name avatar');

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Messages as Read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user.userId } },
      { isRead: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Verify participant
    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this conversation' });
    }

    await Conversation.findByIdAndDelete(id);
    await Message.deleteMany({ conversation: id });

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
