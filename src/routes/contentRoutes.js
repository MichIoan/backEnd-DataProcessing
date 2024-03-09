const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const contentController = require('../controllers/contentController')

router.use(isAuth);

router.get('/movie/:movieId', contentController.getMovieById);

router.get('/movies', contentController.getMovies);

router.get('/series/:seriesId/:season/:episode', contentController.getSeries);

router.get('/series/:seriesId', contentController.getSeriesById);

router.post('/:profileId/:movieId/start', contentController.startMovie);

router.post('/:profileId/:movieId/end', contentController.endMovie);

router.get('/profile/:profileId/:seriesId/:season/:episode/start', contentController.startSeriesEpisode);

router.get('/profile/:profileId/:seriesId/:season/:episode/end', contentController.endSeriesEpisode);

router.get('/profile/:profileId/watch-history', contentController.getWatchHistory);

module.exports = router;