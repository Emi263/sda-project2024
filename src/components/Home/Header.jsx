import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Form, Nav } from "react-bootstrap";
import { Modal } from "antd";
import CinemaLogo from "../../assets/cinema-icon.png";
import HeaderInfo from "./HeaderInfo";
import { getPopularMovies } from "../../api/users";
import { SearchContext } from "../../screens/Home";
import { ThemeContext } from "../../App";
import "./Header.css";
import { jwtDecode } from "jwt-decode";
const allowedUserId = import.meta.env.VITE_APP_ADMIN_ID;

function Header() {
  const search = useContext(SearchContext);
  const theme = useContext(ThemeContext);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);

  const idToken = localStorage.getItem("idToken");

  //you can move this to a separate function (reuse it)
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

  // Move this to src/helper.js

  const isAdmin = () => {
    const idToken = localStorage.getItem("idToken");

    if (!idToken) {
      return false;
    }

    const decodedToken = jwtDecode(idToken);

    return allowedUserId === decodedToken.user_id;
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
    if (isModalOpen) {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      setFavoriteMovieIds(storedFavorites);
    }
  }, [isModalOpen]);

  const filteredFavorites = movies.filter((movie) =>
    favoriteMovieIds.includes(movie.id)
  );

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    search.setSearchTerm(searchTerm);
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm)
    );
    setFilteredMovies(filtered);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`header-wrapper ${theme.theme}`}>
      <Navbar expand="lg" className={`navbar ${theme.theme}`} collapseOnSelect>
        <Container fluid>
          <Navbar.Brand onClick={() => navigate("/")}>
            <img
              src={CinemaLogo}
              alt="Icon Image"
              style={{ maxHeight: "50px" }}
              className="cinema-logo"
            />
            Cinema +
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Form
              className={`d-flex ${theme.theme} w-100`}
              onSubmit={(e) => e.preventDefault()}
            >
              <Form.Control
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search.searchTerm}
                onChange={handleSearchChange}
                className="me-2"
              />
            </Form>
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
                      localStorage.clear("idToken");
                    }}
                  >
                    Logout
                  </Nav.Link>
                </>
              )}

              {/* Easier: isAdmin() && <Nav.Link.../>*/}
              {isAdmin() ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/admindashboard"
                    onClick={() => navigate("/")}
                  >
                    Admin Dashboard
                  </Nav.Link>
                </>
              ) : (
                <></>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <HeaderInfo movies={filteredMovies} />

      <Modal
        title="Favorite Movies"
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <ul>
          {filteredFavorites.map((movie) => (
            <li key={movie.id}>
              <Link to={`/posts/${movie.id}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default Header;
