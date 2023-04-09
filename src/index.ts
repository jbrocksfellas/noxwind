#! /usr/bin/env node

import * as utils from "./utils.js";
import { questions } from "./questions.js";
import shell from "shelljs";
import fs from "fs";
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
      createAngularApp(frontendName);
      createNodeApp(backendName, ["express", "mongoose", "dotenv", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
    } else if (stack === "MERN Stack") {
      const frontendStack = utils.findFrontendFramework(stack);
      const template = utils.findViteTemplate(frontendStack, isTypescript);

      createViteApp(frontendName, template, [...answers.additional_frontend_packages], frontendDevDependencies);
      createNodeApp(backendName, ["express", "mongoose", "dotenv", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
    } else if (stack === "MEVN Stack") {
      const frontendStack = utils.findFrontendFramework(stack);
      const template = utils.findViteTemplate(frontendStack, isTypescript);

      createViteApp(frontendName, template, [...answers.additional_frontend_packages], frontendDevDependencies);
      createNodeApp(backendName, ["express", "mongoose", "dotenv", ...answers.additional_backend_packages], backendDevDependencies, isTypescript);
    } else {
      const stackType = answers.stackType;
      if (stackType === "frontend") {
        const frontendStack = answers.frontend_stack;
        if (frontendStack === "Next.js") {
          const hasTypeScript = language === "typescript";
          const hasTailwind = true;
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
        } else if (frontendStack === "React") {
        } else if (frontendStack === "Vue") {
        } else if (frontendStack === "Angular") {
        } else {
        }
      } else if (stackType === "backend") {
        const backendStack = answers.backend_stack;

        if (backendStack === "Express.js") {
          createNodeApp(backendName, ["express", "dotenv", ...answers.additional_backend_packages, answers.database], backendDevDependencies, isTypescript);
        }
      } else {
        const frontendStack = answers.frontend_stack;
        const backendStack = answers.backend_stack;

        if (frontendStack === "Next.js") {
          const hasTypeScript = language === "typescript";
          const hasTailwind = true;
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
        } else if (frontendStack === "React") {
        } else if (frontendStack === "Vue") {
        } else if (frontendStack === "Angular") {
        } else {
        }

        if (backendStack === "Express.js") {
          createNodeApp(backendName, ["express", "dotenv", ...answers.additional_backend_packages, answers.database], backendDevDependencies, isTypescript);
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

  shell.exec(command);

  shell.cd(frontendName);
  if (devDependencies.length > 0) {
    shell.exec("npm install --save-dev " + devDependencies.join(" "));
  }
  shell.cd("..");
}

function createViteApp(frontendName: string, template: string, dependencies: Array<string>, devDependencies: Array<string>) {
  // templates: vanilla, vanilla-ts, vue, vue-ts, react, react-ts, react-swc, react-swc-ts, preact, preact-ts, lit, lit-ts, svelte, svelte-ts
  let command = `npm create vite@latest -y ${frontendName}`;
  npmVersion > 7 ? (command += ` -- --template ${template}`) : ` --template ${template}`;

  shell.exec(command);
  shell.cd(frontendName);
  shell.exec("npm install");
  if (dependencies.length > 0) shell.exec("npm install --save " + dependencies.join(" "));
  if (devDependencies.length > 0) shell.exec("npm install --save-dev " + devDependencies.join(" "));

  shell.cd("..");
}

function createAngularApp(frontendName: string) {}

function createNodeApp(backendName: string, dependencies: Array<string>, devDependencies: Array<string>, hasTypescript: boolean) {
  shell.mkdir(backendName);
  shell.cd(backendName);
  shell.exec("npm init -y");

  if (dependencies.includes("dotenv")) fs.writeFileSync(".env", "PORT=4000");
  if (dependencies.length > 0) shell.exec("npm install --save " + dependencies.join(" "));
  if (devDependencies.length > 0) shell.exec("npm install --save-dev " + devDependencies.join(" "));

  if (hasTypescript) {
    let typesModules = "";
    dependencies.forEach((dependency) => {
      typesModules += " @types/" + dependency;
    });
    shell.exec("npm install --save-dev " + "typescript @types/node" + typesModules);
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
  } else {
    // create index.js
    const boilerPlate = fs.readFileSync(path.join(__dirname, "./boilerplates/expressjs.txt"));
    fs.writeFileSync(`${shell.pwd().toString()}/index.js`, boilerPlate);
  }

  shell.cd("..");
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
