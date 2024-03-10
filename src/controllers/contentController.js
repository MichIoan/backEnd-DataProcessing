const Series = require('../models/series');
const Media = require('../models/media');
const response = require('../utilities/response');
const {
    isValidInt
} = require('../utilities/validate');

const addMovie = async (req, res) => {
    const movie = req.body;

    if (!movie.title || !movie.duration) {
        response(req, res, 400, {
            message: "Please provide at least a title and a duration for the movie."
        });
        return;
    }

    try {
        const newMovie = await Media.create({
            title: movie.title,
            duration: movie.duration,
            release_date: movie.release_date || null,
            episode_number: movie.episode_number || null,
            season_id: movie.season_id || null,
        });

        response(req, res, 200, {
            message: "Movie added successfully.",
            movie: movie.title,
        });
    } catch (err) {
        console.log(err);
        response(res, 500, {
            error: "Internal server error"
        });
    }
}

const removeMovie = async (req, res) => {
    const movieId = req.params.movieId;

    if (!movieId || !isValidInt(movieId)) {
        response(req, res, 400, {
            message: "Please provide a valid movie id."
        });
        return;
    }

    try {
        const movie = await Media.findOne({
            where: {
                media_id: movieId,
                season_id: null
            }
        });

        if (!movie) {
            response(req, res, 404, {
                message: "No movie found with this ID."
            });
            return;
        }

        await movie.destroy();

        response(req, res, 200, {
            message: "Movie removed successfully."
        });
    } catch (err) {
        console.log(err);
        response(res, 500, {
            error: "Internal server error"
        });
    }
}

const getMovies = async (req, res) => {
    try {
        const movies = await Media.findAll({
            where: {
                season_id: '0',
            }
        });

        if (movies.length === 0) {
            response(req, res, 200, {
                message: "No movies found."
            });
            return;
        } else {
            response(req, res, 200, {
                movies: movies
            });
            return;
        }
    } catch (err) {
        console.log(err);
        response(res, 500, {
            error: 'Internal server error'
        });
        return;
    }
}

const getSeries = async (req, res) => {
    try {
        const series = await Series.findAll();

        if (series.length === 0) {
            response(req, res, 200, {
                message: 'You have no series in your database.'
            });
            return;
        } else {
            response(req, res, 200, {
                series: series
            });
            return;
        }
    } catch (err) {
        response(res, 500, {
            error: 'Server error'
        });
        return;
    }
}

const getMovieById = async (req, res) => {
    const movieId = req.params.movieId;

    if (!movieId) {
        response(req, res, 400, {
            message: "Please provide the movieId in URL"
        });
        return;
    }

    if (!isValidInt(movieId)) {
        response(req, res, 400, {
            message: "Movie id is not a valid integer"
        });
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
            response(req, res, 400, {
                message: "No movie found for this ID"
            });
            return;
        }

        response(req, res, 200, {
            movie: movie
        });
        return;
    } catch (err) {
        console.log(err);
        response(req, res, 500, {
            error: "Internal server error"
        });
        return;
    }
}

const getSeriesById = async (req, res) => {
    try {
        const seriesId = req.params.seriesId;

        if (!seriesId) {
            response(req, res, 400, {
                message: "Please provide the series id as a parameter"
            });
            return;
        }

        if (!isValidInt(seriesId)) {
            response(req, res, 400, {
                error: "The parameter is not a valid integer"
            });
            return;
        }

        const series = await Series.findOne({
            where: {
                series_id: seriesId,
            }
        });

        if (!series) {
            response(req, res, 400, {
                message: "No series found with this id"
            });
        }

        response(req, res, 200, {
            series: series
        });
        return;
    } catch (error) {
        response(req, res, 500, {
            error: "Internal server error"
        });
        return;
    }
}

