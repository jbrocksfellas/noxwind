#! /usr/bin/env node

import * as utils from "./utils.js";
import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import { questions } from "./questions.js";
import shell from "shelljs";
import fs from "fs";

const log = console.log;

const yes = (<any>yargs(hideBin(process.argv)).argv).y;

const command = (<any>yargs(hideBin(process.argv)).argv)._[0];
log(command);

if (command === "init") {
  questions()
    .then((ans) => console.log(ans))
    .catch((err) => console.log(err));
}

if (command === "create") {
  const projectName = "p1";

  const hasTypeScript = true;
  const hasTailwind = true;
  const hasEsLint = true;
  const hasSrcDirectory = true;
  const hasExperimentalAppDirectory = true;
  const importAlias = "@/";

  console.log(shell.pwd().toString());

  shell.mkdir("p1");
  shell.cd(projectName);

  const frontendName = `${projectName}-frontend`;
  const backendName = `${projectName}-backend`;

  const backendDependencies: Array<string> = ["cors", "jsonwebtoken", "multer", "express"];
  const backendDevDependencies: Array<string> = ["nodemon"];

  createNextApp(frontendName, hasTypeScript, hasTailwind, hasEsLint, hasSrcDirectory, hasExperimentalAppDirectory, importAlias);
  createNodeApp(backendName, backendDependencies, backendDevDependencies);
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
