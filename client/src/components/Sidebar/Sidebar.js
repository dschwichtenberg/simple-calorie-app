import React from "react";
import classNames from "classnames";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Dashboard, Settings, Assessment, Apps } from "@material-ui/icons";
import { Link } from "react-router-dom";

import { useAuth } from "../../containers/Login/useAuth";

const drawerWidth = 240;

const styles = (theme) => ({
  drawerPaper: {
    position: "fixed",
    top: theme.spacing(8),
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
});

const Sidebar = (props) => {
  const { open, classes } = props;
  const { isAdmin } = useAuth();

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classNames(
          classes.drawerPaper,
          !open && classes.drawerPaperClose
        ),
      }}
      open={open}
    >
      <List>
        <Link to="/">
          <ListItem button>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        {isAdmin && (
          <Link to="/management">
            <ListItem button>
              <ListItemIcon>
                <Apps />
              </ListItemIcon>
              <ListItemText primary="Management" />
            </ListItem>
          </Link>
        )}
        {isAdmin && (
          <Link to="/report">
            <ListItem button>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Report" />
            </ListItem>
          </Link>
        )}
        <Link to="/setting">
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default withStyles(styles)(Sidebar);
