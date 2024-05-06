import { useContext, useEffect, useState } from "react";
import { getSinglePost } from "../../api/users";
import CardComponent from "react-bootstrap/Card";
import { ThemeContext } from "../../App";

// eslint-disable-next-line react/prop-types
function MovieCard({ postId }) {
  const [movie, setMovie] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  const cardStyle =
    theme === "dark"
      ? { backgroundColor: "#333", color: "#fff" }
      : { backgroundColor: "#f8f9fa", color: "#000" };



  //Better to use USEQUERY, where is error & loading state? 
//React query provides you with those states
  useEffect(() => {
    getSinglePost(postId)
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => {
        console.error("Error fetching movie:", error);
      });
  }, [postId]);

  
  return (
    <div style={cardStyle}>
      {movie && (
        <CardComponent style={cardStyle}>
          <CardComponent.Body>
            <CardComponent.Title>{movie.title}</CardComponent.Title>
            <CardComponent.Text>{movie.overview}</CardComponent.Text>
            <CardComponent.Text>{movie.release_date}</CardComponent.Text>
            <CardComponent.Text>
              Average: {movie.vote_average}
            </CardComponent.Text>
          </CardComponent.Body>
        </CardComponent>
      )}
    </div>
  );
}

export default MovieCard;
