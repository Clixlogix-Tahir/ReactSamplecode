import React from "react";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import { dashboardLayoutRoutes, authLayoutRoutes, staticRoutes } from "./index";

import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import { RouteInfoType } from "../types/types";
import { setUserGoogleProfile } from "../rtk-reducers/globalSlice";
import { CONSTANTS } from "../common/constants";
import {
  useAppDispatch
} from "../common/hooks";

const childRoutes = (Layout: React.ElementType, routes: Array<RouteInfoType>) =>
  routes.map(({component: Component, children, path}, index: number) =>{
      return children ? (
      children.map((element, index: number) => (
        <Route
          key={index}
          path={element.path}
          exact
          render={(props: RouteComponentProps) => (
            <Layout>
              <element.component {...props} />
            </Layout>
          )}
        />
      ))
    ) : Component ? (
      <Route
        key={index}
        path={path}
        exact
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    ) : null
  });

const Routes = () => {
  const dispatch = useAppDispatch();
  const user = localStorage.getItem(CONSTANTS.LOCAL_STORAGE.GOOGLE_PROFILE);
  dispatch(setUserGoogleProfile(user ? JSON.parse(user) : user));

  return (
  <Router>
    <Switch>
      {childRoutes(AuthLayout, staticRoutes)}
      {childRoutes(DashboardLayout, dashboardLayoutRoutes)}
      {childRoutes(AuthLayout, authLayoutRoutes)}
      <Route
        render={() => (
          <AuthLayout routes={authLayoutRoutes} width="md">
            <Page404 />
          </AuthLayout>
        )}
      />
    </Switch>
  </Router>
)};

export default Routes;