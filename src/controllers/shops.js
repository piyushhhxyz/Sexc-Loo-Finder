const Shop = require('../../models/shop');

async function addShop(req, res) {
  try {
    const newShop = await Shop.create(req.body);
    res.status(201).json(newShop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getShopByName(req, res) {
  const { name } = req.params;
  try {
    const shop = await Shop.findById(name);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNearestWashrooms(req, res) {
  const { longitude, latitude } = req.body;
  try {
    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and Latitude are required' });
    }

    const nearestShops = await Shop.findNearestShops(parseFloat(longitude), parseFloat(latitude));
    // res.json("nearestShops");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addShop, getShopByName,getNearestWashrooms };
