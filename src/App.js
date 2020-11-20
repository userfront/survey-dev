import axios from "axios";
import Cookie from "js-cookie";
import * as Survey from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import Toolkit from "@userfront/react";
const Signup = Toolkit.signupForm({
  toolId: "mnbrak",
  tenantId: "5xbpy4nz",
});
const Login = Toolkit.signupForm({
  toolId: "nadrrd",
  tenantId: "5xbpy4nz",
});

Survey.StylesManager.applyTheme("modern");
const survey = new Survey.Model(questions);

survey.onComplete.add(function (result) {
  axios.post(
    "http://localhost:5000/survey-responses",
    {
      data: result.data,
    },
    {
      headers: {
        Authorization: `Bearer ${Cookie.get("access.5xbpy4nz")}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      withCredentials: true,
    }
  );
});

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <NavLink to="/" className="navbar-brand">
            Survey.dev
          </NavLink>

          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" className="nav-link">
                Signup
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/survey" className="nav-link">
                Survey
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/survey-responses" className="nav-link">
                Responses
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/survey-responses">
            <Responses />
          </Route>
          <Route path="/survey">
            <div className="App">
              <Survey.Survey model={survey} />
            </div>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

function Landing() {
  return <h2>Landing</h2>;
}

function Responses() {
  return <h2>Responses</h2>;
}
