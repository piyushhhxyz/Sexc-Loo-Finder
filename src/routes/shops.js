const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shops');

router.post('/', shopController.addShop);
router.get('/nearest', shopController.getNearestWashrooms);
router.get('/:name', shopController.getShopByName);


module.exports = router;
