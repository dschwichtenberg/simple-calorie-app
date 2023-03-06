import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
  Typography,
  makeStyles,
  Snackbar,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import EntryModal from "../../components/EntryModal";
import Filter from "../../components/Filter";

import { setProducts, addProduct } from "./productReducer";
import { getUserProducts, addProductEntry } from "../../api";
import { useUser } from "../Login/useUser";
import {
  groupProductsByDate,
  filterProductsByDates,
  filterProductsByProductName,
  getCalorieToday,
  getTotalCalorie,
  getPriceThisMonth,
  isOnSameMonth,
  isOnSameDate,
} from "../../services/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: theme.spacing(2),
  },
  productsBox: {
    marginTop: theme.spacing(3),
  },
}));

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const { dailyCalorieLimit, monthlyPriceLimit } = useUser();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const [uniqProducts, setUniqProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState(["", ""]);

  const [triggerDay, setTriggerDay] = useState(false);
  const [triggerMonth, setTriggerMonth] = useState(false);

  const [notification, setNotification] = useState({
    calorieNotifVisible: false,
    priceNotifVisible: false,
    calorienotifMessage: "",
    priceNotifMessage: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNotification = () => {
    setNotification({
      calorieNotifVisible: false,
      colorieNotifMessage: "",
      priceNotifVisible: false,
      priceNotifMessage: "",
    });
    setTriggerMonth(false);
    setTriggerDay(false);
  };

  const handleAdd = (entry) => {
    addProductEntry(entry)
      .then((res) => {
        if (res.success) {
          if (isOnSameDate(new Date(), new Date(entry.date))) {
            setTriggerDay(true);
            console.log("today");
          }
          if (isOnSameMonth(new Date(), new Date(entry.date))) {
            setTriggerMonth(true);
          }
          dispatch(addProduct(res.data));
          handleClose();
        } else {
          console.log("Failed to add product");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const prods = products.map((prod) => prod.productName.toLowerCase());
    setUniqProducts([...new Set(prods)]);
  }, [products]);

  useEffect(() => {
    let filtered = filterProductsByProductName(products, searchQuery);
    filtered = filterProductsByDates(filtered, dateRange);

    setFilteredProducts(groupProductsByDate(filtered));
  }, [products, searchQuery, dateRange]);

  useEffect(() => {
    getUserProducts().then((res) => {
      dispatch(setProducts(res.data));
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    let notif = {};
    console.log(triggerDay);
    if (triggerDay) {
      const total = getCalorieToday(products);
      if (total > dailyCalorieLimit) {
        notif = {
          calorieNotifVisible: true,
          calorieNotifMessage: `You exceeded daily calorie limit(${dailyCalorieLimit} cal.) by reaching ${total} cal.`,
        };
      }
      setTriggerMonth(false);
    }

    if (triggerMonth) {
      const total = getPriceThisMonth(products);
      if (total > monthlyPriceLimit) {
        notif = {
          ...notif,
          priceNotifVisible: true,
          priceNotifMessage: `You exceeded monthly limit($${monthlyPriceLimit}) by reaching $${total}.`,
        };
      }

      setTriggerMonth(false);
    }

    setNotification(notif);
    //eslint-disable-next-line
  }, [products]);

  return (
    <Box className={classes.container}>
      <Button
        color="primary"
        variant="contained"
        size="medium"
        onClick={() => {
          setOpen(true);
        }}
      >
        Add entry
      </Button>
      {products.length > 0 && (
        <Filter
          title="Search by product"
          searchQuery={searchQuery}
          dateRange={dateRange}
          items={uniqProducts}
          onChangeSearchQuery={setSearchQuery}
          onChangeDateRange={setDateRange}
        />
      )}

      <Box className={classes.productsBox}>
        <List>
          {filteredProducts.map((group) => (
            <Box key={`day-entry-${group.date}`}>
              {group.entries?.map((product) => (
                <ListItem key={`entry-item-${product.id}`}>
                  <ListItemText
                    primary={product.productName}
                    secondary={
                      <>
                        Cal. {product.calorie}
                        <br />$ {product.price}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {product.date}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {!searchQuery && (
                <Typography
                  align="right"
                  color="textSecondary"
                >{`Day total: ${getTotalCalorie(group.entries)} cal. ${
                  getTotalCalorie(group.entries) > dailyCalorieLimit
                    ? "Exceeded Limit."
                    : ""
                }`}</Typography>
              )}

              <Divider />
            </Box>
          ))}
        </List>
      </Box>
      <EntryModal visible={open} onClose={handleClose} onSubmit={handleAdd} />
      <Snackbar
        open={notification.calorieNotifVisible}
        message={notification.calorieNotifMessage}
        key={"calorie"}
        onClose={handleCloseNotification}
        style={{ marginBottom: 50 }}
      />
      <Snackbar
        open={notification.priceNotifVisible}
        message={notification.priceNotifMessage}
        key={"price"}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}
