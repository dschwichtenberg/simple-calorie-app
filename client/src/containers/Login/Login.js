import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  makeStyles,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { useFormik } from "formik";
import * as Yup from "yup";

import { login } from "../../api";
import { setAuth } from "./authReducer";

const schema = Yup.object().shape({
  userId: Yup.string().required("Required").min(4, "Minimum 4 characters"),
  password: Yup.string().required("Required").min(4, "Minimum 4 characters"),
});

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    marginBottom: theme.spacing(3),
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  error: {
    color: "red",
  },
}));

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (values) => {
    try {
      const data = await login(values.userId, values.password);
      if (data.success) {
        const {
          userId,
          userName,
          isAdmin,
          token,
          dailyCalorieLimit,
          monthlyPriceLimit,
        } = data.data;
        dispatch(
          setAuth({
            isLoggedIn: true,
            userId,
            userName,
            isAdmin,
            dailyCalorieLimit,
            monthlyPriceLimit,
          })
        );
        localStorage.setItem("token", token);
        history.push("/");
      } else {
        setErrorText("Invalid id or password!");
      }
    } catch (err) {
      console.log(err);
      setErrorText("Something went wrong. Try again later!");
    }
  };

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validationSchema: schema,
  });

  useEffect(() => {}, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Card>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" className={classes.title}>
              Please login to continue
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
              <FormControl className={classes.formControl}>
                <TextField
                  label="User ID"
                  variant="outlined"
                  value={formik.values.userId}
                  onChange={formik.handleChange("userId")}
                  onBlur={formik.handleBlur("userId")}
                  error={formik.errors.userId && formik.touched.userId}
                ></TextField>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  error={formik.errors.password && formik.touched.password}
                ></TextField>
              </FormControl>
              <FormControl>
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={formik.errors.userId || formik.errors.password}
                >
                  Login
                </Button>
              </FormControl>
            </Box>
          </CardContent>
          <CardActions>
            <Typography className={classes.error}>{errorText}</Typography>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}
