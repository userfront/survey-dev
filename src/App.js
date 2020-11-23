import axios from "axios";
import Cookie from "js-cookie";
import * as SurveyJS from "survey-react";
import "survey-react/modern.css";
import { Grid } from "gridjs-react";
import questions from "./questions.js";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import Userfront from "@userfront/react";
const Signup = Userfront.signupForm({
  toolId: "mnbrak",
  tenantId: "5xbpy4nz",
});
const Login = Userfront.signupForm({
  toolId: "nadrrd",
  tenantId: "5xbpy4nz",
});

SurveyJS.StylesManager.applyTheme("modern");
const survey = new SurveyJS.Model(questions);

survey.onComplete.add(function (result) {
  axios.post(
    "http://localhost:5000/survey-responses",
    {
      data: result.data,
    },
    {
      headers: {
        Authorization: `Bearer ${Cookie.get("access.5xbpy4nz")}`,
      },
    }
  );
});

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light">
          <NavLink to="/" className="navbar-brand">
            Survey.dev
          </NavLink>

          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/survey" className="nav-link">
                Survey
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/results" className="nav-link">
                Results
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
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
          </ul>
        </nav>

        <Switch>
          <Route path="/results">
            <Results />
          </Route>
          <Route path="/survey">
            <Survey />
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

function Survey() {
  const [response, setResponse] = useState({});
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await axios.get(
        "http://localhost:5000/survey-responses",
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("access.5xbpy4nz")}`,
          },
        }
      );
      if (isMounted) {
        setResponse(data.surveyResponses[0]);
      }
    })();
    return () => {
      isMounted = false;
    };
  });
  if (response.id) {
    return (
      <div>
        <ul>{response}</ul>
        {/* <Grid
          columns={[
            {
              name: "Technology",
              id(row) {
                return row.join(",");
              },
            },
            // { id: "createdAt", name: "Created At" },
          ]}
          data={listItems[0].data}
        /> */}
      </div>
    );
  } else {
    return (
      <div>
        <SurveyJS.Survey model={survey} />
      </div>
    );
  }
}

function Results() {
  return (
    <div>
      <h2>Results</h2>
    </div>
  );
}
