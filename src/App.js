import axios from "axios";
import Cookie from "js-cookie";
import * as SurveyJS from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import Userfront from "@userfront/react";
Userfront.init("5xbpy4nz");
const Signup = Userfront.build({
  toolId: "mnbrak",
  tenantId: "5xbpy4nz",
});
const Login = Userfront.build({
  toolId: "nadrrd",
  tenantId: "5xbpy4nz",
});

console.log(Userfront);

SurveyJS.StylesManager.applyTheme("modern");
const survey = new SurveyJS.Model(questions);

survey.onComplete.add(({ data }) => {
  axios.post(
    "http://localhost:5000/survey-responses",
    { data },
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
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

          <LoginLogout />
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
    if (!response.id) {
      axios
        .get("http://localhost:5000/survey-responses", {
          headers: {
            Authorization: `Bearer ${Cookie.get("access.5xbpy4nz")}`,
          },
        })
        .then(({ data }) => {
          setResponse(data.surveyResponses[0]);
        });
    }
  });
  if (response.data) {
    const surveyView = new SurveyJS.Model(questions);
    surveyView.data = response.data;
    surveyView.mode = "display";

    return (
      <div>
        <SurveyJS.Survey model={surveyView} />
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

function LoginLogout() {
  const isLoggedIn = () => Cookie.get("access.5xbpy4nz");
  if (isLoggedIn()) {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={Userfront.logout}>
            Logout
          </a>
        </li>
      </ul>
    );
  } else {
    return (
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
