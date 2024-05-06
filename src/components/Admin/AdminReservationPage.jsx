import { useContext, useEffect, useState } from "react";
import { Spinner, Alert, Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { deleteReservation, getAllReservationData } from "../../api/users";
import { ThemeContext } from "../../App";
import { jwtDecode } from "jwt-decode";
const allowedUserId = import.meta.env.VITE_APP_ADMIN_ID;

function AdminReservationPage() {
  const [reservations, setReservations] = useState(null);
  const [isError, setIsError] = useState(false);
  const idToken = localStorage.getItem("idToken");
 
 //this logic is better to be in a separate file src/helpers.js 
  const decodedToken = jwtDecode(idToken);
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();

  // again, you could use react query here, much easier
  useEffect(() => {
    if (decodedToken.user_id !== allowedUserId) {
      navigate("/unauthorized");
      return;
    }

    getAllReservationData()
      .then((data) => {
        setReservations(data);
        setIsError(false);
      })
      .catch((error) => {
        console.error("Error fetching reservation data:", error);
        setIsError(true);
      });
  }, [decodedToken.user_id, navigate]);


  //you can replace the logic it with useMutation
  const handleDelete = (id) => {
    deleteReservation(id)
      .then(() => {
        setReservations((prevReservations) =>
          prevReservations.filter((r) => r.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting reservation:", error));
  };

  if (isError) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">Error fetching reservation data!</Alert>
      </Container>
    );
  }


  //this condition here is not entirely correct: The reservations may be undefined, or null in the end, which would result in infinite loading.

  if (reservations === null) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (reservations.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p>No reservations found.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="table-responsive">
        <Table striped bordered hover variant={theme.theme}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Email from Token</th>
              <th>Age</th>
              <th>Nr. of Tickets</th>
              <th>Theatre</th>
              <th>Movie Title</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.surname}</td>
                <td>{data.email}</td>
                <td>{data.emailToken}</td>
                <td>{data.age}</td>
                <td>{data.numberOfTickets}</td>
                <td>{data.theatre}</td>
                <td>{data.movieTitle}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default AdminReservationPage;
