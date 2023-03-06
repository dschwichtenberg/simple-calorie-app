import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import Login from "./containers/Login/Login";
import Home from "./containers/Home/Home";
import Report from "./containers/Report/Report";
import Management from "./containers/Management/Management";
import Setting from "./containers/Setting/Setting";

import MainLayout from "./layouts/MainLayout";
import EmptyLayout from "./layouts/EmptyLayout";
import { useDispatch } from "react-redux";
import { getTheme } from "./containers/Setting/settingsReducer";
import { useAuth } from "./containers/Login/useAuth";
import { setAuth } from "./containers/Login/authReducer";
import { checkAuth } from "./api";

const NotFound = () => {
  return <div>NotFound</div>;
};

const DashboardRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <MainLayout>
          <Component {...matchProps} />
        </MainLayout>
      )}
    />
  );
};

const EmptyRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <EmptyLayout>
          <Component {...matchProps} />
        </EmptyLayout>
      )}
    />
  );
};

export default function App() {
  const theTheme = useSelector(getTheme);
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    checkAuth()
      .then((data) => {
        if (data.success) {
          const {
            userId,
            userName,
            isAdmin,
            dailyCalorieLimit,
            monthlyPriceLimit,
          } = data.data;
          dispatch(
            setAuth({
              userId,
              userName,
              isAdmin,
              dailyCalorieLimit,
              monthlyPriceLimit,
              isLoggedIn: true,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //eslint-disable-next-line
  }, []);

  return (
    <MuiThemeProvider theme={createMuiTheme(theTheme)}>
      <CssBaseline />
      <div style={{ height: "100vh" }}>
        <Router>
          <Switch>
            {!isLoggedIn && (
              <EmptyRoute exact path="/login" component={Login} />
            )}
            {isAdmin && (
              <DashboardRoute path="/management" component={Management} />
            )}
            {isAdmin && <DashboardRoute path="/report" component={Report} />}

            <DashboardRoute path="/dashboard" component={Home} />
            <DashboardRoute path="/setting" component={Setting} />
            <DashboardRoute exact path="/" component={Home} />
            <EmptyRoute component={NotFound} />
          </Switch>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}
