import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
  makeStyles,
} from "@material-ui/core";

import Filter from "../../components/Filter";
import EntryModal from "../../components/EntryModal";

import { getAllProducts, removeProduct, updateProduct } from "../../api";
import {
  filterProductsByDates,
  filterProductsByUserName,
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
  btnRemove: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function Management() {
  const classes = useStyles();
  const [userProducts, setUserProducts] = useState([]);
  const [filteredUserProducts, setFilteredUserProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userNames, setUserNames] = useState([]);
  const [dateRange, setDateRange] = useState(["", ""]);
  const [itemOnEdit, setItemOnEdit] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const handleClose = () => {
    setItemOnEdit(null);
  };

  const toggle = () => {
    setTrigger(!trigger);
  };

  const handleRemove = (userId, entryId) => {
    if (window.confirm("Do you really want to remove this entry?")) {
      removeProduct(userId, entryId)
        .then((data) => {
          if (data.success) {
            toggle();
            console.log("success");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleUpdate = (entry, userId) => {
    updateProduct(userId, entry)
      .then((data) => {
        if (data.success) {
          toggle();
          console.log("success");
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllProducts().then((data) => {
      if (data?.data) {
        const allNames = [];
        const sorted = data.data.map((userProduct) => {
          const { user, entries } = userProduct;
          const sortedEntries = entries.sort((a, b) =>
            new Date(a.date) - new Date(b.date) < 0 ? 1 : -1
          );
          allNames.push(user.userName);
          return { user, entries: sortedEntries };
        });
        setUserNames(allNames);
        setUserProducts(sorted);
      }
    });
  }, [trigger]);

  useEffect(() => {
    let filtered = filterProductsByUserName(userProducts, searchQuery);
    filtered = filtered.map((userProduct) => {
      const { user, entries } = userProduct;
      return { user, entries: filterProductsByDates(entries, dateRange) };
    });
    setFilteredUserProducts(filtered);
  }, [userProducts, searchQuery, dateRange]);

  return (
    <Box className={classes.container}>
      <Filter
        title="Search by user"
        searchQuery={searchQuery}
        dateRange={dateRange}
        items={userNames}
        onChangeSearchQuery={setSearchQuery}
        onChangeDateRange={setDateRange}
      />
      <Box className={classes.productsBox}>
        {filteredUserProducts.map((userProduct) => (
          <List key={`item-user-${userProduct.user.userId}`}>
            <Typography variant="h6">{userProduct.user.userName}</Typography>
            {userProduct.entries.map((product) => (
              <ListItem key={`item-product-${product.id}`}>
                <ListItemText
                  primary={product.productName}
                  secondary={
                    <>
                      {product.calorie}
                      <br />
                      {product.date}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleRemove(userProduct.user.userId, product.id);
                    }}
                    className={classes.btnRemove}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setItemOnEdit({
                        userId: userProduct.user.userId,
                        entry: product,
                      });
                    }}
                  >
                    Edit
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <Divider />
          </List>
        ))}
      </Box>
      <EntryModal
        visible={!!itemOnEdit}
        onClose={handleClose}
        onSubmit={handleUpdate}
        entry={itemOnEdit?.entry}
        userId={itemOnEdit?.userId}
      />
    </Box>
  );
}
