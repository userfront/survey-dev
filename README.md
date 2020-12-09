# Survey.Dev

The goal of this tutorial is to be a complete guide for building a **secure, database-backed, production-ready** application that you could use in professional work.

This tutorial builds up both the frontend & backend of the [survey.dev](https://survey.dev) website.

At a high level, this tutorial uses the following tools:

| Frontend                                                                 |     | Backend                                                                     |
| :----------------------------------------------------------------------- | --- | :-------------------------------------------------------------------------- |
| [React](https://reactjs.org/) <br> User interface builder                |     | [Node](https://nodejs.org/) <br > JavaScript runtime                        |
| [React Router](https://reactrouter.com/) <br> Client-side routing        |     | [Express.js](https://expressjs.com/) <br> Web server framework              |
| [SurveyJS](https://surveyjs.io/) <br> Submit and display surveys         |     | [Postgres](https://www.postgresql.org/) <br> Database                       |
| [Axios](https://github.com/axios/axios) <br> Make API requests           |     | [Sequelize](https://sequelize.org/) <br> ORM (helps write database queries) |
| [Userfront](https://userfront.com/) <br> Authentication & access control |     | [Jest](https://jestjs.io/) <br> Testing                                     |

### Table of contents

The tutorial will build a site from scratch in the following order:

|     | Section                                                                           |
| --: | :-------------------------------------------------------------------------------- |
|  1. | [Site & API design](#design)                                                      |
|  2. | [Initial frontend setup (Create React App)](#initial-setup-with-create-react-app) |
|  3. | [Add routing, styling, and survey to frontend](#add-routing-styling-and-survey)   |
|  4. | [Initial backend setup (Express.js)](#set-up-backend-server)                      |
|  5. | [Add a database connection](#add-a-database-connection)                           |
|  6. | [Add testing to the backend](#testing)                                            |
|  7. | [Save submitted data to the database](#save-a-survey-response-from-the-frontend)  |
|  8. | [Add signup, login, and logout](#signup-login-and-logout)                         |
|  9. | [Send a JWT with the request](#send-a-jwt-with-the-request)                       |
| 10. | [Verify the JWT access token](#verify-the-jwt-access-token)                       |
| 11. | [Add a protected route](#add-a-protected-route)                                   |
| 12. | [Deploy to production](#notes-on-deployment)                                      |

---

### 1.

## Design

### Site layout

We want to build a site with the following pages:

| Route                   | Page         | Purpose                                                   |
| ----------------------- | ------------ | --------------------------------------------------------- |
| /                       | Landing page | Give some information about the website.                  |
| /survey                 | Survey page  | Allow a user to submit their survey.                      |
| /results                | Survey page  | Allow authorized users to view the survey results.        |
| /signup, /login, /reset | Auth pages   | Allow users to sign up, log in, and reset their password. |

The pages will roughly look like the following:

![Website design](https://res.cloudinary.com/component/image/upload/v1606931058/permanent/survey-dev-design.png)

### Architecture

We will build the frontend as a single-page app, and we'll build the backend as a standalone API.

The frontend will communicate with the backend by making API requests using JSON Web Tokens (JWTs) for authorization.

For this tutorial, the frontend and backend code will live in the same codebase. However, we could also choose to keep them completely separate from each other if we wanted.

### API routes

Our frontend will send to the following endpoints to save and display survey data:

| Route                  | Purpose                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| POST /survey-responses | Receive survey data and save it to the database.                          |
| GET /survey-responses  | Return a user's survey response if they have already answered the survey. |
| GET /results           | Return the results of all survey responses.                               |
| GET /status            | Return "ok" if the server is running.                                     |

---

### 2.

## Initial setup with Create React App

React is a great frontend tool, but it's a bit of a hassle to set up from scratch. Because of this, we'll use Create React App to get up and running quickly.

Follow the Quick Start instructions for Create React App (https://create-react-app.dev/docs/getting-started/). In your terminal, enter:

```
npx create-react-app survey-dev
cd survey-dev
npm start
```

After installing and running, your quickstart site should be viewable at `http://localhost:3000`

![Create React App](https://res.cloudinary.com/component/image/upload/v1603496124/permanent/survey-tutorial-0.png)

Like the message says, we can now edit our `src/App.js` file to start working.

---

### 3.

## Add routing, styling, and survey

We want to render different views for each path (`/survey`, `/results`, etc) without reloading the page each time, so we'll use React Router to handle our client-side routing.

### Add React Router

Install React Router and save it to our `package.json` file.

```
npm install react-router-dom --save-dev
```

With this installed, we can update `src/App.js` for a basic application with routing:

```js
// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand bg-white py-4 shadow">
          <div className="container">
            <NavLink exact to="/" className="btn btn-outline-primary mr-4">
              survey.dev
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
            <AuthButtons />
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
      </div>
    </Router>
  );
}

export default App;

function Landing() {
  return <div className="container">Landing</div>;
}

function Survey() {
  return <div className="container">Survey</div>;
}

function Results() {
  return <div className="container">Results</div>;
}

function Signup() {
  return <div className="container">Signup</div>;
}

function Login() {
  return <div className="container">Login</div>;
}

function AuthButtons() {
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
```

If you're unfamiliar with React or React Router, take a moment to look at the file and get a sense for how it works.

The `<Router>` tag scopes everything for React Router, while the `<Switch>` tag contains all the `<Route>` tags that can be visited.

Whenever a user visits a route that corresponds to one of these tags (e.g. `path="/survey"`), React Router will render the corresponding component (e.g. `<Survey />`)

### Add Bootstrap styling

The styling for our `App.js` file doesn't look very good, so we can use the Bootstrap 4 stylesheet. Add it inside the `<head>` tag in `public/index.html`

```html
<!-- Add in the <head> of public/index.html -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
  integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
  crossorigin="anonymous"
/>
```

Now when you run your server with `npm start`, you should have a basic application at `http://localhost:3000`:

![React Router](https://res.cloudinary.com/component/image/upload/v1606952665/permanent/survey-dev-0.gif)

### Add SurveyJS

Let's work on the `/survey` page first, since that's a main feature of the application. We'll use SurveyJS, which has a library for React: https://surveyjs.io/Documentation/Library.

```
npm install survey-react --save-dev
```

SurveyJS renders a nice-looking survey form based on a JSON object with questions in it.

Start by creating a `questions.js` file inside the `src/` directory. You can update these questions to whatever you want, based on the [SurveyJS docs](https://surveyjs.io/Examples/Library?id=questiontype-text&platform=Reactjs&theme=modern).

```js
// src/questions.js

const questions = {
  title: "What technologies do you use?",
  pages: [
    {
      name: "Page 1",
      questions: [
        {
          name: "frameworkUsing",
          title: "Do you use any front-end framework?",
          type: "radiogroup",
          choices: ["Yes", "No"],
          isRequired: true,
        },
        {
          name: "framework",
          title: "What front-end framework do you use?",
          type: "checkbox",
          choices: ["React", "Vue", "Angular", "jQuery"],
          hasOther: true,
          isRequired: true,
          visibleIf: "{frameworkUsing} = 'Yes'",
        },
      ],
    },
    {
      name: "Page 2",
      questions: [
        {
          type: "comment",
          name: "about",
          title: "Please tell us about your experience",
        },
      ],
    },
  ],
};

export default questions;
```

With the questions in place, we can update `src/App.js` to show the survey.

Add the required `import` statements for SurveyJS and the questions, and then update the `Survey` method near the bottom to include the `<SurveyJS.Survey />` element.

```js
// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import * as SurveyJS from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

SurveyJS.StylesManager.applyTheme("modern");
const survey = new SurveyJS.Model(questions);
survey.onComplete.add((result) => {
  console.log(result.data);
});

// ...

function Survey() {
  return (
    <div className="container">
      <SurveyJS.Survey model={survey} />
    </div>
  );
}

// ...
```

Now when we visit `http://localhost:3000/survey`, we should see our questions rendered nicely:

![SurveyJS result](https://res.cloudinary.com/component/image/upload/v1606953919/permanent/survey-0.png)

Right now, if we complete the survey, it logs the resulting data to the console because of the line:

```js
survey.onComplete.add((result) => {
  console.log(result.data);
});
```

We'll want to send this data to our backend API instead so that it can be saved.

Let's go ahead and set up the backend.

---

### 4.

## Set up backend server

We could make a separate repo for the backend since it will be completely separate, but instead we will keep it under one repo and put the backend files in their own folder.

### Add Express.js

Start by installing express into the project:

```
npm install express --save
```

If you have trouble installing, check out the [Express.js docs](https://expressjs.com/).

Remember that we want the following routes:

| Route                  | Purpose                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| POST /survey-responses | Receive survey data and save it to the database.                          |
| GET /survey-responses  | Return a user's survey response if they have already answered the survey. |
| GET /results           | Return the results of all survey responses.                               |
| GET /status            | Return "ok" if the server is running.                                     |

Create a file named `server.js` at the top level of the project.

```js
// server.js

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

app.all(["/survey-responses", "/results"], (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/survey-responses", async (req, res) => {
  return res.send("Coming soon");
});

app.get("/survey-responses", async (req, res) => {
  return res.send("Coming soon");
});

app.get("/results", async (req, res) => {
  return res.send("Results");
});

app.get("/status", async (req, res) => {
  return res.send("ok");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
```

If you haven't ever used Express, take a moment to study the `server.js` file to see how it works.

The `app.all` block is added to include headers for CORS, so that the browser does not reject incoming requests.

Each route is then registered with `app.post` or `app.get`, and each route sends a response based on what is returned with `res.send()`. Finally, the server listens on port 5000.

### Run the server

We want our backend server to automatically reload any changes we make, and we can use `nodemon` to accomplish this during development.

```
npm install nodemon --save-dev
```

Now in one terminal tab, you can run `npm run serve` to start the frontend on `localhost:3000`.

In another terminal tab you can run `nodemon server.js` to start the backend on `localhost:5000`.

| Command             | Server                      | Location              |
| ------------------- | --------------------------- | --------------------- |
| `npm run serve`     | Frontend (Create React App) | http://localhost:3000 |
| `nodemon server.js` | Backend (Express.js)        | http://localhost:5000 |

With the backend process running, visiting http://localhost:5000/survey-responses should return "Coming soon".

![Express.js route](https://res.cloudinary.com/component/image/upload/v1606956074/permanent/survey-api-0.png)

---

### 5.

## Add a database connection

We will use [PostgreSQL](https://www.postgresql.org/) ("Postgres") for our database, along with an ORM called [Sequelize](https://sequelize.org/master/manual/getting-started.html) to help make our queries easier to read and write.

Install Postgres, Sequelize, and the pg-hstore adapter into the project:

```
npm install sequelize pg pg-hstore --save
```

### Create the database

If you don't already have Postgres on your computer, download and install it here: https://www.postgresql.org/download/. You will need this to run the database locally.

Once you have Postgres installed, use either the Postgres app or `psql` to create 2 databases -- one named `survey_test` for testing and one named `survey_dev` for development.

If you are using `psql` in your terminal, these are the commands:

```
psql
create database survey_test;
create database survey_dev;
\q
```

### Set up a .env file

We will be using different database details in different environments (testing, development, production).

A standard way to manage different values across environments is by using a `.env` file. The npm package `dotenv` will help us implement this.

Install the `dotenv` package, and also create a new folder called `/api` for our backend files. Add the `.env` file to this folder:

```
npm install dotenv --save
mkdir api
touch api/.env
```

The `api/.env` file will be used for the development environment by default, and we will modify the test environment to change the database name.

For now, populate the `api/.env` file with the following attributes:

```
# api/.env
DATABASE_NAME=survey_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=null
DATABASE_HOST=localhost
DATABASE_DIALECT=postgres
DATABASE_PORT=5432
```

When we run `dotenv`, it will assign each of these to a variable that will be available in our application as `process.env.DATABASE_NAME`, `process.env.DATABASE_USERNAME`, and so on.

Note: if you created your database with different name, username, or password, use your values in the `api/.env` file instead.

### Configure Sequelize

Sequelize has 2 main features we want to use:

- **Models** allow us to create functions that can create, update, and delete data easily.
- **Migrations** allow us to run simple commands that keep the database schema consistent across different computers and environments.

Create the folders `api/models` and `api/migrations` for our models and migrations, respectively. Then add a `.sequelizerc` file for setting up Sequelize and a `api/config/database.js` file for defining how it connects to the database:

```
mkdir api/models
mkdir api/migrations
mkdir api/config

touch .sequelizerc
touch api/config/database.js
```

Update the `.sequelizerc` file with the following details, which tell Sequelize where to find the config, models, and migrations:

```js
// .sequelizerc

require("dotenv").config({ path: "./api/.env" });
const path = require("path");

module.exports = {
  config: path.resolve("api", "config/database.js"),
  "models-path": path.resolve("api", "models"),
  "migrations-path": path.resolve("api", "migrations"),
};
```

Update the config file `api/config/database.js` to include our environment variables for production and development:

```js
// api/config/database.js

module.exports = {
  production: {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
  development: {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
};
```

We are now ready to start using Sequelize.

### Use a migration to add a table to the database

We can use [Sequelize-CLI](https://sequelize.org/master/manual/migrations.html) to create and run our migration files. These will keep our databases consistent across different environments and different machines.

Install Sequelize-CLI into the project:

```
npm install sequelize-cli --save-dev
```

Now we can create a migration to generate a database table:

```
npx sequelize migration:create --name create-survey-response
```

This command created a file in the folder with a name like `api/database/migrations/20210101005858-create-survey-responses.js`.

Our `SurveyResponses` table will have the following columns:

|   id    | user_id | data | created_at | updated_at |
| :-----: | :-----: | :--: | :--------: | :--------: |
| integer | integer | JSON |    date    |    date    |

Update the migration file so that it will create the `SurveyResponses` table with these columns when it runs:

```js
// api/database/migrations/20210101005858-create-survey-responses.js

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SurveyResponses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("SurveyResponses", ["user_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("SurveyResponses");
  },
};
```

Now run the migration with the following command:

```
npx sequelize db:migrate
```

This created our `SurveyResponses` table in the `survey_dev` database with the columns and index we specified.

You can verify the table was created in `psql` by using the `\d` command:

```
psql survey_dev
\d

# =>
                   List of relations
 Schema |          Name          |   Type   |  Owner
--------+------------------------+----------+----------
 public | SequelizeMeta          | table    | postgres
 public | SurveyResponses        | table    | postgres
 public | SurveyResponses_id_seq | sequence | postgres
```

You can verify the table schema in `psql` with `\d "SurveyResponses"`

```
\d "SurveyResponses"

# =>
                                     Table "public.SurveyResponses"
   Column   |           Type           |                           Modifiers
------------+--------------------------+----------------------------------------------------------------
 id         | integer                  | not null default nextval('"SurveyResponses_id_seq"'::regclass)
 user_id    | integer                  | not null
 data       | json                     | default '{}'::json
 created_at | timestamp with time zone | not null
 updated_at | timestamp with time zone | not null
Indexes:
    "SurveyResponses_pkey" PRIMARY KEY, btree (id)
    "survey_responses_user_id" btree (user_id)
```

Note: if we wanted to undo our migration, we could run `npx sequelize db:migrate:undo`, and this would remove the table. If you undo this migration, be sure to re-run it again before continuing.

### Create a database model

We created the `SurveyResponses` table in our database, and now we want to interact with it.

To do this, we can create a model in Sequelize. Create a file called `api/models/survey-response.js`

```
touch api/models/survey-response.js
```

In this file, we can [define a basic Sequelize model](https://sequelize.org/master/manual/model-basics.html). This will let our server know how to interact with the `SurveyResponses` table. Add the following to the file:

```js
// api/models/survey-response.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "SurveyResponse",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "user_id",
      },
      data: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {}
  );
};
```

This will allow us to use helper methods like:

```js
// Create a survey response
SurveyResponse.create({
  userId: 5,
  data: {
    question1: "answer1",
    question2: "answer2",
  },
});

// Find all survey responses for a user
SurveyResponse.findAll({
  where: {
    userId: 5,
  },
});
```

For more methods, check out the [Sequelize docs](https://sequelize.org/master/manual/model-querying-basics.html#applying-where-clauses).

### Connect the backend to the database

Now that we have the database set up and a model in place, we can create a Sequelize instance for our server to use when interacting with the database.

Create a file `api/config/sequelize.js`:

```
touch api/config/sequelize.js
```

This file will do the following:

- Initialize a Sequelize instance, connected to the database with credentials from our `api/.env` file
- Import and register all of our models
- Export an object that our server can use to reference the Sequelize instance and its models

```js
// api/config/sequelize.js

const fs = require("fs");
const path = require("path");
const modelsDirectory = path.join(__dirname, "../models");
const { Sequelize } = require("sequelize");
const db = {};

// Initialize the Sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 5432,
  }
);

db.modelNames = [];

// Import and register all of the models in the /models directory
fs.readdirSync(modelsDirectory)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(modelsDirectory, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
    db.modelNames.push(model.name);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export a reference to the library (Sequelize) and the instance (sequelize)
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
```

### Add Sequelize to server.js

Now we're ready to use our database with our server. We can import the Sequelize instance:

```js
const { sequelize } = require("./api/config/sequelize.js");
```

and then use it in a route:

```js
app.get("/survey-responses", async (req, res) => {
  const surveyResponses = await sequelize.models.SurveyResponse.findAll();
  return res.send({ surveyResponses });
});
```

The resulting file looks like:

```js
// server.js

require("dotenv").config({ path: "./api/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Set up Sequelize
const { sequelize } = require("./api/config/sequelize.js");

app.all(["/survey-responses", "/results"], (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/survey-responses", async (req, res) => {
  return res.send("Coming soon");
});

// Return all survey responses
app.get("/survey-responses", async (req, res) => {
  const surveyResponses = await sequelize.models.SurveyResponse.findAll();
  return res.send({ surveyResponses });
});

app.get("/results", async (req, res) => {
  return res.send("Results");
});

app.get("/status", async (req, res) => {
  return res.send("ok");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
```

Now when we have the server running with:

```
nodemon server.js
```

And visit http://localhost:5000/survey-responses

We get the following response:

![Survey responses](https://res.cloudinary.com/component/image/upload/v1607109546/permanent/survey-api-1.png)

You can check the logs in the terminal to see that the server did the following lookup:

```
Executing (default): SELECT "id", "user_id" AS "userId", "data", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "SurveyResponses" AS "SurveyResponse";
```

We can manually create a record in `psql` with the following command:

```
psql survey_dev
INSERT INTO "SurveyResponses" (user_id, data, created_at, updated_at) VALUES (99, '{}', now(), now());
```

Now reloading the page will show that survey response:

![Survey responses](https://res.cloudinary.com/component/image/upload/v1607128554/permanent/survey-api-2.png)

---

### 6.

## Testing

At this point, it will be easier to develop our backend API using test-driven development, instead of doing guess-and-check in the browser over and over.

### Test-driven development (TDD)

In test-driven development (TDD), we write code that checks to see if our server is behaving the way we want it to behave. We intentionally write each test before writing the corresponding server code so that the test will fail initially -- this lets us know the test is "working". With the test in place, we then write the server code so that the test is satisfied. As more tests are written, this lets us continue moving quickly and changing our codebase without fear of accidentally breaking things.

### Add Mocha and Chai

[Mocha]() is a tool for running tests automatically, and [Chai]() is an assertion library that lets us write nice-looking statements like `expect(2+2).toEqual(4)`.

Install `mocha` and `chai` as dev dependencies, and then create a `/test` folder with 3 files: one for configuring Mocha `mocha.config.js`; one for configuring our test environment (`test.config.js`); and one for the tests themselves (`survey-responses.crud.spec.js`). Mocha will automatically run files that end with `.spec.js` as tests.

```
npm install mocha chai --save-dev

mkdir api/test
touch api/test/mocha.config.js
touch api/test/test.config.js
touch api/test/survey-responses.crud.spec.js
```

We can configure npm to run our tests with a custom command. Update the `"scripts"` section of `package.json` to add `test-backend` and `test-backend:watch` as commands:

```json
// package.json

"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "test-backend": "NODE_ENV=test mocha ./api/test --exit",
  "test-backend:watch": "NODE_ENV=test mocha --watch ./api/test ./api --file ./api/test/mocha.config.js"
},
```

Now in the terminal we can run the test suite once, or run it each time a file is changed:

| Command                      | Action                                             |
| ---------------------------- | -------------------------------------------------- |
| `npm run test-backend`       | Run the API test suite one time.                   |
| `npm run test-backend:watch` | Run the API test suite whenever a file is changed. |

### Configure Mocha

Mocha will start up the server each time we run the test suite, so we want to make sure to stop the server after the test suite runs. If we don't do this, we'll get an error saying that the server is already running.

Update the Mocha configuration file to stop the server after each run:

```js
// api/test/mocha.config.js

const server = require("../../server.js");

after(async () => {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
});
```

### Configure the test environment

In addition to restarting the server, it's also nice to reset the test database each time our test suite runs. This will allow for easier debugging, and will also ensure our tests are consistent and that they are testing the things we expect.

In the `test.config.js` file, we can define helper functions to reset a database table and to reset the whole database (all tables):

```js
// api/test/test.config.js

process.env.DATABASE_NAME = "survey_test";
const { sequelize, modelNames } = require("../config/sequelize.js");

const Test = {};

const resetTable = (modelName) => {
  if (!sequelize.models[modelName]) throw `modelName ${modelName} undefined`;
  return sequelize.models[modelName].sync({ force: true, logging: false });
};

Test.resetAllTables = async () => {
  let deferreds = [];
  modelNames.map((name) => {
    deferreds.push(resetTable(name));
  });
  return Promise.all(deferreds);
};

module.exports = Test;
```

### Write the first test

With our test environment set up, let's write a test for one of our endpoints.

The `POST /survey-responses` endpoint should create a record in the `SurveyResponses` table. So our test should do the following:

1. Set up (reset) the database
2. Send a `POST` request to `/survey-responses`
3. Assert that a `SurveyResponse` was created correctly

We already have all the tools in place for steps 1 & 3. For step 2, our test needs to make a POST request. [Axios](https://github.com/axios/axios) is a library for making API requests, so let's install that:

```
npm install axios --save
```

With `axios` installed, we can write our test:

```js
// api/test/survey-responses.crud.spec.js

const axios = require("axios");
const chai = require("chai");
const expect = chai.expect;
const Test = require("./test.config.js");
const { sequelize } = require("../config/sequelize.js");

const ax = axios.create({
  baseURL: "http://localhost:5000",
});

describe("SurveyResponses endpoints", () => {
  before(async () => {
    // Reset the database before running these tests
    await Test.resetAllTables();
    return Promise.resolve();
  });

  it("POST /survey-responses should create a survey response", async () => {
    const payload = {
      data: {
        favoriteColor: "green",
        technology: ["Vue", "Node.js"],
      },
    };

    // Perform a POST request to /survey-responses
    const { data, status } = await ax.post("/survey-responses", payload);

    // Check that the server returns a 200 status code
    expect(status).to.equal(200);

    // Check that the surveyResponse is returned
    expect(data.id).to.exist;
    expect(data.userId).to.equal(88);
    expect(data.data).to.deep.equal(payload.data);

    // Check that a surveyResponse was created in the database
    const surveyResponse = await sequelize.models.SurveyResponse.findOne({
      where: { id: data.id },
    });
    expect(surveyResponse).to.exist;
    expect(surveyResponse.userId).to.equal(88);
    expect(surveyResponse.data).to.deep.equal(payload.data);

    return Promise.resolve();
  });
});
```

We've intentionally written this test to fail, so it should fail when we run it with

```
npm run test-backend:watch
```

![Test suite fails](https://res.cloudinary.com/component/image/upload/v1607394182/permanent/survey-test-0.png)

The status is `200`, but right now our server does not create a `SurveyResponse`; it only returns `"Coming soon"`. This means the line that checks the response data:

```js
expect(data.id).to.exist;
```

will fail. This is good because it means our test is working. If we ever break something in the future, this test will catch it.

### Create a survey response

We can get our test passing by actually creating a `SurveyResponse` when the route is visited.

In `server.js`, update the `POST /survey-responses` route to create a survey response based on the data from the request body:

```js
// server.js

app.post("/survey-responses", async (req, res) => {
  try {
    const surveyResponse = await sequelize.models.SurveyResponse.create({
      userId: 88,
      data: req.body.data,
    });
    return res.send(surveyResponse);
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
});
```

With this change, the server will create a survey response whenever the `POST` route is visited, and for now it will use `userId: 88`.

Now our test should be passing:

```
npm run test-backend:watch
```

![POST test passing](https://res.cloudinary.com/component/image/upload/v1607395087/permanent/survey-test-1.png)

Note: visiting `http://localhost:5000/survey-responses` in the browser while running `nodemon server.js` will still show no survey responses. This is because the development server connects to the development database, not the test database.

### Read all survey responses

Similar to creating a survey response, we can implement a route to read all survey responses by first writing a failing test, and then writing the code to make it pass.

Here we are creating 2 `SurveyResponse` records manually in the `before` block. Then in our test for `GET /survey-responses`, we check that there are 3 survey responses (2 created in the `before` block, and 1 created by the `POST` request from the other test):

```js
// api/test/surveyResponses.crud.spec.js

const axios = require("axios");
const chai = require("chai");
const expect = chai.expect;
const Test = require("./test.config.js");
const { sequelize } = require("../config/sequelize.js");

const ax = axios.create({
  baseURL: "http://localhost:5000",
});

describe("SurveyResponses endpoints", () => {
  before(async () => {
    // Reset the database before running these tests
    await Test.resetAllTables();

    // Create 2 survey responses
    await sequelize.models.SurveyResponse.create({
      userId: 66,
      data: {
        favoriteColor: "red",
        technology: ["Angular", "TypeScript"],
      },
    });
    await sequelize.models.SurveyResponse.create({
      userId: 77,
      data: {
        favoriteColor: "blue",
        technology: ["React"],
      },
    });

    return Promise.resolve();
  });

  it("POST /survey-responses should create a survey response", async () => {
    // ...
  });

  it("GET /survey-responses should return all survey responses", async () => {
    // Perform a GET request to /survey-responses
    const { data, status } = await ax.get("/survey-responses");

    // Check that the server returns a 200 status code
    expect(status).to.equal(200);

    // Check that the surveyResponse array has 3 surveyResponses in it
    expect(data.surveyResponses).to.exist;
    expect(data.surveyResponses.length).to.equal(3);

    // Check that the surveyResponses have the correct structure
    const surveyResponse = data.surveyResponses[0];
    expect(surveyResponse.userId).to.exist;
    expect(surveyResponse.data).to.exist;
    return Promise.resolve();
  });
});
```

This test actually passes because we already wrote the following in `server.js`:

```js
// server.js

app.get("/survey-responses", async (req, res) => {
  const surveyResponses = await sequelize.models.SurveyResponse.findAll();
  return res.send({ surveyResponses });
});
```

In an instance like this, where your test is passing because the application code already exists, it's a good idea to comment out the application code to verify that the test will fail without it. Try changing the `GET` route so that it will fail:

```js
// server.js

app.get("/survey-responses", async (req, res) => {
  // const surveyResponses = await sequelize.models.SurveyResponse.findAll();
  // return res.send({ surveyResponses });
  return res.send("Coming soon");
});
```

Once you've verified that the test will fail, you can restore the application code so that the test passes.

---

### 7.

## Save a survey response from the frontend

Our backend is set up to receive and save a survey response when a `POST` request is sent to `/survey-responses`, so we can make our frontend do that when a survey is submitted.

We'll use [Axios](https://github.com/axios/axios) on the frontend to make API requests too.

Import `axios` at the beginning of `src/App.js`, and then update the `survey.onComplete` method to send a `POST` request instead of `console.log`. The beginning of the file should now look like this:

```js
// src/App.js

import axios from "axios";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import * as SurveyJS from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

SurveyJS.StylesManager.applyTheme("modern");
const survey = new SurveyJS.Model(questions);
// Update survey.onComplete
survey.onComplete.add((result) => {
  axios.post("http://localhost:5000/survey-responses", {
    data: result.data,
  });
});

// ...
```

Now with the frontend server running in one terminal window:

```
npm start
```

And the backend server running in another terminal window:

```
nodemon server.js
```

When we visit http://localhost:3000/survey and submit a survey response, it is saved to the database on the backend. Give it a try.

You can view the contents of the database with `psql` if desired:

```
psql survey_dev
SELECT * FROM "SurveyResponses";

# =>
 id | user_id |                                data                                |         created_at         |         updated_at
----+---------+--------------------------------------------------------------------+----------------------------+----------------------------
  1 |      88 | {"frameworkUsing":"Yes","framework":["React"],"about":"It works!"} | 2020-12-08 12:59:38.933-08 | 2020-12-08 12:59:38.933-08
(1 row)

\q
```

---

### 8.

## Signup, login, and logout

Currently, anyone can submit a survey, and anyone can read all the surveys that have been submitted.

We want each user to only submit one survey, and we want to only allow users to see their own survey response. To accomplish both of these goals, we need to authenticate our users.

### What does it mean to be "logged in"?

When a user "logs in" to a website, their browser is issued an access token that it can send to the server in subsequent requests. The server then requires this token to access certain routes. To "log out", the access token is invalidated by the server, and the user's browser deletes the token.

In this application, we'll use a token standard called JSON Web Tokens (JWTs) that allows one server to issue access tokens, and any other server to verify them without contacting the original server. This standard has become a go-to technology for web applications in recent years due to their flexibility and security.

### Add Userfront

Userfront is an authentication and access control service that makes it simple to add signup, login, and logout, as well as more advanced auth features. It will issue access tokens when our users sign up or log in, and it will invalidate and remove those tokens when our users log out. It has a generous free tier and will save us from writing and maintaining a lot of complex auth code.

Create an account at https://userfront.com, then install the `@userfront/react` package with:

```
npm install @userfront/react --save
```

Visit the `Toolkit` section of your Userfront dashboard for installation instructions for the Signup and Login Forms. For React, setting up the Signup Form looks like:

```js
// Sample
import Userfront from "@userfront/react";
Userfront.init("5xbpy4nz");
const SignupForm = Userfront.build({
  toolId: "mnbrak",
});
```

To incorporate these forms into our application, we need to:

- Add the `@userfront/react` package
- Initialize the Signup and Login Forms
- Add the `<SignupForm>` and `<LoginForm>` components to the proper views

Update the `src/App.js` file to add the Signup and Login Forms:

```js
// src/App.js

import axios from "axios";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import * as SurveyJS from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

// Add the @userfront/react package
import Userfront from "@userfront/react";

// Initialize the forms
Userfront.init("5xbpy4nz");
const SignupForm = Userfront.build({
  toolId: "mnbrak",
});
const LoginForm = Userfront.build({
  toolId: "nadrrd",
});

// ...

// Add the <SignupForm/> and <LoginForm/> components to the view
function Signup() {
  return (
    <div className="container py-5">
      <SignupForm />
    </div>
  );
}
function Login() {
  return (
    <div className="container py-5">
      <LoginForm />
    </div>
  );
}
```

With our frontend server running, visiting http://localhost:3000/signup will show our signup form:

![Userfront signup form](https://res.cloudinary.com/component/image/upload/v1607464088/permanent/survey-signup-0.png)

Try signing up a user with your form.

When you sign up, your user record will appear in your Userfront dashboard (under "Users" when in "Test mode"):

![Userfront users](https://res.cloudinary.com/component/image/upload/v1607466656/permanent/survey-userfront-1.png)

However, the page is redirected to `/dashboard`, which is not a route we have on our website.

### Change the redirection route to /survey

Instead of `/dashboard`, we want our users to be redirected to `/survey` when they sign up or log in.

Visit your Userfront dashboard `Settings` page and set the "Login path" to be `/survey`. That way when users sign up or log in, they will be redirected to the survey page.

![Userfront settings](https://res.cloudinary.com/component/image/upload/v1607466213/permanent/survey-userfront-0.png)

### Add a logout button

Right now, our page shows the `Login` and `Signup` links in the top corner all the time.

![Signup Login buttons](https://res.cloudinary.com/component/image/upload/v1607485269/permanent/survey-navbar-0.png)

We want to show a `Logout` button if the user is logged in.

![Logout button](https://res.cloudinary.com/component/image/upload/v1607485269/permanent/survey-navbar-1.png)

To do this, we can use Userfront's built in methods. When the user is logged in, they will have an access token, and calling `User.accessToken()` will return a value. Thus, we can create an `if/else` statement to show different buttons if the user is logged in vs logged out.

Update the `<LoginLogout/>` component with the following code:

```js
// src/App.js

function LoginLogout() {
  // If logged in
  if (Userfront.accessToken()) {
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
    // If not logged in
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
```

Note that the `Logout` button has `onClick={Userfront.logout}`. This will log out the user and then redirect the browser when the button is clicked.

Try logging in and logging out with one of your test users.

---

### 9.

## Send a JWT with the request

We'll send the access token when we submit a survey response, which will allow the API to know what user is making the request. We'll use a bearer token in the request header, which will look like:

`Authorization: Bearer eyJhbGciOiJ...`

### Set up the backend

We need to set the backend to accept the `Authorization` header.

Update the `Access-Control-Allow-Headers` setting in `server.js` to allow the `Authorization` header.

```js
// server.js
res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
```

### Send the token with request

We need to read the access token from the cookies, then attach it to our request.

`npm install --save-dev js-cookie`

```js
// App.js
// Import the Cookie library
import Cookie from "js-cookie";

// Update our post method to include the header
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
```

---

### 10.

## Verify the JWT access token

Now that the client sends an access JWT, we need to verify and decode it on the backend.

`npm install --save jsonwebtoken`

`npm run test-backend:watch`

In order to write tests, we need to create JWTs, which we will sign with an RSA key. For that, we need a key pair: private key used for signing the JWT and a public key used to verify it.

```
-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAJ8PxdNGVwO0Wl4irLuYyrYvNCHMO2ZcTb8cVka/B0xrWTAX/G+7
l1fA7aEWX7/OJsAXkD4aEp3e/d3rNFH/KacCAwEAAQJBAJy/B1zPeVpONauEkiIA
TOtCEyanQ3X4yijlvOPUxlV3+awUq+f8/spS8lCeBtGLYPXdfaib1CvcDpvuZ8nV
mmECIQDWOxh1/d3YkKWUPHML0k88tdSHYKZNrOL2NBL/zWb5FwIhAL4TA+zWYQSv
BfUeyvoXfxIeNtwEZkTnqRdxmdCKK43xAiEAi4fv9aHEpXIItlTs5a0z+KnBY+86
Qesx5AOkwEFLKT8CICbX2fh/gwoi/nOuXEqpnJVGSW3DFGdGdF7PH2Dnq6jxAiBv
x/s4QxfQhYvhPMXisV1PYQ0O2VMMBe4PO7Ioi4xMqQ==
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ8PxdNGVwO0Wl4irLuYyrYvNCHMO2Zc
Tb8cVka/B0xrWTAX/G+7l1fA7aEWX7/OJsAXkD4aEp3e/d3rNFH/KacCAwEAAQ==
-----END PUBLIC KEY-----
```

```js
// api/test/test.config.js
process.env.RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ8PxdNGVwO0Wl4irLuYyrYvNCHMO2Zc
Tb8cVka/B0xrWTAX/G+7l1fA7aEWX7/OJsAXkD4aEp3e/d3rNFH/KacCAwEAAQ==
-----END PUBLIC KEY-----`;

Test.rsaPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAJ8PxdNGVwO0Wl4irLuYyrYvNCHMO2ZcTb8cVka/B0xrWTAX/G+7
l1fA7aEWX7/OJsAXkD4aEp3e/d3rNFH/KacCAwEAAQJBAJy/B1zPeVpONauEkiIA
TOtCEyanQ3X4yijlvOPUxlV3+awUq+f8/spS8lCeBtGLYPXdfaib1CvcDpvuZ8nV
mmECIQDWOxh1/d3YkKWUPHML0k88tdSHYKZNrOL2NBL/zWb5FwIhAL4TA+zWYQSv
BfUeyvoXfxIeNtwEZkTnqRdxmdCKK43xAiEAi4fv9aHEpXIItlTs5a0z+KnBY+86
Qesx5AOkwEFLKT8CICbX2fh/gwoi/nOuXEqpnJVGSW3DFGdGdF7PH2Dnq6jxAiBv
x/s4QxfQhYvhPMXisV1PYQ0O2VMMBe4PO7Ioi4xMqQ==
-----END RSA PRIVATE KEY-----`;
```

Now we can update our test for `POST /survey-responses`.

We create a `token`, which is a signed JWT, and then include it in the test request's header as `authorization: Bearer ${token}`.

Then we assert that the `userId` of the created survey response should equal `88`, which is the `userId` from the token.

```js
// api/test/surveyResponses.crud.spec.js
it("POST /survey-responses should create a survey response", async () => {
  // Create a JWT and sign it with the RSA private key
  const token = jwt.sign(
    {
      userId: 88,
    },
    Test.rsaPrivateKey,
    { algorithm: "RS256" }
  );

  const payload = {
    uri: `${uri}/survey-responses`,
    body: {
      data: {
        favoriteColor: "green",
        technology: ["Vue", "Node.js"],
      },
    },

    // Perform a POST request to /survey-responses
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const { res, body } = await new Promise((resolve) => {
    req.post(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 200 status code
  expect(res.statusCode).to.equal(200);

  // Check that the surveyResponse is returned
  expect(body.id).to.exist;
  expect(body.userId).to.equal(88);
  expect(body.data).to.deep.equal(payload.body.data);

  // Check that a surveyResponse was created in the database
  const surveyResponse = await sequelize.models.SurveyResponse.findOne({
    where: { id: body.id },
  });
  expect(surveyResponse).to.exist;
  expect(surveyResponse.userId).to.equal(88);
  expect(surveyResponse.data).to.deep.equal(payload.body.data);

  return Promise.resolve();
});
```

This test should be failing now, because the model isn't saving the `userId` from the token yet:

![Failing test](https://res.cloudinary.com/component/image/upload/v1605899038/permanent/failing-test-1.png)

### Save the token's userId with the survey response

We can get the test passing by updating the route to verify the JWT and include it when saving the survey response:

```js
// server.js
const jwt = require("jsonwebtoken");
const rsaPublicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ8PxdNGVwO0Wl4irLuYyrYvNCHMO2Zc
Tb8cVka/B0xrWTAX/G+7l1fA7aEWX7/OJsAXkD4aEp3e/d3rNFH/KacCAwEAAQ==
-----END PUBLIC KEY-----`;

...

app.post("/survey-responses", async (req, res) => {
  // Get the JWT from the header named "authorization"
  const token = req.headers.authorization.replace("Bearer ", "");

  // Verify the token using the RSA public key
  const verified = jwt.verify(token, rsaPublicKey, { algorithm: "RS256" });

  // Use the userId from the token when creating the database record
  const surveyResponse = await sequelize.models.SurveyResponse.create({
    userId: verified.userId,
    data: req.body.data,
  });
  return res.send(surveyResponse);
});
```

### Handle cases where the JWT is incorrect or missing

In order to build a secure system, we want to make sure that we don't permit access to unauthorized users. We can write tests to assert the following:

- Should return 401 error when JWT is expired
- Should return 401 error when JWT is signed with a different key
- Should return 401 error when authorization header is missing

#### Testing expired JWT

```js
// api/test/surveyResponses.crud.spec.js
it("POST /survey-responses should return 401 if JWT is expired", async () => {
  // Create an expired JWT signed with the RSA private key
  const token = jwt.sign(
    {
      userId: 88,
    },
    Test.rsaPrivateKey,
    {
      algorithm: "RS256",
      expiresIn: -1,
    }
  );

  const payload = {
    uri: `${uri}/survey-responses`,
    body: {
      data: {
        someData: "Here",
      },
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  // Perform a POST request to /survey-responses
  const { res, body } = await new Promise((resolve) => {
    req.post(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 401 status code
  expect(res.statusCode).to.equal(401);
  expect(body).to.equal("Unauthorized");
  return Promise.resolve();
});
```

#### Testing invalid JWT (signed by a different private key)

```js
// api/test/surveyResponses.crud.spec.js
it("POST /survey-responses should return 401 if JWT is signed with wrong key", async () => {
  // Create a JWT signed with a different RSA private key
  const token = jwt.sign(
    {
      userId: 88,
    },
    `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBALHlFNfHdfCq4stiIZyTmkawfJXgGSXHHy9L2YmcDYoeoL/ljIXn
PX4/d4AgABq6NTKJEoIm661Ay1VYjErpY4cCAwEAAQJBAJ2XS6yP1So7qCf2KcJ0
e6INrIB1ArIVwMl8Txz5soDcfe8h3X6w7/GshWG//DcnTXsosMnYPbkhGord1nQP
85kCIQDyW5SHAY0mSyYUjZpFrq/dEyDEGiq26DpT8C1w3DlBwwIhALvolEEU+dMt
NMF7Bj8Y/8oi1BP/AlCs62TM9gLt8FbtAiEA5FW2BNBIXMi2cuzKaVZgqGeqGjgR
AEyhD44cMdW6OCMCIF0n3metaHTi0mahAOXDFPw27ADFyXYJY+FjIwssvpu5AiAy
j54LxJp8HjQXvbs/Tr7OSu3CEK7pc9uTZ6RkyD1oGw==
-----END RSA PRIVATE KEY-----`,
    {
      algorithm: "RS256",
    }
  );

  const payload = {
    uri: `${uri}/survey-responses`,
    body: {
      data: {
        someData: "Here",
      },
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  // Perform a POST request to /survey-responses
  const { res, body } = await new Promise((resolve) => {
    req.post(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 401 status code
  expect(res.statusCode).to.equal(401);
  expect(body).to.equal("Unauthorized");
  return Promise.resolve();
});
```

#### Testing with a missing authorization header

```js
// api/test/surveyResponses.crud.spec.js
it("should return 401 if the authorization header is missing", async () => {
  // Don't include the authorization header
  const payload = {
    uri: `${uri}/survey-responses`,
    body: {
      data: {
        someData: "Here",
      },
    },
  };

  // Perform a POST request to /survey-responses
  const { res, body } = await new Promise((resolve) => {
    req.post(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 401 status code
  expect(res.statusCode).to.equal(401);
  expect(body).to.equal("Unauthorized");
  return Promise.resolve();
});
```

### Getting the tests to pass

We can get these tests to pass by returning an `Unauthorized` error if the process fails:

```js
// server.js
app.post("/survey-responses", async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verified = jwt.verify(token, rsaPublicKey, { algorithm: "RS256" });
    const surveyResponse = await sequelize.models.SurveyResponse.create({
      userId: verified.userId,
      data: req.body.data,
    });
    return res.send(surveyResponse);
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
});
```

### Add RSA public key for development mode

Our tests are working, but we're using a dummy RSA public key. That won't work for development or production, so we need to add the "test mode" key from Userfront to our .env file.

Find the RSA public key in the Userfront dashboard

```
-----BEGIN RSA PUBLIC KEY-----
MIIBigKCAYEAymqnnSQInFgmVhsSLyZWCKCObqCcZQQHrOdE/aqVwvaSyIbbpc01
+/lucPrdsKUAQCo0C93GsoDRXUYOEJ4Gl2z0H3SpOtbmSDTp6mWKU4NZvxKzG/Y2
VXMzgg510GOAvfXQABpKyvbjriXPJ9SOCxeAqlu3nHnKY9lWbmduBAF3AOa1Irhu
i1NigCdkl0anHGYuCpufpkk8PnyrvDWe9GRJLBVd61ImeLl9EFysomF/H0wIgOvX
o+WLQNx/61m4JTODQDbf8R9uWr8eqAFfgt26BU4p1lUQPg6rAc6+9Ry3K0jAJB0b
44pcEd6U5a7rjerzu1IMHIQXJXRDicJE1wYIe8iu7xCAyTvG1DOKFIuT/1Ny8Au/
ggbpBU+tnnH4cF+9DbOT3wi94sj85JsEN8V3VOtFPHeHlZSo3nOi5QqaJiSjHoCI
O35Ql0ouy7Qe8i8YWibbrfm7lrO7TlYF89tiPhQc/TgYsD+iqMwDsgffgHLClZHQ
ln5rVhbqZlcZAgMBAAE=
-----END RSA PUBLIC KEY-----
```

In order to add a multi-line RSA key to the .env file, we need to put the value in double quotes `" "` and replace the newlines with `/n`.

```
# api/.env
DATABASE_NAME=survey_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=null
DATABASE_HOST=localhost
DATABASE_DIALECT=postgres
DATABASE_PORT=5431
RSA_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----\nMIIBigKCAYEAymqnnSQInFgmVhsSLyZWCKCObqCcZQQHrOdE/aqVwvaSyIbbpc01\n+/lucPrdsKUAQCo0C93GsoDRXUYOEJ4Gl2z0H3SpOtbmSDTp6mWKU4NZvxKzG/Y2\nVXMzgg510GOAvfXQABpKyvbjriXPJ9SOCxeAqlu3nHnKY9lWbmduBAF3AOa1Irhu\ni1NigCdkl0anHGYuCpufpkk8PnyrvDWe9GRJLBVd61ImeLl9EFysomF/H0wIgOvX\no+WLQNx/61m4JTODQDbf8R9uWr8eqAFfgt26BU4p1lUQPg6rAc6+9Ry3K0jAJB0b\n44pcEd6U5a7rjerzu1IMHIQXJXRDicJE1wYIe8iu7xCAyTvG1DOKFIuT/1Ny8Au/\nggbpBU+tnnH4cF+9DbOT3wi94sj85JsEN8V3VOtFPHeHlZSo3nOi5QqaJiSjHoCI\nO35Ql0ouy7Qe8i8YWibbrfm7lrO7TlYF89tiPhQc/TgYsD+iqMwDsgffgHLClZHQ\nln5rVhbqZlcZAgMBAAE=\n-----END RSA PUBLIC KEY-----"
```

### Try the development site

```
nodemon server.js
```

Now submitting our survey when logged in should work.

---

### 11.

## Add a protected route

Now instead of the `GET /survey-responses` route returning _all_ survey responses, we want it to only return the responses for the user that requests them.

We will again use the access token to determine the `userId`, and then use that to look up the survey responses to return.

### Tests

- Should return only the correct survey response(s)
- Should return 401 error when JWT is signed with a different key
- Should return 401 error when authorization header is missing

#### Testing a GET request

We can update our existing test for the GET route to include a valid JWT, and then assert that the correct survey response is returned.

```js
// api/test/surveyResponses.crud.spec.js
it("GET /survey-responses should return survey responses", async () => {
  // Create a JWT signed with the RSA private key
  const token = jwt.sign(
    {
      userId: 3,
    },
    Test.rsaPrivateKey,
    { algorithm: "RS256" }
  );

  // Perform a GET request to /survey-responses
  const payload = {
    uri: `${uri}/survey-responses`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const { res, body } = await new Promise((resolve) => {
    req.get(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 200 status code
  expect(res.statusCode).to.equal(200);

  // Check that the body has a surveyResponse array
  expect(body.surveyResponses).to.exist;

  // Check that the surveyResponse array has 1 surveyResponses in it
  expect(body.surveyResponses.length).to.equal(1);

  // Check that the surveyResponses have the correct structure
  const surveyResponse = body.surveyResponses[0];
  expect(surveyResponse.userId).to.equal(3);
  expect(surveyResponse.data).to.exist;
  return Promise.resolve();
});
```

This test should fail, and we can get it passing by updating our code to read the incoming `Authorization` header, verifying the JWT, and then using the `userId` value to look up the survey responses:

```js
// server.js
app.get("/survey-responses", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const verified = jwt.verify(token, process.env.RSA_PUBLIC_KEY, {
    algorithm: "RS256",
  });
  const surveyResponses = await sequelize.models.SurveyResponse.findAll({
    where: {
      userId: verified.userId,
    },
  });
  return res.send({ surveyResponses });
});
```

#### Testing an invalid JWT

Similar to the POST test, we can send a JWT with a valid `userId` but an invalid signature, and we should recieve a 401 Unauthorized error.

```js
// api/test/surveyResponses.crud.spec.js
it("GET /survey-responses should return 401 if JWT is signed with wrong key", async () => {
  // Create a JWT signed with a different RSA private key
  const token = jwt.sign(
    {
      userId: 3,
    },
    `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBALHlFNfHdfCq4stiIZyTmkawfJXgGSXHHy9L2YmcDYoeoL/ljIXn
PX4/d4AgABq6NTKJEoIm661Ay1VYjErpY4cCAwEAAQJBAJ2XS6yP1So7qCf2KcJ0
e6INrIB1ArIVwMl8Txz5soDcfe8h3X6w7/GshWG//DcnTXsosMnYPbkhGord1nQP
85kCIQDyW5SHAY0mSyYUjZpFrq/dEyDEGiq26DpT8C1w3DlBwwIhALvolEEU+dMt
NMF7Bj8Y/8oi1BP/AlCs62TM9gLt8FbtAiEA5FW2BNBIXMi2cuzKaVZgqGeqGjgR
AEyhD44cMdW6OCMCIF0n3metaHTi0mahAOXDFPw27ADFyXYJY+FjIwssvpu5AiAy
j54LxJp8HjQXvbs/Tr7OSu3CEK7pc9uTZ6RkyD1oGw==
-----END RSA PRIVATE KEY-----`,
    {
      algorithm: "RS256",
    }
  );

  const payload = {
    uri: `${uri}/survey-responses`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  // Perform a POST request to /survey-responses
  const { res, body } = await new Promise((resolve) => {
    req.get(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 401 status code
  expect(res.statusCode).to.equal(401);
  expect(body).to.equal("Unauthorized");
  return Promise.resolve();
});
```

To get this test passing, we can update our route to add a `try/catch` block to the GET route (like we did for the POST route):

```js
// server.js
app.get("/survey-responses", async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verified = jwt.verify(token, process.env.RSA_PUBLIC_KEY, {
      algorithm: "RS256",
    });
    const surveyResponses = await sequelize.models.SurveyResponse.findAll({
      where: {
        userId: verified.userId,
      },
    });
    return res.send({ surveyResponses });
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
});
```

#### Testing with no authorization header

```js
it("GET /survey-responses should return 401 if no authorization header is present", async () => {
  const payload = {
    uri: `${uri}/survey-responses`,
  };

  // Perform a POST request to /survey-responses
  const { res, body } = await new Promise((resolve) => {
    req.get(payload, (err, res, body) => resolve({ res, body }));
  });

  // Check that the server returns a 401 status code
  expect(res.statusCode).to.equal(401);
  expect(body).to.equal("Unauthorized");
  return Promise.resolve();
});
```

This test will already pass. It's a good practice to comment out the `try/catch` block we just added to `server.js` to check that this test will fail without the block. If it does fail without that block, then we know the test is working correctly.

### Displaying response in the browser

We have an endpoint to return a user's responses. Now we want our app to show these responses instead of the survey if the user has completed the survey.

```js
function Survey() {
  const [responses, setResponses] = useState([]);
  const listItems = responses.map((response) => (
    <li>{JSON.stringify(response)}</li>
  ));
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        "http://localhost:5000/survey-responses",
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("access.5xbpy4nz")}`,
          },
        }
      );
      setResponses(data.surveyResponses);
    })();
  });
  if (responses.length > 0) {
    return (
      <div>
        <ul>{listItems}</ul>
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
```

---

### 12.

## Notes on deployment