const startMovie = async (req, res) => {
    const profileId = req.params.profileId;
    const movieId = req.params.movieId;

    if (!profileId || !movieId) {
        response(req, res, 400, {
            message: "Please provide all the parameters in the URL"
        });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(movieId)) {
        response(req, res, 400, {
            message: "Profile id or movie is is not valid integer."
        });
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
    const profileId = req.params.profileId;
    const movieId = req.params.movieId;

    if (!profileId || !movieId) {
        response(req, res, 400, {
            message: "Please provide all the parameters in the URL"
        });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(movieId)) {
        response(req, res, 400, {
            message: "Profile id or movie is is not valid integer."
        });
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
    const profileId = req.params.profileId;
    const seriesId = req.params.seriesId;
    const season = req.params.season;
    const episode = req.params.episode;

    if (!profileId || !seriesId || !season || !episode) {
        response(req, res, 400, {
            message: "Please provide all the parameters in the URL"
        });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(seriesId) || !isValidInt(season) || !isValidInt(episode)) {
        response(req, res, 400, {
            message: "Invalid integers provided in the URL, try again"
        });
        return;
    }

    const seasonId = await Season.findOne({
        where: {
            series_id: seriesId
        }
    })

    if (!seasonId) {
        response(req, res, 400, {
            message: "The requested season doesn't exist."
        });
        return;
    }

    const episodeId = await Media.findOne({
        where: {
            season_id: seasonId,
        }
    });

    if (!episodeId) {
        response(req, res, 400, {
            message: "The requested episode doesn't exist"
        });
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
    const profileId = req.params.profileId;
    const seriesId = req.params.seriesId;
    const season = req.params.season;
    const episode = req.params.episode;

    if (!profileId || !seriesId || !season || !episode) {
        response(req, res, 400, {
            message: "Please provide all the parameters in the URL"
        });
        return;
    }

    if (!isValidInt(profileId) || !isValidInt(seriesId) || !isValidInt(season) || !isValidInt(episode)) {
        response(req, res, 400, {
            message: "Invalid integers provided in the URL, try again"
        });
        return;
    }

    const seasonId = await Season.findOne({
        where: {
            series_id: seriesId
        }
    })

    if (!seasonId) {
        response(req, res, 400, {
            message: "The requested season doesn't exist."
        });
        return;
    }

    const episodeId = await Media.findOne({
        where: {
            season_id: seasonId,
        }
    });

    if (!episodeId) {
        response(req, res, 400, {
            message: "The requested episode doesn't exist"
        });
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
    const profileId = req.params.profileId;

    if (!profileId) {
        response(req, res, 400, {
            message: "Please provide the profile id in the URL"
        });
        return;
    }

    if (!isValidInt(profileId)) {
        response(req, res, 400, {
            message: "The parameter in the URL is not valid integer"
        });
        return;
    }

    const watchHistory = await WatchList.findOne({
        where: {
            profile_id: profileId
        }
    });

    response(req, res, 200, {
        watchHistory: watchHistory
    });
    return;
}

const getWatchList = async (req, res) => {
    const profileId = req.params.profileId;

    if (!profileId) {
        response(req, res, 400, {
            message: "Please provide the profile id in the URL"
        });
        return;
    }

    if (!isValidInt(profileId)) {
        response(req, res, 400, {
            message: "Profile ID parameter is not a valid integer"
        });
        return;
    }

    const watchList = await WatchList.findOne({
        where: {
            profile_id: profileId
        }
    });

    response(req, res, 202, {
        watchList: watchList
    });
    return;
}

const addSeries = async (req, res) => {
    const series = req.body;

    if (!series.title || !series.start_date || !series.genre || !series.viewing_classification) {
        response(req, res, 400, {
            message: "Please provide the necessary properties for the series."
        });
        return;
    }

    try {
        const newSeries = await Series.create({
            title: series.title,
            age_restriction: series.age_restriction || null,
            start_date: series.start_date,
            genre: series.genre,
            viewing_classification: series.viewing_classification,
        });

        response(req, res, 200, {
            message: "Series added successfully.",
            series: newSeries,
        });
    } catch (err) {
        console.log(err);
        response(res, 500, {
            error: "Internal server error"
        });
    }
};

const addSeason = async (req, res) => {
    const season = req.body;

    if (!season.series_id || !season.season_number) {
        response(req, res, 400, {
            message: "Please provide the necessary properties for the season."
        });
        return;
    }

    try {
        const newSeason = await Season.create({
            series_id: season.series_id,
            season_number: season.season_number,
            release_date: season.release_date || null,
        });

        response(req, res, 200, {
            message: "Season added successfully.",
            season: newSeason,
        });
    } catch (err) {
        console.log(err);
        response(res, 500, {
            error: "Internal server error"
        });
    }
};

const addEpisode = async (req, res) => {
    const episode = req.body;

    if (!episode.season_id || !episode.episode_number || !episode.title || !episode.duration) {
        response(req, res, 400, {
            message: "Please provide the necessary properties for the episode."
        });
        return;
    }

    try {
        const newEpisode = await Media.create({
            season_id: episode.season_id,
            episode_number: episode.episode_number,
            title: episode.title,
            duration: episode.duration,
            release_date: episode.release_date || null,
        });

        response(req, res, 200, {
            message: "Episode added successfully.",
            episode: newEpisode,
        });
    } catch (err) {
        console.log(err);
        response(res, 500, {
            error: "Internal server error"
        });
    }
};

module.exports = {
    addMovie,
    removeMovie,
    getMovies,
    getSeries,
    getMovieById,
    getSeriesById,
    startMovie,
    endMovie,
    startSeriesEpisode,
    endSeriesEpisode,
    getWatchHistory,
    getWatchList,
    addSeries,
    addSeason,
    addEpisode,
};