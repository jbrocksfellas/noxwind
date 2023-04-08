#! /usr/bin/env node

import * as utils from "./utils.js";
import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import { questions } from "./questions.js";
import shell from "shelljs";
import fs from "fs";

const npmVersion = parseFloat(shell.exec("npm -v", { silent: true }).stdout.trim());

questions()
  .then((answers) => {
    // console.log(answers);

    const projectName = answers.project_name;
    const language = answers.language;
    const stack = answers.stack;
    const isTypescript = language === "typescript";

    // console.log(shell.pwd().toString());

    // project setup
    shell.mkdir("p1");
    shell.cd(projectName);

    const frontendName = `${projectName}-frontend`;
    const backendName = `${projectName}-backend`;

    const backendDevDependencies: Array<string> = ["nodemon"];

    if (stack === "MEAN Stack") {
      createAngularApp(frontendName);
      createNodeApp(backendName, ["express", ...answers.additional_backend_packages], backendDevDependencies);
    } else if (stack === "MERN Stack") {
      const frontendStack = utils.findFrontendFramework(stack);
      const template = utils.findViteTemplate(frontendStack, isTypescript);

      createViteApp(frontendName, template, [...answers.additional_frontend_packages], []);
      createNodeApp(backendName, ["express", ...answers.additional_backend_packages], backendDevDependencies);
    } else if (stack === "MEVN Stack") {
      const frontendStack = utils.findFrontendFramework(stack);
      const template = utils.findViteTemplate(frontendStack, isTypescript);

      createViteApp(frontendName, template, [...answers.additional_frontend_packages], []);
      createNodeApp(backendName, ["express", ...answers.additional_backend_packages], backendDevDependencies);
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

          createNextApp(frontendName, hasTypeScript, hasTailwind, hasEsLint, hasSrcDirectory, hasExperimentalAppDirectory, importAlias);
        } else if (frontendStack === "React") {
        } else if (frontendStack === "Vue") {
        } else if (frontendStack === "Angular") {
        } else {
        }
      } else if (stackType === "backend") {
        const backendStack = answers.backend_stack;

        if (backendStack === "Express.js") {
          createNodeApp(backendName, ["express", ...answers.additional_backend_packages], backendDevDependencies);
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

          createNextApp(frontendName, hasTypeScript, hasTailwind, hasEsLint, hasSrcDirectory, hasExperimentalAppDirectory, importAlias);
        } else if (frontendStack === "React") {
        } else if (frontendStack === "Vue") {
        } else if (frontendStack === "Angular") {
        } else {
        }

        if (backendStack === "Express.js") {
          createNodeApp(backendName, ["express", ...answers.additional_backend_packages], backendDevDependencies);
        }
      }
    }
  })
  .catch((err) => console.log(err));

function init(projectName: string, language: string, stack: string, backendDependencies: Array<string>, frontendDependencies: Array<string>) {
  // const backendDependencies: Array<string> = ["cors", "jsonwebtoken", "multer", "express"];
}

function createNextApp(
  frontendName: string,
  hasTypeScript: boolean,
  hasTailwind: boolean,
  hasEsLint: boolean,
  hasExperimentalAppDirectory: boolean,
  hasSrcDirectory: boolean,
  importAlias: string
) {
  let command = `npx create-next-app@latest ${frontendName}`;

  hasTypeScript ? (command += " --ts") : (command += " --js");
  hasTailwind ? (command += " --tailwind") : (command += " --no-tailwind");
  if (hasEsLint) command += " --eslint";
  if (hasExperimentalAppDirectory) command += " --experimental-app";
  if (hasSrcDirectory) command += " --src-dir";
  command += " --import-alias " + importAlias;

  shell.exec(command);
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

function createNodeApp(backendName: string, dependencies: Array<string>, devDependencies: Array<string>) {
  shell.mkdir(backendName);
  shell.cd(backendName);
  shell.exec("npm init -y");
  if (dependencies.length > 0) shell.exec("npm install --save " + dependencies.join(" "));
  if (devDependencies.length > 0) shell.exec("npm install --save-dev " + devDependencies.join(" "));

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
