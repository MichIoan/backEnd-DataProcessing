const express = require('express');
const router = express.Router();

router.get('/movie/:movieId', mainPageController.getMovies);

router.get('/series/:seriesId/:season/:episode', mainPageController.getSeries);

module.exports = router;