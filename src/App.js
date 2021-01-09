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

const defaultThemeColors = SurveyJS.StylesManager.ThemeColors["modern"];
defaultThemeColors["$main-color"] = "#007bff";

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
        <nav className="navbar navbar-expand bg-white py-4 shadow">
          <div className="container">
            <NavLink exact to="/" className="btn btn-outline-primary mr-4">
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
            <Route path="/about">
              <About />
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
    <div>
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
      <div className="container py-4 d-flex">
        <a href="/about">About</a>
        <span className="ml-auto">Made with {"<3"} in California</span>
      </div>
    </div>
  );
}

function Survey() {
  const [response, setResponse] = useState();
  useEffect(() => {
    if (!response) {
      axios
        .get(`${apiRoot}/survey-responses`, {
          headers: {
            Authorization: `Bearer ${Userfront.accessToken()}`,
          },
        })
        .then(({ data }) => {
          if (data && data.surveyResponses) {
            setResponse(data.surveyResponses[0] || {});
          }
        });
    }
  });
  if (!isLoggedIn()) return <Redirect to={{ pathname: "/login" }} />;
  if (response && response.data) {
    const surveyView = new SurveyJS.Model(questions);
    surveyView.data = response.data;
    surveyView.mode = "display";

    return (
      <div className="container py-4">
        <SurveyJS.Survey model={surveyView} />
      </div>
    );
  } else {
    return (
      <div className="container py-4">
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
  const [results, setResults] = useState({});
  useEffect(() => {
    if (results.data) return;
    axios
      .get(`${apiRoot}/results`, {
        headers: {
          Authorization: `Bearer ${Userfront.accessToken()}`,
        },
      })
      .then(({ data }) => {
        setResults(data.results);
      });
  });
  if (!isLoggedIn()) return <Redirect to={{ pathname: "/login" }} />;
  return (
    <div className="container py-5">
      <h2>Results</h2>
      <pre>{JSON.stringify(results)}</pre>
    </div>
  );
}

function About() {
  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <h2 class="mb-4">About Survey.dev</h2>
      <h5 class="mb-3">
        Survey.dev is built to give web freelancers & agencies better info about
        the market for their services.
      </h5>
      <p>
        With the data collected in this survey, we hope that web development
        freelancers & agencies can learn more about the market for their
        services, allowing them to improve how they spend their time.
      </p>
      <p>
        The results of the survey will be shared directly to anyone who has
        taken the survey.
      </p>
      <p>
        <a href="/survey">Take the survey →</a>
      </p>

      <h5 class="mt-5 mb-3">Tutorial</h5>
      <p>There is also a tutorial for how to build the site itself.</p>
      <p>
        It is intended to be a complete guide for developing a{" "}
        <strong>secure, database-backed, production-ready application</strong>{" "}
        that you could use in professional work.
      </p>
      <p>
        <a href="https://github.com/tyrw/survey-dev-tutorial" target="_blank">
          See the tutorial →
        </a>
      </p>
      <h5 class="mt-5 mb-3">Contributing</h5>
      <p>
        You can contribute to this project by opening an issue on{" "}
        <a href="https://github.com/tyrw/survey-dev" target="_blank">
          /survey-dev
        </a>{" "}
        or{" "}
        <a href="https://github.com/tyrw/survey-dev-tutorial" target="_blank">
          /survey-dev-tutorial
        </a>
        . This project was started by{" "}
        <a href="https://github.com/tyrw" target="_blank">
          @tyrw
        </a>{" "}
        -- feel free to say hi!
      </p>
    </div>
  );
}
