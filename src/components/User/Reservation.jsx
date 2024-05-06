//You don't need to have two separate components for users/admins regarding reservations. 
//You can reuse the same component, but with different data and functionalities (that can be passed as props)
//if the user is admin, pass all the data, otherwise only the user data



import { useContext, useEffect, useState } from "react";
import {
  getSingleReservationUser,
  deleteReservation,
  updateReservation,
} from "../../api/users";
import {
  Spinner,
  Alert,
  Container,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from "../../App";



function Reservation() {
  const [reservation, setReservation] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const theme = useContext(ThemeContext);

  const idToken = localStorage.getItem("idToken");
  const decodedToken = jwtDecode(idToken);

  useEffect(() => {
    getSingleReservationUser(decodedToken.user_id)
      .then((data) => {
        setReservation(data);
        setIsError(false);
      })
      .catch((error) => {
        console.error("Error fetching reservation data:", error);
        setIsError(true);
      });
  }, [decodedToken.user_id]);

  const handleDelete = (id) => {
    deleteReservation(id)
      .then(() => {
        setReservation((prevReservations) =>
          prevReservations.filter((r) => r.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting reservation:", error));
  };

  const { register, handleSubmit } = useForm();

  const handleUpdate = (reservation) => {
    setCurrentReservation(reservation);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    updateReservation(currentReservation.id, data)
      .then(() => {
        setIsModalOpen(false);
        setReservation((prevReservations) =>
          prevReservations.map((r) =>
            r.id === currentReservation.id ? { ...r, ...data } : r
          )
        );
      })
      .catch((error) => console.error("Error updating reservation:", error));
  };

  if (isError) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">Error fetching reservation data!</Alert>
      </Container>
    );
  }

  if (reservation === null) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (reservation.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p>No reservations found.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="table-responsive">
        <Table striped bordered hover variant={`${theme.theme}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Age</th>
              <th>Nr. of Tickets</th>
              <th>Theatre</th>
              <th>Movie Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservation.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.surname}</td>
                <td>{data.email}</td>
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
                  <Button variant="info" onClick={() => handleUpdate(data)}>
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleModalSubmit)}>
            <Form.Group controlId="formName">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                defaultValue={currentReservation?.id}
                {...register("id", { required: "ID is required" })}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>User_ID</Form.Label>
              <Form.Control
                type="text"
                defaultValue={decodedToken.user_id}
                {...register("userId", { required: "User ID is required" })}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={currentReservation?.name}
                {...register("name", { required: "Name is required" })}
              />
            </Form.Group>
            <Form.Group controlId="formSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                defaultValue={currentReservation?.surname}
                {...register("surname", { required: "Surname is required" })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                defaultValue={currentReservation?.email}
                {...register("email", { required: "Email is required" })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                defaultValue={currentReservation?.age}
                {...register("age", { required: "Age is required" })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Number Of Tickets</Form.Label>
              <Form.Control
                type="number"
                defaultValue={currentReservation?.numberOfTickets}
                {...register("numberOfTickets", {
                  required: "Number of tickets is required",
                })}
              />
            </Form.Group>
            <Form.Group controlId="formTheatre">
              <Form.Label>Select Theatre</Form.Label>
              <Form.Select
                placeholder="Select Theatre"
                defaultValue={currentReservation?.theatre}
                {...register("theatre", { required: true })}
              >
                <option value="Theatre 1">Theatre 1</option>
                <option value="Theatre 2">Theatre 2</option>
                <option value="Theatre 3">Theatre 3</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control
                type="text"
                defaultValue={currentReservation?.movieTitle}
                {...register("movieTitle", {
                  required: "Movie Title is required",
                })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Reservation;
