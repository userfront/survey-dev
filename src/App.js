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
survey.showCompletedPage = false;

survey.onComplete.add(async ({ data }) => {
  try {
    await axios.post(
      `${apiRoot}/survey-responses`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${Userfront.accessToken()}`,
        },
      }
    );
    return (window.location.href = "/results?thankyou=true");
  } catch (error) {}
});

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand bg-white py-4 shadow">
          <div className="container">
            <NavLink
              exact
              to="/"
              className="btn btn-sm btn-outline-primary mr-4"
            >
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
                <div
                  className="mx-auto mb-4"
                  style={{ textAlign: "left", maxWidth: "300px" }}
                >
                  Take the 2020 survey to share and learn
                  <br /> about pay trends in web contract work.
                  <br />
                  <br /> We will notify you by email when new results are
                  posted.
                </div>
                <Signup />
              </div>
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/privacy">
              <Privacy />
            </Route>
            <Route path="/terms">
              <Terms />
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
                  <p className="mb-1">Share and learn about:</p>
                  <ul>
                    <li>Pay trends by technology</li>
                    <li>Pay trends by region</li>
                    <li>Good and bad clients</li>
                    <li>Best ways to source work</li>
                  </ul>
                  <p>Results shared with those who take the survey.</p>
                  <div className="mt-4 mb-2">
                    <Link to="/survey" className="btn btn-lg btn-primary px-4">
                      Take the survey →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-4 d-flex">
        <a href="/about" className="mr-4">
          About
        </a>
        <a href="/privacy" className="mr-4">
          Privacy
        </a>
        <a href="/terms">Terms</a>
        <span className="ml-auto d-none d-sm-inline">
          Made with {"<3"} in California
        </span>
        <span className="ml-auto d-inline d-sm-none">Made in CA</span>
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
  if (!isLoggedIn()) return <Redirect to={{ pathname: "/signup" }} />;
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
          <NavLink to="/signup" className="nav-link">
            Signup
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/login" className="nav-link">
            Login
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
  if (!isLoggedIn()) return <Redirect to={{ pathname: "/signup" }} />;
  return (
    <div className="container py-5">
      <h3>Thank you for being a part of Survey.dev!</h3>
      <p>We will email you when the survey results are ready.</p>

      <h3 className="mt-5">
        Freelancers & agencies have to compete against larger corporations.
      </h3>
      <p>
        Together, we can learn & share to make better decisions and compete
        better.
      </p>
      <p>
        If you know other web developers who do contract work, please take a
        moment to share Survey.dev with them.
      </p>
      <div>
        <a
          href="mailto:?subject=Survey.dev&body=I%20took%20the%202020%20survey%20of%20web%20development%20freelancers%20%26%20agencies%3A%0D%0A%0D%0Ahttps%3A%2F%2Fsurvey.dev"
          className="mr-2"
          target="_blank"
          rel="noreferrer"
        >
          Email
        </a>{" "}
        |{" "}
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fsurvey.dev"
          className="mx-2"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>{" "}
        |{" "}
        <a
          href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fsurvey.dev&text=I%20took%20the%202020%20Survey%20of%20Web%20Development%20Freelancers%20%26%20Agencies"
          className="mx-2"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
        |{" "}
        <a
          href="https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fsurvey.dev&t=2020%20Survey%20of%20Web%20Development%20Freelancers%20%26%20Agencies"
          className="mx-2"
          target="_blank"
          rel="noreferrer"
        >
          Hacker News
        </a>
      </div>

      <h3 className="mt-5">Tutorial</h3>
      <p>There is also an in-depth tutorial for how to build this website.</p>
      <p>
        It is intended to be a complete guide for developing a{" "}
        <strong>secure, database-backed, production-ready application</strong>{" "}
        that you can use in professional work.
      </p>
      <p>
        <a
          href="https://github.com/tyrw/survey-dev-tutorial"
          target="_blank"
          rel="noreferrer"
        >
          See the tutorial →
        </a>
      </p>
    </div>
  );
}

function About() {
  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">About Survey.dev</h2>
      <h5 className="mb-3">
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

      <h5 className="mt-5 mb-3">Tutorial</h5>
      <p>There is also a tutorial for how to build the site itself.</p>
      <p>
        It is intended to be a complete guide for developing a{" "}
        <strong>secure, database-backed, production-ready application</strong>{" "}
        that you could use in professional work.
      </p>
      <p>
        <a
          href="https://github.com/tyrw/survey-dev-tutorial"
          target="_blank"
          rel="noreferrer"
        >
          See the tutorial →
        </a>
      </p>
      <h5 className="mt-5 mb-3">Contributing</h5>
      <p>
        You can contribute to this project by opening an issue on{" "}
        <a
          href="https://github.com/tyrw/survey-dev"
          target="_blank"
          rel="noreferrer"
        >
          /survey-dev
        </a>{" "}
        or{" "}
        <a
          href="https://github.com/tyrw/survey-dev-tutorial"
          target="_blank"
          rel="noreferrer"
        >
          /survey-dev-tutorial
        </a>
        . This project was started by{" "}
        <a href="https://github.com/tyrw" target="_blank" rel="noreferrer">
          @tyrw
        </a>{" "}
        -- feel free to say hi!
      </p>
    </div>
  );
}

function Privacy() {
  return (
    <section className="container py-5">
      <h1 className="py-3">Survey.dev Privacy Policy</h1>

      <p>
        Thanks for visiting Survey.dev! This Privacy Policy describes what
        information we collect and how it's used and shared.
      </p>
      <p>
        Note that any capitalized terms not defined in this Privacy Policy have
        the meanings set forth in our <a href="/terms">Terms of Service</a>. If
        you don’t agree with the terms of this Privacy Policy, you may not
        access or use the Services. If you have any comments or questions about
        this Privacy Policy, feel free to contact us at{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a>.
      </p>

      <h4>1. Privacy Principles</h4>
      <p>
        We believe in transparency about how we handle your information and we
        believe in the following principles: first, we don’t sell your personal
        information to anyone. It’s just not the type of business we’re in.
        Second, we don’t ask for your personal information unless we need it to
        provide or improve the Services for you. Third, we don’t share your
        personal information unless you’ve specifically allowed it, or for the
        very limited purposes described below. Finally, we appreciate that when
        you use our Services, you trust us with your information, and we take
        that responsibility very seriously. This Privacy Policy holds us
        accountable for protecting your rights and your privacy.
      </p>

      <h4>2. Consent</h4>
      <p>
        By submitting information through our Service, you agree to the terms of
        this Privacy Policy (or, if you are acting on behalf of your employer or
        other organization, you agree on behalf of such organization) and you
        expressly consent to the processing of such information according to
        this Privacy Policy.
      </p>
      <p>
        In particular, you understand that information may be processed in the
        country where it was collected as well as other countries (including the
        United States) where laws regarding processing of information may be
        less stringent than the laws in your country, and you consent to such
        processing.
      </p>
      <p>
        If you are submitting information pertaining to third parties for
        processing through our Service, you represent and warrant that you have
        adequately disclosed to such third parties that information about them
        would be processed by a service provider, and that these third parties
        did not object to the use of such services.
      </p>

      <h4>3. Collection</h4>
      <p>
        When you use the Services, we collect the following information, and use
        it only as described below:
      </p>
      <p>
        <strong>3.1.</strong> Account Information. This may include your name,
        address, email address and phone number. We use this information in the
        ways you would expect, such as to set up your Account or contact you.
      </p>
      <p>
        <strong>3.2.</strong> Third Party Account Information. If you use Third
        Party Services, such as social media or photo-sharing services, you may
        provide us with your Third Party Services account information, such as
        your username (note that we don’t store any passwords you use to access
        Third Party Services). We transmit, and may store, such account
        information, only as needed to provide the Services, and only in
        accordance with the terms and policies of the Third Party Services.
      </p>
      <p>
        <strong>3.4.</strong> Communications With Us. When you send us emails or
        other communications, such as customer support inquiries, we maintain
        those communications and their contents so that we can resolve your
        inquiries or otherwise assist you.
      </p>
      <p>
        <strong>3.5.</strong> Public Comments On The Services. We maintain any
        comments, contributions to discussions or messages submitted to users of
        the Services, in order to provide the Services.
      </p>
      <p>
        <strong>3.6.</strong> Files You Provide Us. When you use the Services,
        we store, process and transmit your User Content (such as your photos)
        and information related to your User Content. We process and store such
        files and information in order to provide the Services, as described in
        our <a href="/terms">Terms of Service</a>.
      </p>
      <p>
        <strong>3.7.</strong> Usage Information. This includes information about
        your activity on and interaction with the Services, such as your IP
        address, your device or browser type, the web page you visited before
        coming to our sites and identifiers associated with your devices. This
        information enables us to analyze how the Services are being accessed
        and used, and to track performance of the Services.
      </p>
      <p>
        <strong>3.8.</strong> Location Information. Your devices (depending on
        your settings) may transmit location information to the Services. We use
        this information to customize, improve and protect the Services. For
        example, we may use your location information to determine local
        language preferences.
      </p>
      <p>
        <strong>3.9.</strong> Cookies And Other Technologies. We use these
        technologies to do things such as remember your preferences, keep you
        safe and improve and promote the Services.
      </p>
      <p>
        Cookies are small pieces of text sent to your browser when you visit a
        site. They serve a variety of functions, like enabling us to remember
        certain information you provide to us as you navigate between pages on
        the Services. We use cookies for the following purposes:
      </p>
      <ul>
        <li>
          Authentication, Personalization And Security. Cookies help us verify
          your Account and device and determine when you’re logged in, so we can
          make it easier for you to access the Services and provide the
          appropriate experiences and features. We also use cookies to help
          prevent fraudulent use of login credentials.
        </li>
        <li>
          Performance And Analytics. Cookies help us analyze how the Services
          are being accessed and used, and enable us to track performance of the
          Services. For example, we use cookies to determine if you viewed a
          page or opened an email. This helps us provide you with information
          that you find interesting. We also use cookies to provide insights
          regarding Your Sites’ performance.
        </li>
        <li>
          Third Parties. Third Party Services may use cookies to help you sign
          into their services from our Services. We also may use third party
          cookies, such as Google Analytics, to assist with analyzing
          performance. Any third party cookie usage is governed by the privacy
          policy of the third party placing the cookie.
        </li>
        <li>
          Opting Out. You can set your browser to not accept cookies, but this
          may limit your ability to use the Services.
        </li>
      </ul>

      <h4>4. Sharing</h4>
      <p>
        When you use the Services, we may share your information only as
        described below:
      </p>
      <p>
        <strong>4.1.</strong> Third Parties You Authorize. You can give third
        parties access to your and your End Users’ information on the Services.
        Just remember that such third party’s use of this information will be
        governed by the terms and privacy policies of the third party.
      </p>
      <p>
        <strong>4.2.</strong> Following The Law. We may disclose your
        information to third parties if we determine that such disclosure is
        reasonably necessary to comply with the law, protect our rights or
        prevent fraud or abuse of Survey.dev or our users. When we receive law
        enforcement or national security requests for information, we strongly
        believe in privacy and transparency. We scrutinize such requests
        carefully and challenge vague, overbroad or otherwise unlawful requests.
        And when legally permitted, we provide our users with notice that their
        information is being requested. This notice is provided so that you have
        the opportunity to challenge such requests.
      </p>
      <p>
        <strong>4.3.</strong> Others Working For Survey.dev. We may use certain
        trusted third parties to help us provide, improve, promote and protect
        the Services. For example, we may use third parties to help us provide
        customer support or assist with data storage. These third parties may
        access, process or store your information to perform tasks only for the
        purposes we’ve authorized, and we require them to provide at least the
        same level of protection for your information as described in this
        Privacy Policy. We also may share with third parties aggregated or
        anonymized information that does not directly identify you.
      </p>
      <p>
        <strong>4.4.</strong> Business Transfers. If we're involved in a
        reorganization, merger, acquisition or sale of our assets, your
        information may be transferred as part of that deal.
      </p>

      <h4>5. Protection</h4>
      <p>
        While no service is completely secure, our team is dedicated to keeping
        your information safe. We employ security measures such as using
        firewalls to protect against intruders, building redundancies throughout
        our network (so that if one server goes down, another can cover for it)
        and testing for and protecting against network vulnerabilities.
      </p>

      <h4>6. Retention</h4>
      <p>
        We will retain your personal information for as long as we need it to
        provide you with the Services. You can ask for your personal information
        to be deleted at any time by contacting us at{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a>. Please note that
        there may be latency in deleting your personal information from our
        servers and backup storage, and we may retain your personal information
        in order to comply with the law, protect our rights, resolve disputes or
        enforce our agreements.
      </p>

      <h4>7. Location</h4>
      <p>
        Information that you submit through the Services may be transferred to
        countries other than where you live (for example, to our servers in the
        US). We also may store information locally on the devices you use to
        access the Services. We also may transfer information to third parties
        outside the US for processing or to support the Services, and we require
        them to provide at least the same level of protection for your
        information as described in this Privacy Policy.
      </p>

      <h4>8. Access</h4>
      <p>
        To modify or delete the personal information you have provided to us,
        email us at <a href="mailto:team@survey.dev">team@survey.dev</a>. We may
        retain certain information as required by law or for necessary business
        purposes. On request, we'll provide you with a copy of your personal
        information that we maintain. This request may be subject to a fee not
        exceeding the prescribed fee permitted by law.
      </p>

      <h4>9. Communications</h4>
      <p>
        We may periodically email you service-related announcements. We may also
        send you marketing or promotional communications, but you can opt out of
        receiving subsequent marketing or promotional communications by clicking
        the link marked unsubscribe (or a similar phrasing) that’s included in
        those communications.
      </p>

      <h4>10. Modifications</h4>
      <p>
        We may modify this Privacy Policy from time to time, and will post the
        most current version on our site. If a modification meaningfully reduces
        your rights, we'll notify you in accordance with the procedures set
        forth in our <a href="/terms">Terms of Service</a>.
      </p>

      <h4>Contact Us</h4>
      <p>
        If you have any questions or feedback regarding this Privacy Policy,
        please let us know. Please contact us at{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a>.
      </p>
    </section>
  );
}

function Terms() {
  return (
    <section className="container py-5">
      <h1 className="py-3">Survey.dev Terms of Service</h1>

      <p>
        This page explains our terms of service, which contains important
        information about your legal rights. These Terms of Service ("Terms")
        cover your use of and access to the dashboard, surveys, and other
        services (together, the “Services") provided by Survey.dev. Our{" "}
        <a href="/privacy">Privacy Policy</a> explains what personal information
        we collect and how it’s used and shared.
      </p>
      <p>
        By using or accessing the Services, you're agreeing to these Terms and
        our Privacy Policy (collectively, this “Agreement”). If you're using the
        Services for an organization, you're agreeing to this Agreement on
        behalf of that organization, and represent and warrant that you can do
        so. If you don’t agree to all the terms in this Agreement, you may not
        use or access the Services.
      </p>
      <p>
        Please read this Agreement carefully. It includes important information
        about your legal rights, and covers areas such as automatic subscription
        renewals, warranty disclaimers, limitations of liability, resolution of
        disputes by arbitration and a class action waiver.
      </p>
      <p>
        We make no representation that the Services are appropriate or available
        for use in locations other than the United States. If you use the
        Services from outside the United States, you are solely responsible for
        compliance with all applicable laws, including without limitation export
        and import regulations of other countries.
      </p>
      <p>
        You may not assign, subcontract, delegate, or otherwise transfer these
        Terms or your rights and obligations herein, without obtaining our prior
        written consent. We may freely assign these Terms.
      </p>
      <p>
        Any waiver or failure to enforce any provision of this Agreement on one
        occasion will not be deemed a waiver of any other provision or of such
        provision on any other occasion.
      </p>
      <p>
        If any provision of this Agreement is, for any reason, held to be
        invalid or unenforceable, the other provisions of this Agreement will
        remain enforceable and the invalid or unenforceable provision will be
        deemed modified so that it is valid and enforceable to the maximum
        extent permitted by law.
      </p>
      <p>
        These Terms are the final, complete and exclusive agreement of the
        parties with respect to the subject matters hereof and supersede and
        merge all prior discussions between the parties with respect to such
        subject matters. No modification of or amendment to these Terms, or any
        waiver of any rights under these Terms, will be effective unless in
        writing and signed by an authorized signatory of you and an authorized
        representative of Survey.dev.
      </p>
      <p>
        If you have any questions or suggestions regarding the Terms of Service,
        please contact us at{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a>.
      </p>

      <h4>1. Creating an Account</h4>
      <p>
        Make sure your account information is accurate, and you keep your
        account safe. You’re responsible for your account and any activity on
        it. Also, you need to be at least 13 years old to use Survey.dev.
      </p>
      <p>
        <strong>1.1.</strong> Signing Up. To use the Services, you must first
        create an account (“Account”). You agree to provide us with accurate,
        complete and updated information for your Account. We may need to use
        this information to contact you.
      </p>
      <p>
        <strong>1.2.</strong> Staying Safe. Please safeguard your Account and
        make sure others don't have access to your Account or password. You must
        immediately notify us of any actual or suspected loss, theft or
        unauthorized use of your Account. You're solely responsible for any
        activity on your Account. We’re not liable for any acts or omissions by
        you in connection with your Account.
      </p>
      <p>
        <strong>1.3.</strong> Thirteen And Older. The Services are not intended
        for and may not be used by children under the age of 13. By using the
        Services, you represent that you're at least 13. Also, if you’re under
        the age of 18, you must have your parent or guardian’s consent to this
        Agreement, and they may need to enter into this Agreement on your behalf
        (depending on where you live).
      </p>

      <h4>2. Your Content</h4>
      <p>
        When you upload content to Survey.dev, you still own it. You do,
        however, give us permission to use it in the ways necessary to provide
        our services. For example, when you upload a photo, you give us the
        right to save it, and also to display it on your site at your direction
        or to use it in any other way needed to provide the Services detailed in
        this agreement.
      </p>
      <p>
        <strong>2.1.</strong> Your User Content Stays Yours. Users of the
        Services may provide us with content, including without limitation text,
        photos, images, audio, video, code and any other materials (“User
        Content"). Your User Content stays yours. These Terms don't give us any
        rights to User Content, except for the limited rights that enable us to
        provide, improve, promote and protect the Services as described herein.
      </p>
      <p>
        <strong>2.2.</strong> Your License To Us. When you provide User Content
        via the Services, you grant Survey.dev a non-exclusive, worldwide,
        perpetual, royalty-free, sublicensable, transferable right and license
        to use, host, store, reproduce, modify, create derivative works of (such
        as those resulting from translations, adaptations or other changes we
        make so that User Content works better with the Services), communicate,
        publish, publicly display, publicly perform and distribute User Content
        for the limited purposes of allowing us to provide, improve, promote and
        protect the Services.
      </p>

      <h4>3. Your Responsibilities</h4>
      <p>
        You’re responsible for the content you publish on Survey.dev, and you
        vouch to us that it’s all okay to use. We also ask that you follow our
        rules, and don’t do anything illegal on here. And keep in mind that some
        of what you upload can be viewed publicly, so share responsibly.
      </p>
      <p>
        <strong>3.1.</strong> Only Use Content You’re Allowed To Use. You
        represent that you own all rights to your User Content or otherwise have
        (and will continue to have) all rights and permissions to legally use,
        share, display, transfer and license your User Content via the Services.
        If we use your User Content in the ways contemplated in this Agreement,
        you represent that such use will not infringe or violate the rights of
        any third party, including without limitation any copyrights,
        trademarks, privacy rights, publicity rights, contract rights or any
        other intellectual property or proprietary rights. Content on the
        Services may be protected by others' intellectual property or other
        rights, so please don't copy, upload, download or share content unless
        you have the right to do so.
      </p>
      <p>
        <strong>3.2.</strong> Follow Our Rules. You're responsible for your
        conduct and User Content. We may review your conduct and User Content
        for compliance with these Terms. With that said, we have no obligation
        to do so. We’re not responsible for User Content.
      </p>
      <p>
        <strong>3.3.</strong> Follow The Law. You represent that your use of the
        Services is not contrary to law, including without limitation applicable
        US export controls, regulations and sanctions.
      </p>
      <p>
        <strong>3.4.</strong> Share Responsibly. The Services let you share User
        Content with others, including without limitation on social media and
        the open web, so please think carefully about what you share. We’re not
        responsible for what you share via the Services.
      </p>

      <h4>4. Third Party Services And Sites, User Content</h4>
      <p>
        If you use another service based on Survey.dev, or follow a link to
        another site, or work with someone you find on Survey.dev, what happens
        is between you and them. We’re not responsible for it. There’s also a
        lot of content on Survey.dev uploaded by our users (like you). We’re not
        responsible for that either.
      </p>
      <p>
        <strong>4.1.</strong> Third Party Services. The Services may be
        integrated with various third party services, applications and sites
        (collectively, “Third Party Services”) that may make available to you
        their content and products, such as domain and email services, or
        marketplaces to connect customers and vendors. These Third Party
        Services may have their own terms and policies, and your use of them
        will be governed by those terms and policies. We don't control Third
        Party Services, and we’re not liable for Third Party Services or for any
        transaction you may enter into with them. Your security when using Third
        Party Services is your responsibility. You also agree that we may, at
        any time and in our sole discretion, and without any notice to you,
        suspend, disable access to or remove any Third Party Services. We’re not
        liable to you for any such suspension, disabling or removal, including
        without limitation for any loss of profits, revenue, data, goodwill or
        other intangible losses you may experience as a result thereof (except
        where prohibited by law).
      </p>
      <p>
        <strong>4.2.</strong> Third Party Sites. The Services may contain links
        to third party sites. When you access third party sites, you do so at
        your own risk. We don’t control and aren’t liable for those sites.
      </p>
      <p>
        <strong>4.3.</strong> User Content. We haven’t reviewed and cannot
        review all of the User Content made available via the Services. The
        Services may contain User Content: (a) that is offensive or
        objectionable; (b) that contains errors; (c) that violates intellectual
        property, privacy, publicity or other rights of third parties; (d) that
        is harmful to your computer or network; or (e) the downloading, copying
        or use of which is subject to additional terms and policies. By
        operating the Services, we don’t represent or imply that we endorse User
        Content provided therein, or that we believe such User Content to be
        accurate, useful or non-harmful. We’re not a publisher of, and we’re not
        liable for, any User Content uploaded, posted, published or otherwise
        made available via the Services. You're responsible for taking
        precautions to protect yourself, and your computer or network, from User
        Content accessed via the Services.
      </p>

      <h4>5. Our Intellectual Property</h4>
      <p>
        Survey.dev is protected by various intellectual property laws. This
        section summarizes what we own and how we share.
      </p>
      <p>
        <strong>5.1.</strong> Survey.dev Owns Survey.dev. The Services are
        protected by copyright, trademark and other US and foreign laws. These
        Terms don't grant you any right, title or interest in the Services, our
        trademarks, logos or other brand features or intellectual property, or
        others’ content in the Services.
      </p>
      <p>
        <strong>5.2.</strong> We Can Use Your Feedback For Free. We welcome your
        feedback, ideas or suggestions (“Feedback”), but you agree that we may
        use your Feedback without any restriction or obligation to you, even
        after this Agreement is terminated.
      </p>
      <p>
        <strong>5.4.</strong> Our Services Are Often Changed And Improved. We
        may continue to release products and features that we’re still testing
        and evaluating. Our Services are often changed and improved, and you may
        experience changes to the Services or downtime as we release new
        features, so please keep that in mind.
      </p>
      <p>
        <strong>5.5.</strong> We Use Open Source Software. Open source software
        is important to us. Some of the software used in the Services may be
        offered under an open source license that we may make available to you.
        There may be provisions in the open source license that override some of
        these Terms.
      </p>
      <p>
        <strong>5.6.</strong> Our Code. You will not (i) create any derivative
        product; (ii) without our express written permission, introduce software
        or automated agents or scripts to the Services so as to produce multiple
        accounts, generate automated searches, requests and queries, or to strip
        or mine data from the Services; (iii) perform or publish any performance
        or benchmark tests or analyses relating to the Services or the use
        thereof; or (iv) allow third parties to gain access to the Services or
        to otherwise use the Services in any manner other than as expressly
        permitted in this Agreement.
      </p>

      <h4>6. Our Rights</h4>
      <p>
        To operate effectively and protect the security and integrity of
        Survey.dev, we need to maintain control over what happens on our
        services.
      </p>
      <p>
        <strong>6.1.</strong> Important Things We Can Do. We reserve these
        rights, which we may exercise at any time and in our sole discretion,
        and without liability or notice to you (except where prohibited by law):
        (a) we may change the Services and their functionality; (b) we may
        restrict access to or use of parts or all of the Services; (c) we may
        suspend or discontinue parts or all of the Services; (d) we may
        terminate, suspend or restrict your access to or use of parts or all of
        the Services; (e) we may terminate, suspend or restrict access to your
        Account; and (f) we may change our eligibility criteria to use the
        Services (and if such eligibility criteria changes are prohibited by law
        where you live, we may revoke your right to use the Services in that
        jurisdiction).
      </p>
      <p>
        <strong>6.2.</strong> How We Handle Ownership Disputes. Sometimes,
        ownership of an Account or site is disputed between one or more parties,
        such as a business and its employee, or a web designer and their client.
        We try not to get involved in these disputes. However, we reserve the
        right, at any time and in our sole discretion, and without notice to
        you, to determine rightful Account or site ownership and to transfer an
        Account or site to the rightful owner. If we can’t reasonably determine
        the rightful owner, we reserve the right to suspend an Account or site
        until the disputing parties reach a resolution. We also may request
        documentation, such as a government-issued photo ID, a credit card
        invoice or a business license, to help determine the rightful owner.
      </p>

      <h4>7. Privacy</h4>
      <p>
        Our <a href="/privacy">Privacy Policy</a> explains how we handle your
        and your site visitors’ information. Be sure to read it carefully, as
        it’s part of our agreement.
      </p>
      <p>
        Our <a href="/privacy">Privacy Policy</a> explains how we collect, use,
        and share your and your End Users’ information. By using the Services,
        you agree to our collection, use and sharing of information as set forth
        in the Privacy Policy.
      </p>

      <h4>8. Copyright</h4>
      <p>
        We comply with copyright law and respond to complaints about copyright
        infringement in accordance with our Copyright Policy.
      </p>
      <p>
        We respect the intellectual property of others and ask that you do too.
        We respond to notices of alleged copyright infringement if they comply
        with the law, and such notices should be reported to us at{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a>. We reserve the
        right to delete or disable content alleged to be infringing, and to
        terminate Accounts of repeat infringers without any refunds.
      </p>

      <h4>10. Term And Termination</h4>
      <p>Either of us can end this agreement at any time.</p>
      <p>
        This Agreement will remain in effect until terminated by either you or
        us. To terminate this Agreement, you may contact{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a> or simply stop
        using the Services at any time. We reserve the right to suspend or
        terminate the Services at any time at our sole discretion and without
        notice. For example, we may suspend or terminate your use of the
        Services if you're violating these Terms. All sections of this Agreement
        that by their nature should survive termination shall survive
        termination, including without limitation Your Content, Our Intellectual
        Property, Warranty Disclaimers, Limitation Of Liability,
        Indemnification, Dispute Resolution and Additional Terms.
      </p>

      <h4>11. Warranty Disclaimers</h4>
      <p>
        We work hard to make Survey.dev great, but the Services are provided as
        is, without warranties.
      </p>
      <p>
        To the fullest extent permitted by law, Survey.dev makes no warranties,
        either express or implied, about the Services. The Services are provided
        “as is.” Survey.dev also disclaims any warranties of merchantability,
        fitness for a particular purpose and non-infringement. No advice or
        information, whether oral or written, obtained by you from Survey.dev
        shall create any warranty. Survey.dev makes no warranty or
        representation that the Services will: (a) be timely, uninterrupted or
        error-free; (b) meet your requirements or expectations; or (c) be free
        from viruses or other harmful components. Some places don't allow the
        disclaimers in this paragraph, so they may not apply to you.
      </p>

      <h4>12. Limitation Of Liability</h4>
      <p>
        To the fullest extent permitted by law, in no event will Survey.dev be
        liable with respect to any claims arising out of or related to the
        Services or this Agreement for: (a) any indirect, special, incidental,
        exemplary, punitive or consequential damages; (b) any loss of profits,
        revenue, data, goodwill or other intangible losses; (c) any damages
        related to your access to, use of or inability to access or use the
        Services or any portion thereof, including without limitation
        interruption of use or cessation or modification of any aspect of the
        Services; (d) any damages related to loss or corruption of any content
        or data, including without limitation User Content and eCommerce data;
        (e) any User Content or other conduct or content of any user or third
        party using the Services, including without limitation defamatory,
        offensive or unlawful conduct or content; or (f) any Third Party
        Services or third party sites accessed via the Services. These
        limitations apply to any theory of liability, whether based on warranty,
        contract, tort, negligence, strict liability or any other legal theory,
        whether or not Survey.dev has been informed of the possibility of such
        damage, and even if a remedy set forth herein is found to have failed
        its essential purpose. To the fullest extent permitted by law, in no
        event shall the aggregate liability of Survey.dev for all claims arising
        out of or related to the Services and this Agreement exceed the greater
        of twenty dollars ($20) or the amounts paid by you to Survey.dev in the
        twelve (12) months immediately preceding the event that gave rise to
        such claim. Some places don't allow the types of limitations in this
        paragraph, so they may not apply to you.
      </p>

      <h4>13. Indemnification</h4>
      <p>
        To the fullest extent permitted by law, you agree to indemnify and hold
        harmless Survey.dev from and against all damages, losses, and expenses
        of any kind (including without limitation reasonable attorneys' fees and
        costs) arising out of or related to: (a) your breach of this Agreement;
        (b) your User Content; and (c) your violation of any law or regulation
        or the rights of any third party.
      </p>

      <h4>14. Dispute Resolution</h4>
      <p>
        Before filing a claim against Survey.dev, you agree to try to work it
        out informally with us first. All formal disputes must be resolved
        through arbitration following the rules described below, unless you opt
        out of arbitration following the procedure described below. Claims can
        only be brought individually, and not as part of a class action.
      </p>
      <p>
        <strong>14.1.</strong> Informal Resolution. Before filing a claim
        against Survey.dev, you agree to try to resolve the dispute by first
        emailing <a href="mailto:team@survey.dev">team@survey.dev</a> with a
        description of your claim. We'll try to resolve the dispute informally
        by following up via email, phone, or other methods. If we can’t resolve
        the dispute within thirty (30) days of our receipt of your first email,
        you or Survey.dev may then bring a formal proceeding.
      </p>
      <p>
        <strong>14.2.</strong> Arbitration Agreement. You and Survey.dev agree
        to resolve any claims arising from or relating to the Services or this
        Agreement through final and binding arbitration and you and Survey.dev
        expressly waive trial by jury, except as set forth below. Discovery and
        rights to appeal in arbitration are generally more limited than in a
        lawsuit, and other rights that you and we would have in court may not be
        available in arbitration. There is no judge or jury in arbitration, and
        court review of an arbitration award is limited.
      </p>
      <p>
        <strong>14.3.</strong> Arbitration Opt-Out. You can decline this
        agreement to arbitrate by emailing us at{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a> within thirty (30)
        days of the date that you first agree to this Agreement (“Opt-Out
        Period”). Your email must be sent from the email address you use for
        your Account, and must include your full name, residential address and a
        clear statement that you want to opt out of arbitration. If you opt out
        of arbitration pursuant to this Section 14.3, then Sections 14.2, 14.4,
        14.5 and 14.6 of these Terms do not apply to you. This opt-out doesn’t
        affect any other sections of the Terms, including without limitation
        Sections 14.8 (Judicial Forum For Disputes; Time For Filing), 14.9 (No
        Class Actions) and 15.2 (Controlling Law). If you have any questions
        about this process, please contact{" "}
        <a href="mailto:team@survey.dev">team@survey.dev</a>.
      </p>
      <p>
        <strong>14.4.</strong> Arbitration Time For Filing. Any arbitration must
        be commenced by filing a demand for arbitration within one year after
        the date the party asserting the claim first knows or reasonably should
        know of the act, omission or default giving rise to the claim. If
        applicable law prohibits a one year limitation period for asserting
        claims, any claim must be asserted within the shortest time period
        permitted by applicable law.
      </p>
      <p>
        <strong>14.5.</strong> Arbitration Procedures. JAMS, Inc. (“JAMS”) will
        administer the arbitration in accordance with the JAMS Streamlined
        Arbitration Rules & Procedures (“JAMS Rules”) in effect at the time of
        the dispute. You and Survey.dev agree that this Agreement affects
        interstate commerce, so the US Federal Arbitration Act and federal
        arbitration law apply and govern the interpretation and enforcement of
        these provisions (despite the choice of law provision below). Any
        arbitration hearings will take place at a location to be agreed upon in
        New York, New York, in English, and shall be settled by one commercial
        arbitrator with substantial experience in resolving intellectual
        property and commercial contract disputes, who shall be selected from
        the appropriate list of JAMS arbitrators in accordance with the JAMS
        Rules. The arbitrator must follow this Agreement and can award the same
        damages and relief as a court (including without limitation reasonable
        attorneys' fees and costs), except that the arbitrator may not award
        declaratory or injunctive relief benefiting anyone but the parties to
        the arbitration. Judgment upon the award rendered by such arbitrator may
        be entered in any court of competent jurisdiction.
      </p>
      <p>
        <strong>14.6.</strong> Arbitration Fees. The JAMS Rules will govern
        payment of all arbitration fees. We won’t seek our attorneys’ fees and
        costs in arbitration unless the arbitrator determines that your claim is
        frivolous.
      </p>
      <p>
        <strong>14.7.</strong> Exceptions To Arbitration Agreement. Either you
        or Survey.dev may assert claims, if they qualify, in small claims court
        in New York, New York or any United States county where you live or
        work. Either you or Survey.dev may bring a lawsuit solely for injunctive
        relief to stop unauthorized use or abuse of the Services, or
        intellectual property infringement or misappropriation (for example,
        trademark, trade secret, copyright or patent rights) without first
        engaging in arbitration or the informal dispute resolution process
        described above.
      </p>
      <p>
        <strong>14.8.</strong> Judicial Forum For Disputes; Time For Filing. If
        our agreement to arbitrate is found not to apply to you or your claim,
        or if you opt out of arbitration pursuant to Section 14.3, you and
        Survey.dev agree that any judicial proceeding (other than small claims
        actions) must be brought exclusively in the federal or state courts of
        New York, New York and you and Survey.dev consent to venue and personal
        jurisdiction in those courts. Any claim not subject to arbitration must
        be commenced within one year after the date the party asserting the
        claim first knows or reasonably should know of the act, omission or
        default giving rise to the claim. If applicable law prohibits a one year
        limitation period for asserting claims, any claim must be asserted
        within the shortest time period permitted by applicable law.
      </p>
      <p>
        <strong>14.9.</strong> NO CLASS ACTIONS. You may only resolve disputes
        with us on an individual basis, and may not bring a claim as a plaintiff
        or a class member in a class, consolidated or representative action.
        Class actions, class arbitrations, private attorney general actions and
        consolidation with other arbitrations aren't allowed.
      </p>

      <h4>15. Additional Terms</h4>
      <p>
        This Agreement is the whole agreement between us regarding your use of
        Survey.dev. If we ever change it in a way that meaningfully reduces your
        rights, we’ll give you notice and an opportunity to cancel. Also, if
        you’re reading this in a language other than English, note that the
        English language version controls.
      </p>
      <p>
        <strong>15.1.</strong> Entire Agreement. This Agreement constitutes the
        entire agreement between you and Survey.dev regarding the subject matter
        of this Agreement, and supersedes and replaces any other prior or
        contemporaneous agreements, or terms and conditions applicable to the
        subject matter of this Agreement. This Agreement creates no third party
        beneficiary rights.
      </p>
      <p>
        <strong>15.2.</strong> Controlling Law. This Agreement and the Services
        shall be governed in all respects by the laws of the State of Delaware,
        without regard to its conflict of law provisions.
      </p>
      <p>
        <strong>15.3.</strong> Waiver, Severability And Assignment. Our failure
        to enforce any provision of this Agreement is not a waiver of our right
        to do so later. If any provision of this Agreement is found
        unenforceable, the remaining provisions will remain in full effect and
        an enforceable term will be substituted reflecting our intent as closely
        as possible. You may not assign any of your rights under this Agreement,
        and any such attempt will be void. We may assign our rights under this
        Agreement to any of our affiliates or subsidiaries, or to any successor
        in interest of any business associated with the Services.
      </p>
      <p>
        <strong>15.4.</strong> Modifications. We may modify this Agreement from
        time to time, and will always post the most current version on our site.
        If a modification meaningfully reduces your rights, we’ll notify you
        (by, for example, sending you an email or displaying a prominent notice
        within the Services). The notice will designate a reasonable period
        after which the new terms will take effect. Modifications will never
        apply retroactively. By continuing to use or access the Services after
        any modifications come into effect, you agree to be bound by the
        modified Agreement. If you disagree with our changes, then you should
        stop using the Services.
      </p>
      <p>
        <strong>15.5.</strong> Translation. This Agreement was originally
        written in English (US). We may translate this Agreement into other
        languages. In the event of a conflict between a translated version and
        the English version, the English version will control.
      </p>
    </section>
  );
}
