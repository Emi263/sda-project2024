import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getPopularMovies } from "../../api/users";
import { Link } from "react-router-dom";
import { StarTwoTone } from "@ant-design/icons";
import { SearchContext } from "../../screens/Home.jsx";
import { ThemeContext } from "../../App";
import "./cards.css";
import { jwtDecode } from "jwt-decode";

function Cards() {
  const [movies, setMovies] = useState([]);
  const [showMoreMap, setShowMoreMap] = useState({});
  const [favorites, setFavorites] = useState([]);
  const search = useContext(SearchContext);
  const { theme } = useContext(ThemeContext);

  const idToken = localStorage.getItem("idToken");



  //move this function to src/helpers.js
  
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

  const baseStyle = {
    transition: "all 0.3s",
  };
  const darkStyle = {
    backgroundColor: "#333",
    color: "#fff",
  };
  const lightStyle = {
    backgroundColor: "#f8f9fa",
    color: "#000",
  };

  const currentStyle =
    theme === "dark"
      ? { ...baseStyle, ...darkStyle }
      : { ...baseStyle, ...lightStyle };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

      //this could be replaced with react query USEQUERY

    getPopularMovies()
      .then((data) => {
        setMovies(data.results);
      })
      .catch((error) => {
        console.error("Error fetching popular movies:", error);
      });
  }, []);

  //move this function to src/helpers.js
  const trimDescription = (text, maxLength) => {
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };

  const toggleShowMore = (id) => {
    setShowMoreMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((fav) => fav !== id);
      }
      return [...prevFavorites, id];
    });
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.searchTerm.toLowerCase())
  );

  return (
    <div style={currentStyle}>
      <Row xs={1} md={3} className="g-4">
        {filteredMovies.map((movie) => (
          <Col key={movie.id}>
            <Card style={currentStyle} className="card">
              <Card.Img
                variant="top"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : "https://via.placeholder.com/150"
                }
              />
              <Card.Body style={currentStyle}>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                  {showMoreMap[movie.id]
                    ? movie.overview
                    : trimDescription(movie.overview, 50)}
                </Card.Text>
                <Button
                  variant="link"
                  onClick={() => toggleShowMore(movie.id)}
                  style={{ color: theme === "dark" ? "#00f" : "#000" }}
                >
                  {showMoreMap[movie.id] ? "Less" : "More"}
                </Button>
                <Card.Text>Release Date: {movie.release_date}</Card.Text>
                <Card.Text>Vote Average: {movie.vote_average}</Card.Text>
                <Link to={`/posts/${movie.id}`}>
                  {isTokenExpired() ? (
                    ""
                  ) : (
                    <Button
                      variant="primary"
                      style={{
                        backgroundColor: theme === "dark" ? "#444" : "#007bff",
                      }}
                    >
                      See Details
                    </Button>
                  )}
                </Link>
              </Card.Body>

              {/*Simpler logic: isTokenExpired() && <Card.Footer...   */}
              {isTokenExpired() ? (
                ""
              ) : (
                <Card.Footer
                  style={{
                    borderTop: `1px solid ${
                      theme === "dark" ? "#555" : "#ddd"
                    }`,
                  }}
                >
                  <StarTwoTone
                    onClick={() => toggleFavorite(movie.id)}
                    twoToneColor={
                      favorites.includes(movie.id) ? "#fadb14" : "#000"
                    }
                    style={{ fontSize: "24px", cursor: "pointer" }}
                  />
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Cards;
