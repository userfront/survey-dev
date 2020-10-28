import axios from "axios";
import * as Survey from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

Survey.StylesManager.applyTheme("modern");
const survey = new Survey.Model(questions);

survey.onComplete.add(function (result) {
  axios.post("http://localhost:5000/survey-responses", {
    data: result.data,
  });
});

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" className="navbar-brand">
            Survey.dev
          </Link>

          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/survey" className="nav-link">
                Survey
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/survey-responses" className="nav-link">
                Responses
              </Link>
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

class Login extends React.Component {
  componentDidMount() {
    window.Userfront.ready(() => {
      window.Userfront.render();
    });
  }
  render() {
    // Signup form
    return (
      <div>
        <div id="userfront-mnbrak"></div>
      </div>
    );
  }
}

function Responses() {
  return <h2>Responses</h2>;
}
