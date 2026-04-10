const Listing = require('../models/Listing');
const User = require('../models/User');

// Get All Listings with Filters
exports.getListings = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, city, search, page = 1, limit = 12 } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (city) filter['location.city'] = city;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const skip = (page - 1) * limit;
    const listings = await Listing.find(filter)
      .populate('host', 'name avatar isVerified')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      listings,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Listing
exports.getListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate('host', 'name avatar isVerified bio')
      .populate('reviews');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({ listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Listing (Host Only)
exports.createListing = async (req, res) => {
  try {
    const { title, description, price, location, amenities, maxGuests, category, images } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({ error: 'title, price, and location are required' });
    }

    const listing = new Listing({
      title,
      description,
      price,
      location,
      amenities: amenities || [],
      maxGuests,
      category,
      images: images || [],
      host: req.user.userId,
    });

    await listing.save();
    await listing.populate('host', 'name avatar');

    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Listing (Host Only)
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, amenities, isAvailable } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Verify ownership
    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (amenities) listing.amenities = amenities;
    if (isAvailable !== undefined) listing.isAvailable = isAvailable;

    await listing.save();

    res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Listing (Host Only)
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Verify ownership
    if (listing.host.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Host Listings
exports.getHostListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.userId }).sort({ createdAt: -1 });

    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
