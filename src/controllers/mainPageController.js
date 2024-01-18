const User = require('../models/user');
const Series = require('../models/series');
const Media = require('../models/media');

// Function to send response after processing
function prepareResponse(res, statusCode, data) {
    res.status(statusCode).send(data);
}

const getMovies = async (req, res) => {
    try {
        const movies = await Media.findAll({
            where: {
                season_id: '0',
            }
        });

        if (movies.length === 0) {
            prepareResponse(res, 404, { error: 'No movies found' });
        } else {
            prepareResponse(res, 200, { movies: movies });
        }
    }
    catch (err) {
        console.log(err);
        prepareResponse(res, 500, { error: 'Server error' });
    }
}

const getSeries = async (req, res) => {
    try {
        const series = await Series.findAll();

        if (series.length === 0) {
            prepareResponse(res, 404, { error: 'No series found' });
        } else {
            prepareResponse(res, 200, { series: series });
            }
    }
    catch (err) {
        prepareResponse(res, 500, { error: 'Server error' });
    }
}

module.exports = { getMovies, getSeries};