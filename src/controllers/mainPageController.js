const User = require('../models/user');
const Series = require('../models/series');
const Media = require('../models/media');
const response = require('../utilities/response');

const getMovies = async (req, res) => {
    try {
        const movies = await Media.findAll({
            where: {
                season_id: '0',
            }
        });

        if (movies.length === 0) {
            response(res, 200, { message: "You don't have any movies in the database." });
        } else {
            response(res, 200, { movies: movies });
        }
    }
    catch (err) {
        console.log(err);
        response(res, 500, { error: 'Server error' });
    }
}

const getSeries = async (req, res) => {
    try {
        const series = await Series.findAll();

        if (series.length === 0) {
            response(res, 200, { message: 'You have no series in your database.' });
        } else {
            response(res, 200, { series: series });
        }
    }
    catch (err) {
        response(res, 500, { error: 'Server error' });
    }
}

module.exports = { getMovies, getSeries };