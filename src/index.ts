#! /usr/bin/env node

import * as utils from "./utils.js";
import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import { questions } from "./questions.js";

const log = console.log;

const yes = (<any>yargs(hideBin(process.argv)).argv).y;

const command = (<any>yargs(hideBin(process.argv)).argv)._[0];
log(command);

if (command === "init") {
  questions()
    .then((ans) => console.log(ans))
    .catch((err) => console.log(err));
}
