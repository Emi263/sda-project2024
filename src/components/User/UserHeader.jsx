//The same with Header, you can reuse it for both admin and simple user


import { useState, useEffect, useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import CinemaLogo from "../../assets/cinema-icon.png";
import { getPopularMovies } from "../../api/users";
import { ThemeContext } from "../../App";
import "../Home/Header.css";
import { jwtDecode } from "jwt-decode";

function UserHeader() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);
  const theme = useContext(ThemeContext);

  const idToken = localStorage.getItem("idToken");

  function checkExpire(expireTime) {
    const nowDate = Math.floor(Date.now() / 1000);

    if (nowDate > expireTime) {
      return true;
    } else {
      return false;
    }
  }

  if (idToken) {
    const decodedToken = jwtDecode(idToken);
    

    checkExpire(decodedToken.exp);
  } 

  const isTokenExpired = () => {
    if (!idToken) {
      return true;
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme.theme));
  }, [theme.theme]);

  const handleThemeToggle = () => {
    const newTheme = theme.theme === "dark" ? "light" : "dark";
    theme.setTheme(newTheme);
  };

  useEffect(() => {
    getPopularMovies()
      .then((data) => {
        setMovies(data.results);
        setFilteredMovies(data.results);
      })
      .catch((error) => {
        console.error("Error fetching popular movies:", error);
      });

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteMovieIds(storedFavorites);
  }, []);

  useEffect(() => {
    const favorites = movies.filter((movie) =>
      favoriteMovieIds.includes(movie.id)
    );
    setFilteredMovies(favorites);
  }, [movies, favoriteMovieIds]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`header-wrapper ${theme.theme}`}>
      <Navbar expand="lg" className={`navbar ${theme.theme}`} collapseOnSelect>
        <Container fluid>
          <Navbar.Brand onClick={() => navigate("/")}>
            <img
              src={CinemaLogo}
              alt="Cinema Logo"
              className="cinema-logo"
              style={{ maxHeight: "50px" }}
            />
            Cinema +
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" onClick={() => navigate("/")}>
                Home
              </Nav.Link>
              <Nav.Link onClick={showModal}>My Favorites</Nav.Link>
              <Nav.Link onClick={handleThemeToggle}>
                {theme.theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Nav.Link>
              {isTokenExpired() ? (
                <>
                  <Nav.Link as={Link} to="/user" onClick={() => navigate("/")}>
                    Login/Register
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/reservations"
                    onClick={() => navigate("/")}
                  >
                    Reservations
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/"
                    onClick={() => {
                      localStorage.removeItem("idToken");
                    }}
                  >
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        title="Favorite Movies"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ul>
          {filteredMovies.map((movie) => (
            <li key={movie.id}>
              <Link to={`/posts/${movie.id}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default UserHeader;
