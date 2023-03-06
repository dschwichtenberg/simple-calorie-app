import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
  makeStyles,
} from "@material-ui/core";
import moment from "moment";

import { getAllProducts } from "../../api";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  listContainer: {
    width: "60%",
    margin: "auto",
    marginTop: theme.spacing(4),
  },
  list: {
    width: "100%",
  },
}));

export default function Report() {
  const classes = useStyles();
  const [report, setReport] = useState({
    numOfEntriesLast7Days: 0,
    numOfEntriesPrev7Days: 0,
    avgCalPerUser: [],
  });

  const generateReport = (data) => {
    const today = new Date();

    let last7DaysData = [];
    let prev7DaysData = [];
    data.map((userProduct) => {
      const { user, entries } = userProduct;
      const last = entries.filter(
        (entry) => moment(today).diff(moment(entry.date), "days") < 7
      );
      const prev = entries.filter((entry) => {
        const diff = moment(today).diff(moment(entry.date), "days");
        return diff < 14 && diff >= 7;
      });

      last7DaysData.push({ user, entries: last });
      prev7DaysData.push({ user, entries: prev });
      return true;
    });

    const numOfEntriesLast7Days = last7DaysData.reduce((total, current) => {
      return total + current.entries.length;
    }, 0);
    const numOfEntriesPrev7Days = prev7DaysData.reduce((total, current) => {
      return total + current.entries.length;
    }, 0);

    const avgCalPerUser = last7DaysData.map((userProduct) => {
      const sum = userProduct.entries.reduce(
        (total, current) => total + current.calorie,
        0
      );
      return { user: userProduct.user, avgCalorie: sum / 7 };
    });

    return { numOfEntriesLast7Days, numOfEntriesPrev7Days, avgCalPerUser };
  };

  useEffect(() => {
    getAllProducts().then((data) => {
      if (data) {
        setReport(generateReport(data.data));
      }
    });
  }, []);

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" align="center">
                Number of added entries in the last 7 days
              </Typography>
              <Typography variant="h5" align="center">
                {report.numOfEntriesLast7Days}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" align="center">
                Number of added entries s the week before
              </Typography>
              <Typography variant="h5" align="center">
                {report.numOfEntriesPrev7Days}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box className={classes.listContainer}>
        <Typography variant="subtitle1" align="center">
          The average calories added per user for the last 7 days
        </Typography>
        <Divider />
        <List className={classes.list}>
          {report.avgCalPerUser.map((userData) => (
            <ListItem key={`user-avg-${userData.user.userId}`}>
              <ListItemText
                primary={userData.user.userName}
                secondary={userData.user.userId}
              />
              <ListItemSecondaryAction>
                Avg. Cal: {userData.avgCalorie.toFixed(2)}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}
