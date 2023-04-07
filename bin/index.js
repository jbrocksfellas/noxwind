#! /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { questions } from "./questions.js";
const log = console.log;
const yes = yargs(hideBin(process.argv)).argv.y;
const command = yargs(hideBin(process.argv)).argv._[0];
log(command);
if (command === "init") {
    questions()
        .then((ans) => console.log(ans))
        .catch((err) => console.log(err));
}
