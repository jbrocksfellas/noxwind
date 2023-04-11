import inquirer from "inquirer";

const questions = async function () {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "project_name",
        message: "Enter your project name",
        validate(value) {
          if (value) return true;

          return "Please enter a project name";
        },
      },
      {
        type: "list",
        name: "language",
        message: "Select your programming language",
        default: 0,
        choices: ["javascript", "typescript"],
      },
      {
        type: "list",
        name: "stack",
        message: "Select your stack",
        default: 0,
        choices: ["MEAN Stack", "MERN Stack", "MEVN Stack", "Custom Stack"],
      },
      {
        type: "list",
        name: "stack_type",
        message: "Select your stack type",
        when(answers) {
          return answers.stack === "Custom Stack";
        },
        choices: ["full-stack", "frontend", "backend"],
      },
      {
        type: "list",
        name: "frontend_stack",
        message: "Select the frontend framework",
        when(answers) {
          const fullStack = answers.stack_type === "full-stack";
          const frontend = answers.stack_type === "frontend";
          return fullStack || frontend;
        },
        choices: ["Next.js", "React", "Vue", "Angular", "Vanilla"],
      },
      {
        type: "list",
        name: "backend_stack",
        message: "Select the backend framework",
        when(answers) {
          const fullStack = answers.stack_type === "full-stack";
          const backend = answers.stack_type === "backend";
          return fullStack || backend;
        },
        choices: ["Express.js"],
      },
      {
        type: "list",
        name: "database",
        message: "Select the database driver",
        when(answers) {
          return answers.backend_stack;
        },
        choices: ["mongoose"],
        // "sequelize", "knex", "mongodb", "node-postgres", "firebase-admin", "None"
      },
      // {
      //   type: "confirm",
      //   name: "secondary_database_confirm",
      //   message: "Do you want to use a secondary database?",
      //   when(answers) {
      //     return answers.database;
      //   },
      // },
      // {
      //   type: "list",
      //   name: "secondary_database",
      //   message: "Select the secondary database driver",
      //   when(answers) {
      //     return answers.secondary_database_confirm;
      //   },
      //   choices: ["Redis", "None"],
      // },
      // {
      //   type: "confirm",
      //   name: "backend_auth_confirm",
      //   message: "Do you want to use an authentication library for backend?",
      //   when(answers) {
      //     return answers.database;
      //   },
      // },
      // {
      //   type: "list",
      //   name: "backend_auth_library",
      //   message: "Select your backend auth library",
      //   when(answers) {
      //     return answers.backend_auth_confirm;
      //   },
      //   choices: ["passport", "jsonwebtoken"],
      // },
      // {
      //   type: "confirm",
      //   name: "react_auth_confirm",
      //   message: "Do you want to use an authentication library for React?",
      //   when(answers) {
      //     const mernStack = answers.stack === "MERN Stack";
      //     const react = answers.frontend_stack === "React";
      //     return mernStack || react;
      //   },
      // },
      // {
      //   type: "list",
      //   name: "react_auth_library",
      //   message: "Select your react auth library",
      //   when(answers) {
      //     return answers.react_auth_confirm;
      //   },
      //   choices: ["auth0", "firebase"],
      // },
      // {
      //   type: "confirm",
      //   name: "next_auth_confirm",
      //   message: "Do you want to use an authentication library for Next.js?",
      //   when(answers) {
      //     const nextJs = answers.frontend_stack === "Next.js";
      //     return nextJs;
      //   },
      // },
      // {
      //   type: "list",
      //   name: "next_auth_library",
      //   message: "Select your next auth library",
      //   when(answers) {
      //     return answers.next_auth_confirm;
      //   },
      //   choices: ["next-auth"],
      // },
      {
        type: "confirm",
        name: "css_confirm",
        message: "Do you want to use a CSS framework?",
        when(answers) {
          const meanStack = answers.stack === "MEAN Stack";
          const mernStack = answers.stack === "MERN Stack";
          const mevnStack = answers.stack === "MEVN Stack";
          const notBackend = answers.stack_type && answers.stack_type !== "backend";

          return meanStack || mernStack || mevnStack || notBackend;
        },
      },
      {
        type: "list",
        name: "css_framework",
        message: "Select your CSS library",
        when(answers) {
          return answers.css_confirm;
        },
        choices: [{ name: "Tailwind CSS", value: "tailwindcss" }, "SCSS"],
        // styled components, bootstrap, ant design, material ui, tailwind css, scss, foundation, bulma, materialize
      },
      {
        type: "confirm",
        name: "frontend_testing_confirm",
        message: "Do you want to use a testing framework for frontend?",
        when(answers) {
          const mernStack = answers.stack === "MERN Stack";
          const mevnStack = answers.stack === "MEVN Stack";
          const notBackend = answers.stack_type && answers.stack_type !== "backend";

          return mernStack || mevnStack || notBackend;
        },
      },
      {
        type: "list",
        name: "frontend_testing_framework",
        message: "Select your frontend testing framework",
        when(answers) {
          return answers.frontend_testing_confirm;
        },
        choices: ["Jest", "Jest + Enzyme", "Cypress + Mocha + Chai"],
        // "TestCafe + Mocha + Chai", "Karma + Jasmine", "Nightwat.js + Mocha + Chai"
      },
      {
        type: "confirm",
        name: "backend_testing_confirm",
        message: "Do you want to use a testing framework for backend?",
        when(answers) {
          const meanStack = answers.stack === "MEAN Stack";
          const mernStack = answers.stack === "MERN Stack";
          const mevnStack = answers.stack === "MEVN Stack";
          const backendStack = answers.stack_type && answers.stack_type !== "frontend";

          return meanStack || mernStack || mevnStack || backendStack;
        },
      },
      {
        type: "list",
        name: "backend_testing_framework",
        message: "Select your backend testing framework.",
        when(answers) {
          return answers.backend_testing_confirm;
        },
        choices: ["Mocha + Chai", "Jest", "Mocha + Chai + Supertest", "Mocha + Chai + Sinon"],
        // "Cucumber + Gherkin", "AVA + Sinon"
      },
      {
        type: "checkbox",
        name: "additional_frontend_packages",
        message: "Select additional frontend packages",
        when(answers) {
          const meanStack = answers.stack === "MEAN Stack";
          const mernStack = answers.stack === "MERN Stack";
          const mevnStack = answers.stack === "MEVN Stack";
          const notBackend = answers.stack_type && answers.stack_type !== "backend";

          return meanStack || mernStack || mevnStack || notBackend;
        },
        choices: [{ name: "yup" }, { name: "socket.io-client" }, { name: "axios" }, { name: "rxjs" }],
      },
      {
        type: "checkbox",
        name: "additional_backend_packages",
        message: "Select additional backend packages",
        when(answers) {
          const meanStack = answers.stack === "MEAN Stack";
          const mernStack = answers.stack === "MERN Stack";
          const mevnStack = answers.stack === "MEVN Stack";
          const backendStack = answers.stack_type && answers.stack_type !== "frontend";

          return meanStack || mernStack || mevnStack || backendStack;
        },
        choices: [
          { name: "bcryptjs" },
          { name: "jsonwebtoken" },
          { name: "multer" },
          { name: "joi" },
          { name: "morgan" },
          { name: "winston" },
          { name: "socket.io" },
          { name: "helmet" },
          { name: "nodemailer" },
          { name: "axios" },
          { name: "uuid" },
          { name: "rxjs" },
        ],
      },

      // { type: "confirm", name: "frontend_validation_library_confirm", message: "Do you want to use a validation library for frontend?" },
      // { type: "confirm", name: "backend_validation_library_confirm", message: "Do you want to use a validation library for backend?" },
    ]);

    return answers;
  } catch (err) {
    throw err;
  }
};

// mean stack packages:

export { questions };
