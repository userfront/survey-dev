import axios from "axios";
import * as SurveyJS from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
} from "react-router-dom";
import Userfront from "@userfront/react";

const apiRoot =
  process.env.NODE_ENV === "production"
    ? "https://api.survey.dev"
    : "http://localhost:5000";

Userfront.init("5xbpy4nz");
const Signup = Userfront.build({
  toolId: "mnbrak",
});
const Login = Userfront.build({
  toolId: "nadrrd",
});

const isLoggedIn = () => Userfront.accessToken();

SurveyJS.StylesManager.applyTheme("modern");
const survey = new SurveyJS.Model(questions);

survey.onComplete.add(({ data }) => {
  axios.post(
    `${apiRoot}/survey-responses`,
    { data },
    {
      headers: {
        Authorization: `Bearer ${Userfront.accessToken()}`,
      },
    }
  );
});

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg bg-white py-4 shadow">
          <div className="container">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink exact to="/" className="btn btn-outline-primary mr-4">
                  survey.dev
                </NavLink>
              </li>
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
          </div>
        </nav>

        <div>
          <Switch>
            <Route path="/results">
              <Results />
            </Route>
            <Route path="/survey">
              <Survey />
            </Route>
            <Route path="/login">
              <div className="container py-5">
                <Login />
              </div>
            </Route>
            <Route path="/signup">
              <div className="container py-5">
                <Signup />
              </div>
            </Route>
            <Route path="/">
              <Landing />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;

function Landing() {
  return (
    <div
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)",
        backgroundSize: "cover",
        backgroundPosition: "right center",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="row py-5">
          <div className="col-md-6">
            <div className="card shadow border-0">
              <div className="card-body">
                <h1 className="card-title" style={{ fontSize: "1.75rem" }}>
                  2020 Survey of
                  <br />
                  Web Freelancers & Agencies
                </h1>
                <div className="my-4">
                  <Link to="/survey" className="btn btn-primary mr-3">
                    Survey
                  </Link>
                  <Link to="/results" className="btn btn-outline-primary">
                    Results
                  </Link>
                </div>
                <p className="card-text">
                  Take the 2020 survey to share and learn about pay trends
                  across regions and technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Survey() {
  const [response, setResponse] = useState({});
  useEffect(() => {
    if (!response.id) {
      axios
        .get(`${apiRoot}/survey-responses`, {
          headers: {
            Authorization: `Bearer ${Userfront.accessToken()}`,
          },
        })
        .then(({ data }) => {
          setResponse(data.surveyResponses[0]);
        });
    }
  });
  if (!isLoggedIn()) return <Redirect to={{ pathname: "/login" }} />;
  if (response.data) {
    const surveyView = new SurveyJS.Model(questions);
    surveyView.data = response.data;
    surveyView.mode = "display";

    return (
      <div className="container">
        <SurveyJS.Survey model={surveyView} />
      </div>
    );
  } else {
    return (
      <div className="container">
        <SurveyJS.Survey model={survey} />
      </div>
    );
  }
}

function LoginLogout() {
  if (isLoggedIn()) {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <button className="btn btn-link nav-link" onClick={Userfront.logout}>
            Logout
          </button>
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
  if (!isLoggedIn()) return <Redirect to={{ pathname: "/login" }} />;
  return (
    <div className="container py-5">
      <h2>Results</h2>
    </div>
  );
}
