// node feedData.js
const mongoose = require('mongoose');
const Shop = require('./models/shop');
const { dbConnect } = require("./config/connectDB")

const blrShops = [
  {
    name: 'Cafe Coffee Day',
    location: { type: 'Point', coordinates: [12.9716, 77.5946] },
    washroomImages: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP788Hx5vg772lDwwBY44HRI3Q9BBDtE1RsA&s'],
    genre: 'Cafe',
    targetCustomers: { ageGroups: ['Adults', 'Teens'], gender: 'Male' },
  },
  {
    name: 'McDonald\'s',
    location: { type: 'Point', coordinates: [12.9719, 77.5943] },
    washroomImages: ['https://www.pinterest.com/pin/pin-de-dianice-rcabrera-en-arquitectura-en-2023--560768591115481005/'],
    genre: 'Restaurant',
    targetCustomers: { ageGroups: ['Children', 'Adults'], gender: 'Male' },
  },
  {
    name: 'Nike Store',
    location: { type: 'Point', coordinates: [12.9766, 77.5960] },
    washroomImages: ['https://www.pinterest.com/pin/667517976048052794/'],
    genre: 'Clothing Store',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
  },
  {
    name: 'Gold\'s Gym',
    location: { type: 'Point', coordinates: [12.9778, 77.6087] },
    washroomImages: ['https://www.pinterest.com/pin/410390584811817932/'],
    genre: 'Gym',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
  },
  {
    name: 'Apollo Pharmacy',
    location: { type: 'Point', coordinates: [12.9834, 77.5837] },
    washroomImages: ['https://www.pinterest.com/pin/314055774000562524/'],
    genre: 'Pharmacy',
    targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
  },
  {
    name: 'Crossword',
    location: { type: 'Point', coordinates: [12.9715, 77.5951] },
    washroomImages: ['https://www.bellabathrooms.co.uk/blog/bathroom-lighting-ideas/'],
    genre: 'Bookstore',
    targetCustomers: { ageGroups: ['Children', 'Teens'], gender: 'Other' },
  },
  {
    name: 'Taj Hotel',
    location: { type: 'Point', coordinates: [12.9721, 77.5946] },
    washroomImages: ['https://www.pinterest.com/pin/100416266684987956/?mt=login'],
    genre: 'Hotel',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
  },
  {
    name: 'Pecos Bar',
    location: { type: 'Point', coordinates: [12.9771, 77.6025] },
    washroomImages: ['https://www.pinterest.com/pin/644014815492082399/'],
    genre: 'Bar',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
  },
  {
    name: 'VLCC Salon',
    location: { type: 'Point', coordinates: [12.9586, 77.5978] },
    washroomImages: ['https://www.pinterest.com/pin/644014815492082399/'],
    genre: 'Salon',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
  },
  {
    name: 'Big Bazaar',
    location: { type: 'Point', coordinates: [12.9707, 77.5944] },
    washroomImages: ['https://www.pinterest.com/pin/644014815492082399/'],
    genre: 'Supermarket',
    targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
  },
];
const delShops = [
  {
    name: 'Delhi Brews Cafe',
    location: { type: 'Point', coordinates: [28.6139, 77.2090] },
    washroomImages: ['https://images.unsplash.com/photo-1506039746738-1f533f7efb82'],
    genre: 'Cafe',
    targetCustomers: { ageGroups: ['Adults', 'Teens'], gender: 'Male' },
  },
  {
    name: 'Tandoori Nights Restaurant',
    location: { type: 'Point', coordinates: [28.7041, 77.1025] },
    washroomImages: ['https://images.unsplash.com/photo-1533666889567-9f7c3e7a30ed'],
    genre: 'Restaurant',
    targetCustomers: { ageGroups: ['Children', 'Adults'], gender: 'Male' },
  },
  {
    name: 'Fashionista Clothing Store',
    location: { type: 'Point', coordinates: [28.7041, 77.1025] },
    washroomImages: ['https://images.unsplash.com/photo-1525878999591-7bb870f9be54'],
    genre: 'Clothing Store',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
  },
  {
    name: 'FitZone Gym',
    location: { type: 'Point', coordinates: [28.6139, 77.2090] },
    washroomImages: ['https://images.unsplash.com/photo-1556375996-0772b92c1f2e'],
    genre: 'Gym',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
  },
  {
    name: 'MediCare Pharmacy',
    location: { type: 'Point', coordinates: [28.7041, 77.1025] },
    washroomImages: ['https://images.unsplash.com/photo-1575411331257-4b3c8c2ec3e3'],
    genre: 'Pharmacy',
    targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
  },
  {
    name: 'Bookworm Haven Bookstore',
    location: { type: 'Point', coordinates: [28.7041, 77.1025] },
    washroomImages: ['https://images.unsplash.com/photo-1527082391-d07fbf3ac0a6'],
    genre: 'Bookstore',
    targetCustomers: { ageGroups: ['Children', 'Teens'], gender: 'Other' },
  },
  {
    name: 'Royal Palace Hotel',
    location: { type: 'Point', coordinates: [28.6139, 77.2090] },
    washroomImages: ['https://images.unsplash.com/photo-1546194071-2f60540e54e2'],
    genre: 'Hotel',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
  },
  {
    name: 'Jazz Barrels Bar',
    location: { type: 'Point', coordinates: [28.7041, 77.1025] },
    washroomImages: ['https://images.unsplash.com/photo-1532264523423-e07f9c2e586e'],
    genre: 'Bar',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Male' },
  },
  {
    name: 'Beauty Bliss Salon',
    location: { type: 'Point', coordinates: [28.6139, 77.2090] },
    washroomImages: ['https://images.unsplash.com/photo-1562770628-2e68b3f02dc7'],
    genre: 'Salon',
    targetCustomers: { ageGroups: ['Adults'], gender: 'Female' },
  },
  {
    name: 'Mega Mart',
    location: { type: 'Point', coordinates: [28.7041, 77.1025] },
    washroomImages: ['https://images.unsplash.com/photo-1533827432537-70133748f5c8'],
    genre: 'Supermarket',
    targetCustomers: { ageGroups: ['Adults', 'Seniors'], gender: 'Other' },
  },
];
const bangaloreShops = [
  {
    name: 'Indiranagar Cafe',
    location: { type: 'Point', coordinates: [12.9719, 77.6412] },
    washroomImages: ['https://images.unsplash.com/photo-1577471697278-bce0e43cca84'],
    genre: 'Cafe',
    targetCustomers: { ageGroups: ['Adults', 'Teens'], gender: 'Male' },
  },
  {
    name: 'Brigade Road Restaurant',
    location: { type: 'Point', coordinates: [12.9716, 77.6079] },
    washroomImages: ['https://images.unsplash.com/photo-1540331547168-3cdaf6a7483a'],
    genre: 'Restaurant',
    targetCustomers: { ageGroups: ['Children', 'Adults'], gender: 'Male' },
  },
]

  
  
dbConnect();
async function seedMockData() {
  try {
    await Shop.deleteMany(); 
    await Shop.insertMany(blrShops, { timeout: 30000 }); // Increase timeout to 30 seconds
    console.log('Mock data seeded successfully.');
    mongoose.disconnect(); 
  } catch (err) {
    console.error('Error seeding mock data:', err);
  }
}

seedMockData();
