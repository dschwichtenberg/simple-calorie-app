import React from "react";
import {
  Button,
  InputLabel,
  FormControl,
  Select,
  TextField,
  Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  searchBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  searchQuery: {
    minWidth: theme.spacing(30),
    marginBottom: theme.spacing(1),
  },
  btnClear: {
    marginBottom: theme.spacing(1),
  },
}));

export default function Filter({
  title,
  items,
  searchQuery,
  dateRange,
  onChangeSearchQuery,
  onChangeDateRange,
}) {
  const classes = useStyles();

  const handleChangeSearchQuery = (value) => {
    onChangeSearchQuery(value);
  };

  const handleChangeDateFrom = (value) => {
    const [, dateTo] = dateRange;
    if (dateTo && dateTo < value) {
      return;
    }

    onChangeDateRange([value, dateTo]);
  };

  const handleChangeDateTo = (value) => {
    const [dateFrom] = dateRange;
    if (dateFrom && value < dateFrom) {
      return;
    }
    onChangeDateRange([dateFrom, value]);
  };

  const handleClearFilter = () => {
    onChangeSearchQuery("");
    onChangeDateRange(["", ""]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={4} className={classes.searchBox}>
        <FormControl className={classes.searchQuery}>
          <InputLabel id="simple-select-label">{title}</InputLabel>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            value={searchQuery}
            label={title}
            onChange={(e) => {
              handleChangeSearchQuery(e.target.value);
            }}
          >
            {items.map((item) => (
              <option value={item} key={`menu-item-${item}`}>
                {item}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item sm={12} md={6} className={classes.searchBox}>
        <FormControl>
          <Grid container spacing={1}>
            <Grid item sm={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="dateFrom"
                label="From"
                type="date"
                value={dateRange[0]}
                onChange={(e) => {
                  handleChangeDateFrom(e.target.value);
                }}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="dateTo"
                label="To"
                type="date"
                value={dateRange[1]}
                onChange={(e) => {
                  handleChangeDateTo(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
      <Grid item sm={12} md={2} className={classes.searchBox}>
        <Button
          variant="contained"
          onClick={handleClearFilter}
          className={classes.btnClear}
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  );
}
