import * as Kumo from "@mkellsy/mitsubishi-kumo-client";

import Inquirer from "inquirer";

import { Logger } from "./Logger";
import { program } from "commander";

const log = Logger.log;

/*
 * Adds the debug option to the CLI.
 */
program.option("-d, --debug", "enable debug logging");

/*
 * Defines the pairing tool in the CLI.
 */
program.command("login").action(() => {
    Logger.configure(program);

    Inquirer.prompt([
        {
            type: "input",
            message: "Enter your Kumno Cloud username",
            name: "username",
        },
        {
            type: "password",
            message: "Enter your Kumo Cloud password",
            name: "password",
            mask: "*",
        },
    ])
        .then((answers) => Kumo.authenticate(answers.username, answers.password))
        .catch((error) => log.error(error.message));
});

/**
 * Exports the CLI main entry point.
 *
 * @param args (optional) A reference to the command line arguments.
 * @public
 */
export = function main(args?: string[] | undefined): void {
    program.parse(args || process.argv);
};
