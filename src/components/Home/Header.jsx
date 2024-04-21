import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CinemaLogo from "../../assets/cinema-icon.png";
import HeaderInfo from "./HeaderInfo";
import { Modal } from "antd";
import { getPopularMovies } from "../../api/users";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../screens/Home.jsx";

function Header() {
  const search = useContext(SearchContext);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    getPopularMovies()
      .then((data) => {
        setMovies(data.results);
        setFilteredMovies(data.results);
      })
      .catch((error) => {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
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

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteMovieIds(storedFavorites);
  }, [isModalOpen]);

  const handleSearchChange = (event) => {
    search.setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const filtered = movies.filter((movie) =>
      movie.title
        .toLowerCase()
        .includes(search.searchTerm.context.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

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
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid className="d-flex flex-row mb-3">
          <div className="d-flex justify-content-left align-items-center p-2">
            <img
              src={CinemaLogo}
              style={{ maxHeight: "50px" }}
              alt="Icon Image"
            />
            <Navbar.Brand href="">Cinema +</Navbar.Brand>
          </div>
          <div className="d-flex justify-content-center align-items-center  p-2">
            <Form className="d-flex justify-content-center">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={search.searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success" onClick={handleSearch}>
                Search
              </Button>
            </Form>
          </div>
          <div className="d-flex justify-content-right align-items-center p-2">
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse
              id="navbarScroll"
              className="justify-content-between d-flex flex-row mb-2"
            >
              <Nav.Link className="p-2" href="#home" onClick={handleClick}>
                Home
              </Nav.Link>
              <Nav.Link className="p-2" href="#home" onClick={showModal}>
                My Favorites
              </Nav.Link>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
      <HeaderInfo movies={filteredMovies} />
      <Modal
        title="Favorites Movies"
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

export default Header;
