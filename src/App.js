import * as Survey from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

Survey.StylesManager.applyTheme("modern");
const survey = new Survey.Model(questions);
survey.onComplete.add(function (result) {
  console.log(result.data);
});

function App() {
  return (
    <div className="App">
      <Survey.Survey model={survey} />
    </div>
  );
}

export default App;
