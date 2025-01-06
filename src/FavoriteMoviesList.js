import { Navigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { AuthContext } from './context/AutContext'; 

axios.defaults.baseURL = "https://favorite-movies-webapp.onrender.com";


const Favorites = () => {
  const [isFavorites, setFavoritesState] = useState([]); 
  const { isAuthenticated, userId } = useContext(AuthContext); 
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch favorites only if the user is authenticated
      fetchFavorites();
    }
  }, [isAuthenticated]);

  // Get the favorite movies list
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get("/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        }}); 
      setFavoritesState(response.data.favorites);
    console.log(response)
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      const response = await axios.post("/favorites/remove", { id: movieId, user_id: userId });

      if (response.data.success) {
        // Update the local state by filtering out the removed movie
        setFavoritesState((prevFavorites) => prevFavorites.filter((movie) => movie.id !== movieId));
      }

    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove favorite. Please try again.");
    }
  };

  if (!isAuthenticated) {
    alert("You must be logged in to access favorites!");
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Favorites</h2>
      {isFavorites.length === 0 ? (
        <p className="text-center">No favorite movies yet!</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {isFavorites.map((movie) => (
            <div key={movie.movie_id} className="col">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} Poster`}
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  {/* Remove button */}
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFavorite(movie.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
