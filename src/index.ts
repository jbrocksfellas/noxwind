#! /usr/bin/env node

import * as utils from "./utils.js";
import { questions } from "./questions.js";
import shell from "shelljs";
import fs from "fs";
import ProgressBar from "progress";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const npmVersion = parseFloat(shell.exec("npm -v", { silent: true }).stdout.trim());

questions()
  .then((answers) => {
    // console.log(answers);

    const projectName = answers.project_name;
    const language = answers.language;
    const stack = answers.stack;
    const isTypescript = language === "typescript";
    const cssFramework = answers.css_framework;

    // project setup
    const frontendName = `${projectName}-frontend`;
    const backendName = `${projectName}-backend`;

    let backendDevDependencies: Array<string> = ["nodemon"];
    if (answers.backend_testing_confirm) {
      // parse pacakges for testing devDependencies
      const testingLibraries = utils.findTestingLibraries(answers.backend_testing_framework);
      backendDevDependencies = [...backendDevDependencies, ...testingLibraries];
    }

    let frontendDevDependencies: Array<string> = [];
    if (answers.frontend_testing_confirm) {
      // parse pacakges for testing devDependencies
      const testingLibraries = utils.findTestingLibraries(answers.frontend_testing_framework);
      frontendDevDependencies = [...frontendDevDependencies, ...testingLibraries];
    }

    if (stack === "MEAN Stack") {
      createAngularApp(frontendName, [...answers.additional_frontend_packages], frontendDevDependencies, cssFramework);
      createNodeApp(backendName, ["express", "mongoose", "dotenv", "cors", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
    } else if (stack === "MERN Stack") {
      const frontendStack = utils.findFrontendFramework(stack);
      const template = utils.findViteTemplate(frontendStack, isTypescript);

      createViteApp(frontendName, template, [...answers.additional_frontend_packages], frontendDevDependencies);
      createNodeApp(backendName, ["express", "mongoose", "dotenv", "cors", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
    } else if (stack === "MEVN Stack") {
      const frontendStack = utils.findFrontendFramework(stack);
      const template = utils.findViteTemplate(frontendStack, isTypescript);

      createViteApp(frontendName, template, [...answers.additional_frontend_packages], frontendDevDependencies);
      createNodeApp(backendName, ["express", "mongoose", "dotenv", "cors", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
    } else {
      const stackType = answers.stack_type;
      if (stackType === "frontend") {
        const frontendStack = answers.frontend_stack;
        if (frontendStack === "Next.js") {
          const hasTypeScript = language === "typescript";
          const hasTailwind = cssFramework === "tailwindcss";
          const hasEsLint = true;
          const hasSrcDirectory = true;
          const hasExperimentalAppDirectory = true;
          const importAlias = "@/";

          createNextApp(
            frontendName,
            hasTypeScript,
            hasTailwind,
            hasEsLint,
            hasSrcDirectory,
            hasExperimentalAppDirectory,
            importAlias,
            frontendDevDependencies
          );
        } else if (frontendStack === "Angular") {
          createAngularApp(frontendName, [...answers.additional_frontend_packages], frontendDevDependencies, cssFramework);
          createNodeApp(backendName, ["express", "mongoose", "dotenv", "cors", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
        } else {
          const template = utils.findViteTemplate(frontendStack, isTypescript);

          createViteApp(frontendName, template, [...answers.additional_frontend_packages], frontendDevDependencies);
        }
      } else if (stackType === "backend") {
        const backendStack = answers.backend_stack;

        if (backendStack === "Express.js") {
          createNodeApp(
            backendName,
            ["express", "dotenv", "cors", ...answers.additional_backend_packages, answers.database],
            backendDevDependencies,
            isTypescript
          );
        }
      } else {
        const frontendStack = answers.frontend_stack;
        const backendStack = answers.backend_stack;

        if (frontendStack === "Next.js") {
          const hasTypeScript = language === "typescript";
          const hasTailwind = cssFramework === "tailwindcss";
          const hasEsLint = true;
          const hasSrcDirectory = true;
          const hasExperimentalAppDirectory = true;
          const importAlias = "@/";

          createNextApp(
            frontendName,
            hasTypeScript,
            hasTailwind,
            hasEsLint,
            hasSrcDirectory,
            hasExperimentalAppDirectory,
            importAlias,
            frontendDevDependencies
          );
        } else if (frontendStack === "Angular") {
          createAngularApp(frontendName, [...answers.additional_frontend_packages], frontendDevDependencies, cssFramework);
          createNodeApp(backendName, ["express", "mongoose", "dotenv", "cors", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
        } else {
          const template = utils.findViteTemplate(frontendStack, isTypescript);

          createViteApp(frontendName, template, [...answers.additional_frontend_packages], frontendDevDependencies);
        }

        if (backendStack === "Express.js") {
          createNodeApp(
            backendName,
            ["express", "dotenv", "cors", ...answers.additional_backend_packages, answers.database],
            backendDevDependencies,
            isTypescript
          );
        }
      }
    }
  })
  .catch((err) => console.log(err));

function createNextApp(
  frontendName: string,
  hasTypeScript: boolean,
  hasTailwind: boolean,
  hasEsLint: boolean,
  hasExperimentalAppDirectory: boolean,
  hasSrcDirectory: boolean,
  importAlias: string,
  devDependencies: Array<string>
) {
  let command = `npx create-next-app@latest ${frontendName}`;

  hasTypeScript ? (command += " --ts") : (command += " --js");
  hasTailwind ? (command += " --tailwind") : (command += " --no-tailwind");
  if (hasEsLint) command += " --eslint";
  if (hasExperimentalAppDirectory) command += " --experimental-app";
  if (hasSrcDirectory) command += " --src-dir";
  command += " --import-alias " + importAlias;

  console.log("Installing frontend dependencies...");
  const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
    total: 2,
    width: 20,
  });
  bar.tick();
  shell.exec(command, { silent: true });
  bar.tick();

  shell.cd(frontendName);

  if (devDependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: devDependencies.length,
      width: 20,
    });
    devDependencies.forEach((dependency) => {
      shell.exec("npm install --save-dev " + dependency, { silent: true });
      bar.tick();
    });
  }

  shell.cd("..");
}

function createViteApp(frontendName: string, template: string, dependencies: Array<string>, devDependencies: Array<string>) {
  // templates: vanilla, vanilla-ts, vue, vue-ts, react, react-ts, react-swc, react-swc-ts, preact, preact-ts, lit, lit-ts, svelte, svelte-ts
  let command = `npm create vite@latest -y ${frontendName}`;
  npmVersion > 7 ? (command += ` -- --template ${template}`) : ` --template ${template}`;

  shell.exec(command, { silent: true });

  shell.cd(frontendName);

  console.log("Installing frontend dependencies...");
  shell.exec("npm install", { silent: true });

  if (dependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: devDependencies.length,
      width: 20,
    });

    dependencies.forEach((dependency) => {
      shell.exec("npm install --save " + dependency, { silent: true });
      bar.tick();
    });
  }
  if (devDependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: devDependencies.length,
      width: 20,
    });

    devDependencies.forEach((dependency) => {
      shell.exec("npm install --save-dev " + dependency, { silent: true });
      bar.tick();
    });
  }

  shell.cd("..");
}

function createAngularApp(frontendName: string, dependencies: Array<string>, devDependencies: Array<string>, cssFramework: string) {
  if (!shell.which("ng")) {
    console.log("Installing angular cli...");
    shell.exec("npm install -g @angular/cli", { silent: true });
  }

  console.log("Installing frontend dependencies...");
  // CSS, SCSS, Sass, Less
  const availableCssWithAngular = ["CSS", "SCSS", "Sass", "Less"];
  shell.exec(`echo No | echo Yes | echo ${availableCssWithAngular.includes(cssFramework) ? cssFramework : "CSS"} | ng new ${frontendName}`);

  shell.cd(frontendName);

  if (cssFramework === "tailwindcss") {
    // setup tailwind
  }

  if (dependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: dependencies.length,
      width: 20,
    });
    dependencies.forEach((dependency) => {
      shell.exec("npm install --save " + dependency, { silent: true });
      bar.tick();
    });
  }

  if (devDependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: devDependencies.length,
      width: 20,
    });
    devDependencies.forEach((dependency) => {
      shell.exec("npm install --save-dev " + dependency, { silent: true });
      bar.tick();
    });
  }

  shell.cd("..");
}

