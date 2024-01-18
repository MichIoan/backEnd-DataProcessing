// mainPage.js
import React, { useState, useEffect } from 'react';
import MediaBox from './MediaBox';  // Adjust the import path according to your file structure
import './mainPage.css';  // Assuming you have a CSS file for styles

function MainPage() {
    // State for storing movies and series
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset loading and error states
        setLoading(true);
        setError(null);

        // Function to fetch movies and series
        const fetchData = async () => {
            try {
                // Fetch movies
                const movieResponse = await fetch('/api/catalogue/movies'); //! Add the actual endpoints to the response
                const movieData = await movieResponse.json();

                // Fetch series
                const seriesResponse = await fetch('/api/catalogue/series'); //! Add the actual endpoints to the response
                const seriesData = await seriesResponse.json();

                // Update states with fetched data
                setMovies(movieData);
                setSeries(seriesData);
            } catch (err) {
                // Catch and set any error that occurs during fetching
                setError(err.message);
            } finally {
                // Turn off loading state regardless of the result
                setLoading(false);
            }
        };

        // Call the fetchData function
        fetchData();
    }, []);  // Empty dependency array ensures the effect only runs once

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error state
    }

    return (
        <div className="main-page">
            <h1>Movies</h1>
            <div className="media-grid">
                {movies.map(movie => (
                    <MediaBox key={movie.id} title={movie.title} description={movie.description} image={movie.image} />
                ))}
            </div>
            <h1>Series</h1>
            <div className="media-grid">
                {series.map(serie => (
                    <MediaBox key={serie.id} title={serie.title} description={serie.description} image={serie.image} />
                ))}
            </div>
        </div>
    );
}

export default MainPage;