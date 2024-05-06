import axios from "axios";
import { jwtDecode } from "jwt-decode";
const apiKey = import.meta.env.VITE_APP_API_KEY;
const idToken = localStorage.getItem("idToken");

//move this function to /api/movies.js

export async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
  const res = await axios.get(url);

  return res.data;
}


export async function getAllUsers() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  return res.data;
}
//move this function to /api/movies.js


export async function getSinglePost(filmId) {
  const res = await axios.get(
    "https://api.themoviedb.org/3/movie/" +
      filmId +
      `?api_key=${apiKey}&append_to_response=videos`
  );
  return res.data;
}

//move these functions to /api/auth.js

export async function signUp(data) {
  const res = await axios.post(
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCTSIpXohgcKPlmZ07Ad-LO1Sj-GvFszUQ",
    {
      email: data.username,
      password: data.password,
    }
  );
  return res.data;
}

export async function logIn(data) {
  const res = await axios.post(
    " https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCTSIpXohgcKPlmZ07Ad-LO1Sj-GvFszUQ",
    {
      email: data.username,
      password: data.password,
    }
  );
  return res.data;
}



//move these functions to /api/reservations.js


export async function reservationData(data) {
  const decodedToken = jwtDecode(idToken);
  const res = await axios.post(" http://localhost:3000/reservations", {
    userId: decodedToken.user_id,
    emailToken: decodedToken.email,
    name: data.name,
    surname: data.surname,
    email: data.username,
    age: data.age,
    numberOfTickets: data.tickets,
    theatre: data.theatre,
    movieTitle: data.movieTitle,
  });
  return res.data;
}

export async function getAllReservationData() {
  const res = await axios.get("http://localhost:3000/reservations");
  return res.data;
}

export async function getSingleReservationUser(userId) {
  const res = await axios.get(
    "http://localhost:3000/reservations?userId=" + userId
  );
  return res.data;
}
export async function deleteReservation(id) {
  const res = await axios.delete("http://localhost:3000/reservations/" + id);
  return res.data;
}
export const updateReservation = (id, updatedData) => {
  return axios.put(`http://localhost:3000/reservations/${id}`, updatedData);
};