function createNodeApp(backendName: string, dependencies: Array<string>, devDependencies: Array<string>, hasTypescript: boolean) {
  shell.mkdir(backendName);
  shell.cd(backendName);
  shell.exec("npm init -y", { silent: true });

  console.log("Installing backend dependencies...");
  if (dependencies.includes("dotenv")) fs.writeFileSync(".env", "PORT=4000\nMONGO_CONNECTION_STRING=<mongo_connection_string>");
  if (dependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: dependencies.length,
      width: 20,
    });

    dependencies.forEach((dependency) => {
      shell.exec("npm install --save " + dependency, { silent: true });
      bar.tick();
    });
  }
  if (devDependencies.length > 0) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: devDependencies.length,
      width: 20,
    });

    devDependencies.forEach((dependency) => {
      shell.exec("npm install --save-dev " + dependency, { silent: true });
      bar.tick();
    });
  }

  if (hasTypescript) {
    const bar = new ProgressBar("[:bar] :current/:total :percent :etas", {
      total: dependencies.length + 1,
      width: 20,
    });

    shell.exec("npm install --save-dev typescript @types/node concurrently", { silent: true });
    bar.tick();
    dependencies.forEach((dependency) => {
      shell.exec("npm install --save-dev @types/" + dependency, { silent: true });
      bar.tick();
    });
    shell.mkdir("src");

    fs.writeFileSync(
      "tsconfig.json",
      JSON.stringify(
        {
          compilerOptions: {
            module: "Node16",
            moduleResolution: "node16",
            target: "ES2020",
            outDir: "dist",
            strict: true,
            declaration: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
          },
          include: ["src/**/*"],
          exclude: ["node_modules", "**/tests/*"],
        },
        null,
        2
      )
    );

    // create index.ts
    const boilerPlate = fs.readFileSync(path.join(__dirname, "./boilerplates/expressts.txt"));
    fs.writeFileSync(`${shell.pwd().toString()}/src/index.ts`, boilerPlate);

    const scripts = {
      start: "nodemon dist/index.js",
      build: "npx tsc",
      dev: 'npm run build && concurrently "npx tsc --watch" "nodemon dist/index.js"',
    };
    if (devDependencies.includes("mocha")) (<any>scripts).test = "mocha";
    if (dependencies.includes("jest")) (<any>scripts).test = "jest";
    addScriptsInPackageJson(`${shell.pwd().toString()}/package.json`, scripts);
  } else {
    // create index.js
    const boilerPlate = fs.readFileSync(path.join(__dirname, "./boilerplates/expressjs.txt"));
    fs.writeFileSync(`${shell.pwd().toString()}/index.js`, boilerPlate);

    const scripts = {
      start: "nodemon index.js",
    };
    if (devDependencies.includes("mocha")) (<any>scripts).test = "mocha";
    if (dependencies.includes("jest")) (<any>scripts).test = "jest";
    addScriptsInPackageJson(`${shell.pwd().toString()}/package.json`, scripts);
  }

  shell.cd("..");
}

function addScriptsInPackageJson(packageJsonPath: string, scripts: any): void {
  // add scripts
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson.scripts = scripts;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function modifyTailwindConfig(filePath: string) {
  const config = require(filePath + "/tailwind.config.js");

  const tailwindContent = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ];

  config.content = tailwindContent;

  fs.writeFileSync(filePath + "/tailwind.config.js", `module.exports = ${JSON.stringify(config, null, 2)};\n`);
}
