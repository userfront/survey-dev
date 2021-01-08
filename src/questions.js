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

const industries = [
  "Natural Resources & Mining",
  "Construction",
  "Manufacturing",
  "Wholesale Trade",
  "Retail Trade",
  "Transportation & Warehousing",
  "Utilities",
  "Information & Publishing",
  "Finance & Insurance",
  "Real Estate",
  "Professional Services",
  "Education",
  "Healthcare",
  "Leisure & Hospitality",
  "Other Services",
];

const numberSettings = {
  type: "text",
  inputType: "number",
  min: 0,
};

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
      name: "workerMarketingMethods",
      type: "checkbox",
      colCount: 4,
      hasOther: true,
      choices: [
        "Upwork",
        "Repeat clients",
        "Own website",
        "Online advertising",
        "Offline advertising",
        "Referral from client",
        "Referral from network",
      ],
      choicesOrder: "random",
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
          choicesOrder: "random",
        },
        {
          title: "Backend",
          type: "checkbox",
          name: "workerBackend",
          colCount: 4,
          hasOther: true,
          choices: backendTechnologies,
          choicesOrder: "random",
        },
        {
          title: "Platform",
          type: "checkbox",
          name: "workerInfra",
          colCount: 4,
          hasOther: true,
          choices: platformTechnologies,
          choicesOrder: "random",
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
      title:
        "How much did you earn in 2020 from contract web projects, before tax?",
      step: 100,
      name: "payTotal",
      placeHolder: "$ Amount you earned",
      ...numberSettings,
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
      name: "payClientCount",
      placeHolder: "Number of clients",
      ...numberSettings,
    },
    {
      title: "How many contracts did you have in 2020?",
      name: "payContractCount",
      placeHolder: "Number of contracts",
      ...numberSettings,
    },
    {
      title: "Did you have difficulty getting paid by any clients in 2020?",
      type: "boolean",
      name: "payDifficulty",
    },
  ],
};

const topClientPage = {
  title: "Your top paying client",
  description: "The client you earned the most from in 2020",
  navigationTitle: "Top client",
  name: "topClient",
  questions: [
    {
      title:
        "How much did you earn from your top paying client in 2020, before tax?",
      placeHolder: "$ Amount you earned",
      name: "topClientEarnings",
      step: 100,
      ...numberSettings,
    },
    {
      title:
        "How many separate contracts did you work on for your top paying client in 2020?",
      placeHolder: "Number of contracts",
      name: "topClientNumberOfContracts",
      ...numberSettings,
    },
    {
      title:
        "How long was the longest contract for your top paying client in 2020?",
      type: "dropdown",
      name: "topClientLength",
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
      name: "topClientFrontend",
      hasOther: true,
      colCount: 4,
      choices: frontendTechnologies,
      choicesOrder: "random",
    },
    {
      title:
        "What tools did you personally use on the backend for this client?",
      type: "checkbox",
      name: "topClientBackend",
      colCount: 4,
      hasOther: true,
      choices: backendTechnologies,
      choicesOrder: "random",
    },
    {
      title: "What platform(s) does this client use?",
      type: "checkbox",
      name: "topClientInfra",
      colCount: 4,
      hasOther: true,
      choices: platformTechnologies,
      choicesOrder: "random",
    },
    {
      title:
        "Which technology choices did you influence at your top paying client?",
      type: "checkbox",
      name: "topClientTechnology",
      colCount: 3,
      hasOther: true,
      choices: technologyChoices,
      choicesOrder: "random",
    },
    {
      title: "Top client location",
      type: "panel",
      name: "topClientLocation",
      elements: [
        {
          title: "Your top client's region",
          type: "dropdown",
          name: "topClientRegion",
          choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
        },
        {
          title: "Your top client's country",
          type: "dropdown",
          name: "topClientCountry",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/{topClientRegion}",
            valueName: "name",
          },
        },
      ],
    },
    {
      title: "What industry is this client in?",
      type: "dropdown",
      name: "topClientIndustry",
      choices: industries,
    },
    {
      title: "How many employees work at your top paying client?",
      type: "dropdown",
      name: "topClientEmployeeCount",
      choices: ["1", "2-19", "20-99", "100-999", "1000 or more"],
    },
    {
      title: "Did you have difficulty getting paid by this client?",
      type: "boolean",
      name: "topClientPayDifficulty",
    },
  ],
};

const bottomClientPage = {
  title: "Your bottom paying client",
  description: "The client you earned the least from in 2020",
  navigationTitle: "Bottom client",
  name: "bottomClient",
  // visibleIf: "{payClientCount} > 1",
  questions: [
    {
      title:
        "How much did you earn from your bottom paying client in 2020, before tax?",
      placeHolder: "$ Amount you earned",
      name: "bottomClientEarnings",
      step: 100,
      ...numberSettings,
    },
    {
      title:
        "How many separate contracts did you work on for your bottom paying client in 2020?",
      placeHolder: "Number of contracts",
      name: "bottomClientNumberOfContracts",
      ...numberSettings,
    },
    {
      title:
        "How long was the longest contract for your bottom paying client in 2020?",
      type: "dropdown",
      name: "bottomClientLength",
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
      name: "bottomClientFrontend",
      hasOther: true,
      colCount: 4,
      choices: frontendTechnologies,
      choicesOrder: "random",
    },
    {
      title:
        "What tools did you personally use on the backend for this client?",
      type: "checkbox",
      name: "bottomClientBackend",
      colCount: 4,
      hasOther: true,
      choices: backendTechnologies,
      choicesOrder: "random",
    },
    {
      title: "What platform(s) does this client use?",
      type: "checkbox",
      name: "bottomClientInfra",
      colCount: 4,
      hasOther: true,
      choices: platformTechnologies,
      choicesOrder: "random",
    },
    {
      title:
        "Which technology choices did you influence at your bottom paying client?",
      type: "checkbox",
      name: "bottomClientTechnology",
      colCount: 3,
      hasOther: true,
      choices: technologyChoices,
      choicesOrder: "random",
    },
    {
      title: "Top client location",
      type: "panel",
      name: "bottomClientLocation",
      elements: [
        {
          title: "Your bottom client's region",
          type: "dropdown",
          name: "bottomClientRegion",
          choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
        },
        {
          title: "Your bottom client's country",
          type: "dropdown",
          name: "bottomClientCountry",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/{bottomClientRegion}",
            valueName: "name",
          },
        },
      ],
    },
    {
      title: "What industry is this client in?",
      type: "dropdown",
      name: "bottomClientIndustry",
      choices: industries,
    },
    {
      title: "How many employees work at your bottom paying client?",
      type: "dropdown",
      name: "bottomClientEmployeeCount",
      choices: ["1", "2-19", "20-99", "100-999", "1000 or more"],
    },
    {
      title: "Did you have difficulty getting paid by this client?",
      type: "boolean",
      name: "bottomClientPayDifficulty",
    },
  ],
};

const finalPage = {
  title: "Final page",
  description: "Final questions",
  navigationTitle: "Complete",
  name: "final",
  questions: [
    {
      title: "Are there any clients you would like to name as good clients?",
      type: "comment",
      name: "finalGoodClients",
    },
    {
      title: "Are there any clients you would like to name as bad clients?",
      type: "comment",
      name: "finalBadClients",
    },
    {
      title: "Anything else you would like to add?",
      type: "comment",
    },
  ],
};

const questions = {
  showQuestionNumbers: "off",
  showProgressBar: "top",
  progressBarType: "buttons",
  pages: [workerPage, payPage, topClientPage, bottomClientPage, finalPage],
};

export default questions;
