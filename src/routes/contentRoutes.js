const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const contentController = require('../controllers/contentController')

router.use(isAuth);

router.post('/movie/create', contentController.createMovie);

router.delete('/movie/:movieId/delete', contentController.deleteMovie);

router.post('/series/create', contentController.createSeries);

router.post('/:seriesId/create-season', contentController.createSeason);

router.post('/:seasonId/create-episode', contentController.createEpisode);

// router.delete('/movie/:movieId/delete', contentController.deleteSeries);

router.get('/movie/:movieId/getMovie', contentController.getMovieById);

router.get('/getMovies', contentController.getMovies);

router.get('/series/:seriesId/', contentController.getSeries);

router.get('/series/:seriesId/getSeries', contentController.getSeriesById);

router.post('/:profileId/:movieId/start', contentController.startMovie);

router.post('/:profileId/:movieId/end', contentController.endMovie);

router.get('/profile/:profileId/:seriesId/:season/:episode/start', contentController.startSeriesEpisode);

router.get('/profile/:profileId/:seriesId/:season/:episode/end', contentController.endSeriesEpisode);

router.get('/profile/:profileId/watch-history', contentController.getWatchHistory);

router.get('/profile/:profileId/watch-list', contentController.getWatchList);

module.exports = router;