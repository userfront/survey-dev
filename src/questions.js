const questions = {
  pages: [
    {
      title: "Your work setup in 2020",
      description:
        "These questions help determine pay trends across locations and technologies.",
      name: "worker",
      questions: [
        {
          type: "panel",
          name: "workerLocation",
          title: "Where were you located in 2020?",
          elements: [
            {
              type: "dropdown",
              name: "workerRegion",
              title: "Your region",
              choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
            },
            {
              type: "dropdown",
              name: "workerCountry",
              title: "Your country",
              placeHolder: "Choose your",
              choicesByUrl: {
                url: "https://restcountries.eu/rest/v2/region/{workerRegion}",
                valueName: "name",
              },
            },
            {
              type: "text",
              name: "workerCity",
              title: "Your city",
              placeHolder: "Your city",
            },
          ],
        },
        {
          type: "panel",
          name: "workerTechnology",
          title: "What technologies did you use in 2020?",
          elements: [
            {
              type: "checkbox",
              name: "workerFrontend",
              title: "Frontend",
              hasOther: true,
              colCount: 4,
              choices: [
                "React",
                "Vue",
                "Angular",
                "jQuery",
                "Plain/Vanilla JS",
              ],
            },
            {
              type: "checkbox",
              name: "workerBackend",
              title: "Backend",
              colCount: 4,
              hasOther: true,
              choices: [
                "Node.js",
                "Ruby on Rails",
                "Django",
                "ASP.NET",
                "Spring",
                "Flask",
                "Laravel",
                "Symfony",
                "Gatsby",
                "Drupal",
              ],
            },
            {
              type: "checkbox",
              name: "workerInfra",
              title: "Platform",
              colCount: 4,
              hasOther: true,
              choices: [
                "AWS",
                "Azure",
                "Google Cloud Platform",
                "Digital Ocean",
                "Heroku",
                "Netlify",
              ],
            },
          ],
        },
        {
          type: "panel",
          name: "workerPay",
          title: "How much did you earn in 2020?",
          elements: [
            {
              type: "text",
              inputType: "number",
              name: "workerPayTotal",
              title:
                "Before taxes, how much did you earn in 2020 from contract web projects?",
              placeHolder: "$",
            },
            {
              type: "radiogroup",
              name: "workerPayPercentage",
              title:
                "What percentage of your total earnings in 2020 were from contract web projects?",
              colCount: 5,
              choices: ["0%", "25%", "50%", "75%", "100%"],
            },
          ],
        },
      ],
    },
    {
      name: "clients",
      questions: [
        {
          type: "radiogroup",
          choices: ["Yes", "No"],
          isRequired: true,
          name: "mvvmUsing",
          title: "Do you use any MVVM framework?",
        },
        {
          type: "checkbox",
          choices: ["AngularJS", "KnockoutJS", "React"],
          hasOther: true,
          isRequired: true,
          name: "mvvm",
          title: "What MVVM framework do you use?",
          visibleIf: "{mvvmUsing} = 'Yes'",
        },
      ],
    },
    {
      name: "page3",
      questions: [
        {
          type: "comment",
          name: "about",
          title:
            "Please tell us about your main requirements for Survey library",
        },
      ],
    },
  ],
};

export default questions;
