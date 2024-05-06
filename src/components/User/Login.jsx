import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Container, Col } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { logIn } from "../../api/users";
import { Alert } from "antd";
import Registration from "./Registration";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: logIn,
    onSuccess: (data) => {
      localStorage.setItem("idToken", data.idToken);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (err) => {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error?.message || "An unknown error occurred."
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
  };


  //this logic to be moved to src/helpers.js (reused) 
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

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-start align-items-center"
      style={{ minHeight: "100vh", paddingTop: "20px" }}
    >
      {error && (
        <Alert
          message={error}
          showIcon
          type="error"
          closable
          onClose={() => setError(null)}
          style={{ width: "100%" }}
        />
      )}
      {mutation.isSuccess && (
        <Alert
          message="Login successful!"
          showIcon
          type="success"
          closable
          style={{ width: "100%" }}
        />
      )}
      {isTokenExpired() ? (
        <Col sm={12} md={6} lg={4}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                isInvalid={!!errors.username}
                {...register("username", { required: "Email is required" })}
              />
              {errors.username && (
                <Form.Control.Feedback type="invalid">
                  {errors.username.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                isInvalid={!!errors.password}
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <Registration />
        </Col>
      ) : (
        <>
          <div>You are already logged in!</div>
          <Button
            variant="danger"
            onClick={() => {
              localStorage.removeItem("idToken");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </>
      )}
    </Container>
  );
}

export default Login;
