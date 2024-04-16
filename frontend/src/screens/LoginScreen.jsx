import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/UI/Loader";
import { useLoginMutation } from "../slices/userApiSlice";

import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

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
    const userDetails = {};

    // Decode and assign each parameter from the URL
    queryParams.forEach((value, key) => {
      userDetails[key] = decodeURIComponent(value);
    });

    // Convert isAdmin to boolean
    userDetails.isAdmin = userDetails.isAdmin === "true";

    // Dispatch action to set credentials if all required parameters are present
    if (
      userDetails._id &&
      userDetails.name &&
      userDetails.email &&
      typeof userDetails.isAdmin === "boolean" &&
      userDetails.token
    ) {
      dispatch(setCredentials(userDetails));
      navigate(redirect); // Redirect to home page after setting credentials
    }
  }, [search, dispatch, navigate]);

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

  // const googleAuth = async () => {
  //   try {
  //     dispatch(googleSignInStart());
  //     window.location.href = "http://localhost:5000/auth/google";

  //     // After the redirect, parse the URL parameters and dispatch setCredentials
  //     const params = new URLSearchParams(window.location.search);
  //     const userDetailsString = params.get("_id");
  //     console.log(userDetailsString);
  //     if (userDetailsString) {
  //       const userDetails = JSON.parse(decodeURIComponent(userDetailsString));
  //       dispatch(setCredentials(userDetails));
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     toast.error(error.data.message || error.error);
  //   }
  // };

  const googleAuth = () => {
    try {
      window.location.href = "http://localhost:5000/auth/google";
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

        <Button
          type='button'
          variant='primary'
          className='mt-2'
          style={{
            width: "100%",
            textAlign: "center",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "12px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          // disabled={gLoginLoading}
          onClick={googleAuth}
        >
          <img
            src='./images/google.png'
            alt='Google Logo'
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          Sign In with Google
        </Button>

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
