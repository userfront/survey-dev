const frontendTechnologies = [
  "React",
  "Vue",
  "Angular",
  "jQuery",
  "Plain/Vanilla JS",
];
const backendTechnologies = [
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
  "WordPress",
];
const platformTechnologies = [
  "On Premise",
  "AWS",
  "Azure",
  "GCP",
  "Digital Ocean",
  "Heroku",
  "Netlify",
];

const questions = {
  showPageNumbers: false,
  pages: [
    {
      title: "Your work in 2020",
      description:
        "These questions help determine pay trends across clients and contracts.",
      name: "clients",
      questions: [
        {
          title: "How many clients did you have in 2020?",
          type: "text",
          inputType: "number",
          name: "workClientCount",
          placeHolder: "Number of clients",
        },
        {
          title: "How many contracts did you have in 2020?",
          type: "text",
          inputType: "number",
          name: "workContractCount",
          placeHolder: "Number of contracts",
        },
        {
          title: "Your top paying client",
          type: "panel",
          name: "workTopPayingPanel",
          description: "The client you earned the most from in 2020",
          // visibleIf: "{workClientCount} > 1",
          elements: [
            {
              title:
                "How much did you earn from your top paying client in 2020, before tax?",
              type: "text",
              inputType: "number",
              placeHolder: "$ Amount you earned",
              name: "workTopPayingEarnings",
            },
            {
              title:
                "How many separate contracts did you work on for your top paying client in 2020?",
              type: "text",
              inputType: "number",
              placeHolder: "Number of contracts",
              name: "workTopPayingNumberOfContracts",
            },
            {
              title:
                "How long was the longest contract for your top paying client in 2020?",
              type: "dropdown",
              name: "workTopPayingLength",
              choices: [
                "Less than a week",
                "1-4 weeks",
                "1 month",
                "2 months",
                "3 months",
                "4 months",
                "5 months",
                "6 months",
                "More than 6 months",
              ],
            },
            {},
            {
              title:
                "What tools did you personally use on the frontend for this client?",
              type: "checkbox",
              name: "workTopPayingFrontend",
              hasOther: true,
              colCount: 4,
              choices: frontendTechnologies,
            },
            {
              title:
                "What tools did you personally use on the backend for this client?",
              type: "checkbox",
              name: "workTopPayingBackend",
              colCount: 4,
              hasOther: true,
              choices: backendTechnologies,
            },
            {
              title: "What platform(s) does this client use?",
              type: "checkbox",
              name: "workTopPayingInfra",
              colCount: 4,
              hasOther: true,
              choices: platformTechnologies,
            },
            {
              title:
                "Which technology choices did you influence at your top paying client?",
              type: "checkbox",
              name: "workTopPayingTechnology",
              colCount: 3,
              hasOther: true,
              choices: [
                "Programming language",
                "Framework(s)",
                "Libraries",
                "Hosting",
                "Open source tools",
                "Collaboration tools",
                "Paid tools & services",
                "Free tools",
              ],
            },
            {
              title: "How many employees work at your top paying client?",
              type: "dropdown",
              placeHolder: "Number of employees",
              name: "workTopPayingEmployeeCount",
              choices: ["1", "2-19", "20-99", "100-999", "1000 or more"],
            },
            {
              title: "Did you have difficulty getting paid by this client?",
              type: "boolean",
              name: "workTopPayingPayDifficulty",
            },
          ],
        },
      ],
    },
    {
      title: "Your work setup in 2020",
      description:
        "These questions help determine pay trends across locations and technologies.",
      name: "worker",
      questions: [
        {
          title: "Your location in 2020",
          type: "panel",
          name: "workerLocation",
          elements: [
            {
              title: "Your region",
              type: "dropdown",
              name: "workerRegion",
              choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
            },
            {
              title: "Your country",
              type: "dropdown",
              name: "workerCountry",
              placeHolder: "Choose your",
              choicesByUrl: {
                url: "https://restcountries.eu/rest/v2/region/{workerRegion}",
                valueName: "name",
              },
            },
            {
              title: "Your city",
              type: "text",
              name: "workerCity",
              placeHolder: "Your city",
            },
          ],
        },
        {
          title: "What technologies did you use in 2020?",
          type: "panel",
          name: "workerTechnology",
          elements: [
            {
              title: "Frontend",
              type: "checkbox",
              name: "workerFrontend",
              hasOther: true,
              colCount: 4,
              choices: frontendTechnologies,
            },
            {
              title: "Backend",
              type: "checkbox",
              name: "workerBackend",
              colCount: 4,
              hasOther: true,
              choices: backendTechnologies,
            },
            {
              title: "Platform",
              type: "checkbox",
              name: "workerInfra",
              colCount: 4,
              hasOther: true,
              choices: platformTechnologies,
            },
          ],
        },
        {
          title: "Earnings",
          type: "panel",
          name: "workerPay",
          elements: [
            {
              title:
                "How much did you earn in 2020 from contract web projects, before tax?",
              type: "text",
              inputType: "number",
              name: "workerPayTotal",
              placeHolder: "$",
            },
            {
              title:
                "What percentage of your total earnings in 2020 were from contract web projects?",
              type: "dropdown",
              name: "workerPayPercentage",
              colCount: 5,
              choices: [
                "100%",
                "90%",
                "80%",
                "70%",
                "60%",
                "50%",
                "40%",
                "30%",
                "20%",
                "10%",
                "0%",
              ],
            },
            {
              title:
                "Did you have difficulty getting paid by any clients in 2020?",
              type: "boolean",
              name: "workerPayDifficulty",
            },
          ],
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
