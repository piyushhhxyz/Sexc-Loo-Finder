const mongoose = require('mongoose');
const Shop = require('./models/shop');
const { dbConnect } = require("./config/connectDB")

const mockShops = [
    {
      name: 'Cafe Coffee Day',
      location: { type: 'Point', coordinates: [12.9716, 77.5946] },
      washroomImages: ['https://s3.example.com/ccd_washroom.jpg'],
      genre: 'Cafe',
      targetCustomers: { ageGroups: ['Adults', 'Teens'], gender: 'Male' },
    },
    {
      name: 'McDonald\'s',
      location: { type: 'Point', coordinates: [12.9719, 77.5943] },
      washroomImages: ['https://s3.example.com/mcdonalds_washroom.jpg'],
      genre: 'Restaurant',
      targetCustomers: { ageGroups: ['Children', 'Adults'], gender: 'Male' },
    },
    {
      name: 'Nike Store',
      location: { type: 'Point', coordinates: [12.9766, 77.5960] },
      washroomImages: ['https://s3.example.com/nike_washroom.jpg'],
      genre: 'Clothing Store',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
    },
    {
      name: 'Gold\'s Gym',
      location: { type: 'Point', coordinates: [12.9778, 77.6087] },
      washroomImages: ['https://s3.example.com/golds_gym_washroom.jpg'],
      genre: 'Gym',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
    },
    {
      name: 'Apollo Pharmacy',
      location: { type: 'Point', coordinates: [12.9834, 77.5837] },
      washroomImages: ['https://s3.example.com/apollo_pharmacy_washroom.jpg'],
      genre: 'Pharmacy',
      targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
    },
    {
      name: 'Crossword',
      location: { type: 'Point', coordinates: [12.9715, 77.5951] },
      washroomImages: ['https://s3.example.com/crossword_washroom.jpg'],
      genre: 'Bookstore',
      targetCustomers: { ageGroups: ['Children', 'Teens'], gender: 'Other' },
    },
    {
      name: 'Taj Hotel',
      location: { type: 'Point', coordinates: [12.9721, 77.5946] },
      washroomImages: ['https://s3.example.com/taj_hotel_washroom.jpg'],
      genre: 'Hotel',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
    },
    {
      name: 'Pecos Bar',
      location: { type: 'Point', coordinates: [12.9771, 77.6025] },
      washroomImages: ['https://s3.example.com/pecos_bar_washroom.jpg'],
      genre: 'Bar',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
    },
    {
      name: 'VLCC Salon',
      location: { type: 'Point', coordinates: [12.9586, 77.5978] },
      washroomImages: ['https://s3.example.com/vlcc_washroom.jpg'],
      genre: 'Salon',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
    },
    {
      name: 'Big Bazaar',
      location: { type: 'Point', coordinates: [12.9707, 77.5944] },
      washroomImages: ['https://s3.example.com/bigbazaar_washroom.jpg'],
      genre: 'Supermarket',
      targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
    },
  ];
  
  const mockShops_2 = [
    {
      name: 'Starbucks',
      location: { type: 'Point', coordinates: [12.9725, 77.6133] },
      washroomImages: ['https://s3.example.com/starbucks_washroom.jpg'],
      genre: 'Cafe',
      targetCustomers: { ageGroups: ['Adults', 'Teens'], gender: 'Male' },
    },
    {
      name: 'Domino\'s Pizza',
      location: { type: 'Point', coordinates: [12.9710, 77.6151] },
      washroomImages: ['https://s3.example.com/dominos_washroom.jpg'],
      genre: 'Restaurant',
      targetCustomers: { ageGroups: ['Children', 'Adults'], gender: 'Male' },
    },
    {
      name: 'Zara',
      location: { type: 'Point', coordinates: [12.9755, 77.6090] },
      washroomImages: ['https://s3.example.com/zara_washroom.jpg'],
      genre: 'Clothing Store',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
    },
    {
      name: 'Fitness First',
      location: { type: 'Point', coordinates: [12.9701, 77.6015] },
      washroomImages: ['https://s3.example.com/fitness_first_washroom.jpg'],
      genre: 'Gym',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
    },
    {
      name: 'Apollo Clinic',
      location: { type: 'Point', coordinates: [12.9817, 77.6213] },
      washroomImages: ['https://s3.example.com/apollo_clinic_washroom.jpg'],
      genre: 'Pharmacy',
      targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
    },
    {
      name: 'Landmark',
      location: { type: 'Point', coordinates: [12.9773, 77.6104] },
      washroomImages: ['https://s3.example.com/landmark_washroom.jpg'],
      genre: 'Bookstore',
      targetCustomers: { ageGroups: ['Children', 'Teens'], gender: 'Other' },
    },
    {
      name: 'Sheraton Grand',
      location: { type: 'Point', coordinates: [12.9729, 77.5981] },
      washroomImages: ['https://s3.example.com/sheraton_grand_washroom.jpg'],
      genre: 'Hotel',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
    },
    {
      name: 'Hard Rock Cafe',
      location: { type: 'Point', coordinates: [12.9722, 77.5985] },
      washroomImages: ['https://s3.example.com/hard_rock_cafe_washroom.jpg'],
      genre: 'Bar',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
    },
    {
      name: 'Lakme Salon',
      location: { type: 'Point', coordinates: [12.9642, 77.5933] },
      washroomImages: ['https://s3.example.com/lakme_washroom.jpg'],
      genre: 'Salon',
      targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
    },
    {
      name: 'Reliance Fresh',
      location: { type: 'Point', coordinates: [12.9531, 77.6163] },
      washroomImages: ['https://s3.example.com/reliance_fresh_washroom.jpg'],
      genre: 'Supermarket',
      targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
    },
  ];
  
dbConnect();
async function seedMockData() {
  try {
    // await Shop.deleteMany(); // Clear existing data
    await Shop.insertMany(mockShops, { timeout: 30000 }); // Increase timeout to 30 seconds
    console.log('Mock data seeded successfully.');
    mongoose.disconnect(); 
  } catch (err) {
    console.error('Error seeding mock data:', err);
  }
}

seedMockData();
