const User = require('../models/User');
const Listing = require('../models/Listing');

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Other User Profile (Public)
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -email')
      .populate('reviews');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, location, avatar } = req.body;

    const user = await User.findById(req.user.userId);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save Listing
exports.saveListing = async (req, res) => {
  try {
    const { listingId } = req.body;

    const user = await User.findById(req.user.userId);
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (user.savedListings.includes(listingId)) {
      return res.status(400).json({ error: 'Listing already saved' });
    }

    user.savedListings.push(listingId);
    await user.save();

    res.status(200).json({ message: 'Listing saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unsave Listing
exports.unsaveListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user.savedListings.includes(listingId)) {
      return res.status(400).json({ error: 'Listing not saved' });
    }

    user.savedListings = user.savedListings.filter(id => id.toString() !== listingId);
    await user.save();

    res.status(200).json({ message: 'Listing unsaved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Saved Listings
exports.getSavedListings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('savedListings');

    res.status(200).json({ listings: user.savedListings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'oldPassword and newPassword are required' });
    }

    const user = await User.findById(req.user.userId);

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.userId);

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
