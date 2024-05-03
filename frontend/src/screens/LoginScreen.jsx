import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/UI/Loader";
import { useLoginMutation } from "../slices/userApiSlice";

import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import GoogleButton from "react-google-button";
import { jwtDecode } from "jwt-decode";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const token = queryParams.get("token");
    const userDetails = {};

    if (token) {
      try {
        // Decode the JWT token to extract user information

        const decodedToken = jwtDecode(token);
        const { userId, name, email, isAdmin } = decodedToken;
        userDetails._id = userId;
        userDetails.name = name;
        userDetails.email = email;
        userDetails.isAdmin = isAdmin === "true";

        if (
          userDetails._id &&
          userDetails.name &&
          userDetails.email &&
          typeof userDetails.isAdmin === "boolean"
        ) {
          dispatch(setCredentials(userDetails));
          navigate(redirect); // Redirect to home page after setting credentials
        }

        // Dispatch action to set credentials if all required parameters are present
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }, [search, dispatch, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  const googleAuth = () => {
    try {
      // const baseUrl =
      //   process.env.ENVIRO === "production"
      //     ? `https://proshop-1-9ulo.onrender.com/auth/google`
      //     : "http://localhost:5000/auth/google";
      const baseUrl = `https://proshop-1-9ulo.onrender.com/auth/google`;

      console.log("URL: ", baseUrl);
      window.location.href = baseUrl;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Sign In
        </Button>

        <h2 className='mt-2'>Or </h2>

        <GoogleButton onClick={googleAuth} />

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer ?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
