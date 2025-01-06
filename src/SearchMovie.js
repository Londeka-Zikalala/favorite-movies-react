import React, { useState, useContext } from 'react';
import PopularMovies from './PopularMovies';
import MovieList from './MoviesList.js';
import axios from 'axios';
import { AuthContext } from './context/AutContext';
import LoginModal from './UserLogin';
import { Modal, Button } from 'react-bootstrap';
import Logout from './UserLogout';
import { Link, useNavigate } from 'react-router-dom'; 

axios.defaults.baseURL = "https://favorite-movies-webapp.onrender.com";

const SearchMovie = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showValidation, setShowValidation] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      try {
        const response = await axios.post('/movies/search', { query: value });
        setMovies(response.data.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    } else {
      setMovies([]);
    }
  };

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const handleModalClose = () => setSelectedMovie(null);

  const handleFavoriteToggle = (movie) => {
    if (!isAuthenticated) {
      setShowValidation("Please log in or sign up to add favorites!");
      setTimeout(() => setShowValidation(null), 3000);
      return;
    }
    const alreadyFavorited = favorites.some((fav) => fav.id === movie.id);
    const updatedFavorites = alreadyFavorited
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setShowValidation(
      alreadyFavorited ? "Removed from favorites!" : "Added to favorites!"
    );
    setTimeout(() => setShowValidation(null), 3000);
  };

  const handleGoToFavorites = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate("/favorites");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Movie Explorer</h1>
        <div className="d-flex">
          {isAuthenticated ? (
            <>
              <Logout handleLogout={logout} />
              <button
                className="btn btn-secondary ms-2"
                onClick={handleGoToFavorites}
              >
                Go to Favorites
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary me-2"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleGoToFavorites}
              >
                Go to Favorites
              </button>
            </>
          )}
        </div>
      </div>

      <input
        type="text"
        className="form-control mt-3"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleSearch}
      />

      {query.trim() ? (
        <>
          <h2>Search Results</h2>
          <MovieList
            movies={movies}
            onFavoriteToggle={handleFavoriteToggle}
            onMovieClick={handleMovieClick}
          />
        </>
      ) : (
        <PopularMovies
          onFavoriteToggle={handleFavoriteToggle}
          onMovieClick={handleMovieClick}
        />
      )}

      {selectedMovie && (
        <Modal show onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMovie.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedMovie.overview}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showValidation && (
        <div className="alert alert-warning mt-3">{showValidation}</div>
      )}

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default SearchMovie;
