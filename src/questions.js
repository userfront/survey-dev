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

const technologyChoices = [
  "Programming language",
  "Framework(s)",
  "Libraries",
  "Hosting",
  "Open source tools",
  "Collaboration tools",
  "Paid tools & services",
  "Free tools",
];

const workerPage = {
  title: "Your work setup in 2020",
  description:
    "These questions help determine pay trends across locations and technologies.",
  navigationTitle: "Your setup",
  name: "worker",
  questions: [
    {
      title: "Where were you located in 2020?",
      type: "panel",
      name: "workerLocationPanel",
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
      title: "How did you find work in 2020?",
      type: "panel",
      name: "workerMarketingPanel",
      elements: [
        {
          title: "Methods",
          name: "workerMarketingMethods",
          type: "checkbox",
          colCount: 4,
          hasOther: true,
          choices: [
            "Upwork",
            "Referral from client",
            "Referral from network",
            "Repeat clients",
            "Own website",
            "Online advertising",
            "Offline advertising",
          ],
        },
      ],
    },
    {
      title: "What technologies did you use in 2020?",
      type: "panel",
      name: "workerTechnologyPanel",
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
  ],
};

const payPage = {
  title: "Your pay in 2020",
  description:
    "These questions help determine pay trends across clients and contracts.",
  navigationTitle: "Pay",
  name: "pay",
  questions: [
    {
      title: "Earnings",
      type: "panel",
      name: "payPanel",
      elements: [
        {
          title:
            "How much did you earn in 2020 from contract web projects, before tax?",
          type: "text",
          inputType: "number",
          name: "payTotal",
          placeHolder: "$",
        },
        {
          title:
            "What percentage of your total earnings in 2020 were from contract web projects?",
          type: "dropdown",
          name: "payPercentage",
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
          title: "How many clients did you have in 2020?",
          type: "text",
          inputType: "number",
          name: "payClientCount",
          placeHolder: "Number of clients",
        },
        {
          title: "How many contracts did you have in 2020?",
          type: "text",
          inputType: "number",
          name: "payContractCount",
          placeHolder: "Number of contracts",
        },
        {
          title: "Did you have difficulty getting paid by any clients in 2020?",
          type: "boolean",
          name: "payDifficulty",
        },
      ],
    },
  ],
};

const questions = {
  // showPageNumbers: false,
  showProgressBar: "top",
  progressBarType: "buttons",
  pages: [
    workerPage,
    payPage,
    {
      title: "Your work in 2020",
      description:
        "These questions help determine pay trends across clients and contracts.",
      navigationTitle: "Top client",
      name: "clients",
      questions: [
        {
          type: "html",
          name: "info",
          html: "<br>",
        },
        {
          title: "Your top paying client",
          type: "panel",
          name: "workTopClientPanel",
          description: "The client you earned the most from in 2020",
          elements: [
            {
              title:
                "How much did you earn from your top paying client in 2020, before tax?",
              type: "text",
              inputType: "number",
              placeHolder: "$ Amount you earned",
              name: "workTopClientEarnings",
            },
            {
              title:
                "How many separate contracts did you work on for your top paying client in 2020?",
              type: "text",
              inputType: "number",
              placeHolder: "Number of contracts",
              name: "workTopClientNumberOfContracts",
            },
            {
              title:
                "How long was the longest contract for your top paying client in 2020?",
              type: "dropdown",
              name: "workTopClientLength",
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
            {
              title:
                "What tools did you personally use on the frontend for this client?",
              type: "checkbox",
              name: "workTopClientFrontend",
              hasOther: true,
              colCount: 4,
              choices: frontendTechnologies,
            },
            {
              title:
                "What tools did you personally use on the backend for this client?",
              type: "checkbox",
              name: "workTopClientBackend",
              colCount: 4,
              hasOther: true,
              choices: backendTechnologies,
            },
            {
              title: "What platform(s) does this client use?",
              type: "checkbox",
              name: "workTopClientInfra",
              colCount: 4,
              hasOther: true,
              choices: platformTechnologies,
            },
            {
              title:
                "Which technology choices did you influence at your top paying client?",
              type: "checkbox",
              name: "workTopClientTechnology",
              colCount: 3,
              hasOther: true,
              choices: technologyChoices,
            },
            {
              title: "Top client location",
              type: "panel",
              name: "workTopClientLocation",
              elements: [
                {
                  title: "Your top client's region",
                  type: "dropdown",
                  name: "workTopClientRegion",
                  choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
                },
                {
                  title: "Your top client's country",
                  type: "dropdown",
                  name: "workTopClientCountry",
                  choicesByUrl: {
                    url:
                      "https://restcountries.eu/rest/v2/region/{workerRegion}",
                    valueName: "name",
                  },
                },
              ],
            },
            {
              title: "What industry is this client in?",
              type: "dropdown",
              name: "workTopClientIndustry",
            },
            {
              title: "How many employees work at your top paying client?",
              type: "dropdown",
              name: "workTopClientEmployeeCount",
              choices: ["1", "2-19", "20-99", "100-999", "1000 or more"],
            },
            {
              title: "Did you have difficulty getting paid by this client?",
              type: "boolean",
              name: "workTopClientPayDifficulty",
            },
          ],
        },
        {
          type: "html",
          name: "info",
          html: "<br>",
        },
        {
          title: "Your bottom paying client",
          type: "panel",
          name: "workBottomClientPanel",
          description: "The client you earned the least from in 2020",
          visibleIf: "{workClientCount} > 1",
          elements: [
            {
              title:
                "How much did you earn from your bottom paying client in 2020, before tax?",
              type: "text",
              inputType: "number",
              placeHolder: "$ Amount you earned",
              name: "workBottomClientEarnings",
            },
            {
              title:
                "How many separate contracts did you work on for your bottom paying client in 2020?",
              type: "text",
              inputType: "number",
              placeHolder: "Number of contracts",
              name: "workBottomClientNumberOfContracts",
            },
            {
              title:
                "How long was the longest contract for your bottom paying client in 2020?",
              type: "dropdown",
              name: "workBottomClientLength",
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
            {
              title:
                "What tools did you personally use on the frontend for this client?",
              type: "checkbox",
              name: "workBottomClientFrontend",
              hasOther: true,
              colCount: 4,
              choices: frontendTechnologies,
            },
            {
              title:
                "What tools did you personally use on the backend for this client?",
              type: "checkbox",
              name: "workBottomClientBackend",
              colCount: 4,
              hasOther: true,
              choices: backendTechnologies,
            },
            {
              title: "What platform(s) does this client use?",
              type: "checkbox",
              name: "workBottomClientInfra",
              colCount: 4,
              hasOther: true,
              choices: platformTechnologies,
            },
            {
              title:
                "Which technology choices did you influence at your bottom paying client?",
              type: "checkbox",
              name: "workBottomClientTechnology",
              colCount: 3,
              hasOther: true,
              choices: technologyChoices,
            },
            {
              title: "What industry is this client in?",
              type: "dropdown",
              name: "workBottomClientIndustry",
            },
            {
              title: "How many employees work at your bottom paying client?",
              type: "dropdown",
              name: "workBottomClientEmployeeCount",
              choices: ["1", "2-19", "20-99", "100-999", "1000 or more"],
            },
            {
              title: "Did you have difficulty getting paid by this client?",
              type: "boolean",
              name: "workBottomClientPayDifficulty",
            },
          ],
        },
      ],
    },
  ],
};

export default questions;
