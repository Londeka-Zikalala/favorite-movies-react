import React from 'react';
import { useState, useEffect } from 'react';
import MovieList from './MoviesList.js';
import axios from 'axios';

const PopularMovies = ({onFavoriteToggle, onMovieClick }) => {
    const [popularMovies, setPopularMovies]  = useState([])
    useEffect(() => {
        // Fetch popular movies when the component mounts
        const fetchPopularMovies = async () => {
          try {
            const response = await axios.get('https://favorite-movies-webapp.onrender.com/movies/popular');
            setPopularMovies(response.data.results);
          } catch (error) {
            console.error('Error fetching popular movies:', error);
          }
        };
        fetchPopularMovies();
      }, []);
  return (
    <div>
      <h2>Popular Movies</h2>
      <MovieList
        movies={popularMovies}
        onFavoriteToggle={onFavoriteToggle}
        onMovieClick={onMovieClick}
      />
    </div>
  );
};

export default PopularMovies;
