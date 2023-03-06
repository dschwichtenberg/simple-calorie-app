import React, { useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";

import { useFormik } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    marginBottom: theme.spacing(1),
  },
}));

const schema = Yup.object().shape({
  productName: Yup.string().required("Required"),
  calorie: Yup.number()
    .min(0, "Calorie can't be negative value.")
    .required("Required"),
  date: Yup.date().required("Required"),
  price: Yup.number()
    .required("Required")
    .min(0, "Price can't be negative value."),
});

export default function FormDialog({
  visible,
  onClose,
  onSubmit,
  entry,
  userId,
}) {
  const classes = useStyles();

  const handleFormSubmit = (values) => {
    onSubmit({ ...values, id: entry?.id }, userId);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      productName: "",
      calorie: 0,
      date: "",
      price: 0,
    },
    onSubmit: handleFormSubmit,
    validationSchema: schema,
  });

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (entry) {
      setValues({ ...entry });
    } else {
      resetForm();
    }
    //eslint-disable-next-line
  }, [visible]);

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
        <DialogContent className={classes.container}>
          <DialogContentText>
            Add product/food entry you take with its calorie and price.
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <TextField
              autoFocus
              margin="normal"
              variant="outlined"
              id="name"
              label="Product name"
              fullWidth
              value={values.productName}
              onChange={handleChange("productName")}
              onBlur={handleBlur("productName")}
              error={errors.productName && touched.productName}
            />
            <FormHelperText error>{errors.productName}</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              margin="normal"
              variant="outlined"
              id="calorie"
              label="Calorie"
              type="number"
              fullWidth
              value={values.calorie}
              onChange={handleChange("calorie")}
              onBlur={handleBlur("calorie")}
              error={errors.calorie && touched.calorie}
            />
            <FormHelperText error>{errors.calorie}</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              margin="normal"
              id="date"
              label="Date"
              type="datetime-local"
              fullWidth
              value={values.date}
              onChange={handleChange("date")}
              onBlur={handleBlur("date")}
              error={errors.date && touched.date}
            />
            <FormHelperText error>{errors.date}</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              margin="normal"
              variant="outlined"
              id="price"
              label="Price"
              type="number"
              fullWidth
              value={values.price}
              onChange={handleChange("price")}
              onBlur={handleBlur("price")}
              error={errors.price && touched.price}
            />
            <FormHelperText error>{errors.price}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" size="large">
            Cancel
          </Button>
          <Button
            type="submit"
            size="large"
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
