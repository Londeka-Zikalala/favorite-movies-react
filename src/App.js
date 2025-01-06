import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchMovie from "./SearchMovie";
import Favorites from "./FavoriteMoviesList";
import { AuthProvider } from "./context/AutContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<SearchMovie />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App