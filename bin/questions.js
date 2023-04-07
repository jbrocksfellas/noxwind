import inquirer from "inquirer";
const questions = async function () {
    try {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "project_name",
                message: "Enter your project name",
                validate(value) {
                    if (value)
                        return true;
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
        ]);
        return answers;
    }
    catch (err) {
        throw err;
    }
};
export { questions };
