import React, { useState, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { AuthContext } from './context/AutContext'; 
import axios from 'axios';

axios.defaults.baseURL = "https://favorite-movies-webapp.onrender.com";
 
const SelectedMovie = ({ movie, onFavoriteToggle }) => {
  const { isAuthenticated, token, userId } = useContext(AuthContext);  
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Function to handle adding/removing movie from favorites
  const handleFavoriteToggle = async (movie) => {
    if (!isAuthenticated) {
      alert("Please log in to add favorites");
      return;
    }

    if (!userId) {
      alert("User ID is missing.");
      return;
    }

    try {
      const action = movie.isFavorite ? 'remove' : 'add'; 
      const endpoint = action === 'remove' ? '/favorites/remove' : '/favorites'; 
        console.log(userId, token, movie.id)
      const response = await axios.post(`${endpoint}`, {movieId: movie.id, userId }, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
        if(action === 'add'){
          console.log(response, action)

        }

      if (response.data.success) {
        onFavoriteToggle(movie); 
      } else {
        alert('Failed to update favorites.');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error while adding/removing the movie from favorites.');
    }
  };

  return (
    <>
      {/* Movie Card */}
      <Card
        className="h-100 shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={handleModalOpen}
      >
        <Card.Img
          variant="top"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Button
            variant="outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle(movie);
            }}
          >
            {movie.isFavorite ? '💔 Remove' : '❤️ Add'}
          </Button>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{movie.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Movie Poster */}
          <div className="text-center mb-3">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="img-fluid"
            />
          </div>
          {/* Movie Details */}
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectedMovie;
