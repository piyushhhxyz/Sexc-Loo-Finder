const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  washroomImages: [String], // URLs of washroom images stored in S3
  genre: {
    type: String,
    enum: ['Restaurant', 'Cafe', 'Clothing Store', 'Gym', 'Pharmacy', 'Bookstore', 'Hotel', 'Bar', 'Salon', 'Supermarket'],
  },
  targetCustomers: {
    ageGroups: [{ type: String, enum: ['Children', 'Teens', 'Adults', 'Seniors'] }],
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  },
});

shopSchema.index({ location: '2dsphere' });

shopSchema.statics.findNearestShops = async function (longitude, latitude, limit = 3) {
  const shops = await this.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distance',
        spherical: true,
      },
    },
    { $limit: limit },
  ]);
  return shops;
};

module.exports = mongoose.model('Shop', shopSchema);
