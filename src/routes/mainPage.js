const express = require('express');
const router = express.Router();
const mainPageController = require('../controllers/mainPageController');

router.get('/getMovies', mainPageController.getMovies);

router.get('/getSeries', mainPageController.getSeries);

module.exports = router;