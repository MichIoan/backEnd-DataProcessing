const Series = require('../models/series');
const Media = require('../models/media');
const response = require('../utilities/response');
const isValidInt = require('../utilities/validate');

const getMovies = async (req, res) => {
    try {
        const movies = await Media.findAll({
            where: {
                season_id: '0',
            }
        });

        if (movies.length === 0) {
            response(res, 200, { message: "No movies found." });
        } else {
            response(res, 200, { movies: movies });
        }
    }
    catch (err) {
        console.log(err);
        response(res, 500, { error: 'Internal server error' });
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

const getMovieById = async (req, res) => {
    const movieId = req.param.movieId;

    if (!movieId) {
        response(req, res, 400, { message: "Please provide the movieId in URL" });
        return;
    }

    if (!isValidInt(movieId)) {
        response(req, res, 400, { message: "Movie id is not a valid integer" });
        return;
    }

    try {
        const movie = await Media.findOne({
            where: {
                media_id: movieId,
                season_id: null,
            }
        });

        if (!movie) {
            response(req, res, 400, { message: "No movie found for this ID" });
            return;
        }

        response(req, res, 200, { movie: movie });
        return;
    } catch (err) {
        console.log(err);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const getSeriesById = async (req, res) => {
    try {
        const seriesId = req.param.seriesId;

        if (!seriesId) {
            response(req, res, 400, { message: "Please provide the series id as a parameter" });
            return;
        }

        if (!isValidInt(seriesId)) {
            response(req, res, 400, { error: "The parameter is not a valid integer" });
            return;
        }

        const series = await Series.findOne({
            where: {
                series_id: seriesId,
            }
        });

        if (!series) {
            response(req, res, 400, { message: "No series found with this id" });
        }

        response(req, res, 200, { series: series });
        return;
    } catch (error) {
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const startMovie = async (req, res) => {
    const profileId = req.param.profileId;
    const movieId = req.param.movieId;

    if (!profileId || !movieId) {
        response(req, res, 400, { message: "Please provide all the parameters in the URL" });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(movieId)) {
        response(req, res, 400, { message: "Profile id or movie is is not valid integer." });
        return;
    }

    const watchList = await WatchList.findOne({
        where: {
            profile_id: profileId
        }
    });

    watchList.update({
        media_id: movieId,
        viewing_status: "started",
    });

    response(req, res, 200);
}

const endMovie = async (req, res) => {
    const profileId = req.param.profileId;
    const movieId = req.param.movieId;

    if (!profileId || !movieId) {
        response(req, res, 400, { message: "Please provide all the parameters in the URL" });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(movieId)) {
        response(req, res, 400, { message: "Profile id or movie is is not valid integer." });
        return;
    }

    const watchList = await WatchList.findOne({
        where: {
            profile_id: profileId
        }
    });

    const watchHistory = await WatchHistory.findOne({
        where: {
            profile_id: profileId
        }
    });

    watchList.update({
        media_id: movieId,
        viewing_status: "finished",
    });

    watchHistory.update({
        media_id: movieId,
        viewing_status: "watched",
        times_watched: watchHistory.times_watched + 1,
    });

    response(req, res, 200);
}

const startSeriesEpisode = async (req, res) => {
    const profileId = req.param.profileId;
    const seriesId = req.param.seriesId;
    const season = req.param.season;
    const episode = req.param.episode;

    if (!profileId || !seriesId || !season || !episode) {
        response(req, res, 400, { message: "Please provide all the parameters in the URL" });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(seriesId) || !isValidInt(season) || !isValidInt(episode)) {
        response(req, res, 400, { message: "Invalid integers provided in the URL, try again" });
        return;
    }

    const seasonId = await Season.findOne({
        where: {
            series_id: seriesId
        }
    })

    if (!seasonId) {
        response(req, res, 400, { message: "The requested season doesn't exist." });
        return;
    }

    const episodeId = await Media.findOne({
        where: {
            season_id: seasonId,
        }
    });

    if (!episodeId) {
        response(req, res, 400, { message: "The requested episode doesn't exist" });
        return;
    }

    await WatchList.create({
        profile_id: profileId,
        media_id: episodeId,
        viewing_status: "started"
    });

    response(req, res, 200);
    return;
}

const endSeriesEpisode = async (req, res) => {
    const profileId = req.param.profileId;
    const seriesId = req.param.seriesId;
    const season = req.param.season;
    const episode = req.param.episode;

    if (!profileId || !seriesId || !season || !episode) {
        response(req, res, 400, { message: "Please provide all the parameters in the URL" });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(seriesId) || !isValidInt(season) || !isValidInt(episode)) {
        response(req, res, 400, { message: "Invalid integers provided in the URL, try again" });
        return;
    }

    const seasonId = await Season.findOne({
        where: {
            series_id: seriesId
        }
    })

    if (!seasonId) {
        response(req, res, 400, { message: "The requested season doesn't exist." });
        return;
    }

    const episodeId = await Media.findOne({
        where: {
            season_id: seasonId,
        }
    });

    if (!episodeId) {
        response(req, res, 400, { message: "The requested episode doesn't exist" });
        return;
    }

    await WatchList.create({
        profile_id: profileId,
        media_id: episodeId,
        viewing_status: "started"
    });

    response(req, res, 200);
    return;
}

const getWatchHistory = async (req, res) => {
    const profileId = req.param.profileId;

    if (!profileId) {
        response(req, res, 400, { message: "Please provide the profile id in the URL" });
        return;
    }

    if (!isValidInt(profileId)) {
        response(req, res, 400, { message: "The parameter in the URL is not valid integer" });
        return;
    }

    const watchHistory = await WatchList.findOne({
        where: {
            profile_id: profileId
        }
    });

    response(req, res, 200, { watchHistory: watchHistory });
    return;
}

const getWatchList = async (req, res) => {
    const profileId = req.param.profileId;

    if (!profileId) {
        response(req, res, 400, { message: "Please provide the profile id in the URL" });
        return;
    }

    if (!isValidInt(profileId)) {
        response(req, res, 400, { message: "Profile ID parameter is not a valid integer" });
        return;
    }

    const watchList = await WatchList.findOne({
        where: {
            profile_id: profileId
        }
    });

    response(req, res, 202, { watchList: watchList });
    return;
}

module.exports = { getMovies, getSeries, getMovieById, getSeriesById, startMovie, endMovie, startSeriesEpisode, endSeriesEpisode, getWatchHistory, getWatchList };