const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

router.use(isAuth);

router.get('/movie/:movieId', mainPageController.getMovies);

router.get('/series/:seriesId/:season/:episode', mainPageController.getSeries);

module.exports = router;