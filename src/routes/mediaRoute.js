const express = require('express');
const { body } = require('express-validator');
const resetPassword = require('../controllers/mediaController');

const router = express.Router();

router.get('/getMovie', [
], getMedia.movie);

router.post('/getSeries', [
], getMedia.series);

module.exports = router;