#!/usr/bin/env -S deno run --quiet --allow-read
/**
 * @file qpass.ts
 * @brief Provide a choice of passwords based on three letter words and different marks.
 *
 * @author     simon rowe <simon@wiremoons.com>
 * @license    open-source released under "MIT Licence"
 * @source     https://github.com/wiremoons/qpass
 *
 * @date originally created: 30 July 2023
 * @date updated significantly:
 *
 * @details Provide a choice of passwords based on three letter words and different marks.
 * Application is written in TypeScript for use with the Deno runtime: https://deno.land/
 *
 * @note The program can be run with Deno using the command:
 * @code deno run --quiet --allow-read
 * @note The program can be installed to 'DENO_INSTALL_ROOT' to using the command:
 * @code deno install -f --quiet --allow-read qpass.ts
 * @note The program can be compiled using the command:
 * @code deno compile --quiet --allow-read qpass.ts
 */

//--------------------------------
// MODULE IMPORTS
//--------------------------------

// Deno stdlib imports
import { parse } from "https://deno.land/std@0.195.0/flags/mod.ts";
import { basename } from "https://deno.land/std@0.195.0/path/mod.ts";
import { bold } from "https://deno.land/std@0.195.0/fmt/colors.ts";

// Other imports
import { cliVersion } from "https://deno.land/x/deno_mod@0.8.1/mod.ts";

//--------------------------------
// GLOBAL DECLARATIONS
//--------------------------------

// CLI VERSION OPTIONS DECLARATION

/** define options for `cliVersion()` function for application version data */
const versionOptions = {
  version: "0.0.1",
  copyrightName: "Simon Rowe",
  licenseUrl: "https://github.com/wiremoons/qpass/",
  crYear: "2023",
};

/** Define the command line argument switches and options that can be used */
const cliOpts = {
  default: { h: false, v: false },
  alias: { h: "help", v: "version" },
  stopEarly: true,
  //unknown: showUnknown,
};

//--------------------------------
// COMMAND LINE ARGS FUNCTIONS
//--------------------------------

/** obtain any command line arguments and exec them as needed */
async function execCliArgs() {
  //console.log(parse(Deno.args,cliOpts));
  const cliArgs = parse(Deno.args, cliOpts);

  if (cliArgs.help) {
    printHelp();
    Deno.exit(0);
  }

  if (cliArgs.version) {
    await printVersionInfo();
    Deno.exit(0);
  }
}

/** Function defined in `cliOpts` so is run automatically by `parse()` if an unknown
 * command line option is given by the user.
 * @code showUnknown(arg: string, k?: string, v?: unknown)
 */
// function showUnknown(arg: string) {
//   console.error(`\nERROR: Unknown argument: '${arg}'`);
//   printHelp();
//   Deno.exit(1);
// }

//--------------------------------
// UTILITY FUNCTIONS
//--------------------------------

/**
 * Type Guard for DamtInterface interface object
 */
//// deno-lint-ignore no-explicit-any
// function isObject(arg: any): arg is DamtInterface {
//   return arg !== undefined;
// }

//--------------------------------
// APPLICATION FUNCTIONS
//--------------------------------

/** Return the name of the currently running program without the path included. */
function getAppName(): string {
  return `${basename(Deno.mainModule) ?? "UNKNOWN"}`;
}

// /** Check environment variable 'ACRODB' for a valid filename */
// async function getDBEnv(): Promise<string | undefined> {
//   const dbFile = Deno.env.get("ACRODB") || "";
//   return await existsFile(dbFile) ? dbFile : undefined;
// }

//--------------------------------
// DISPLAY INFO FUNCTIONS
//--------------------------------

/** Display application version information when requested */
async function printVersionInfo() {
  const versionData = await cliVersion(versionOptions);
  console.log(versionData);
}

/** Display application help when requested  */
function printHelp() {
  console.log(`
Provide a choice of passwords based on three letter words and different marks.

Usage: ${bold(getAppName())} [switches] [arguments]

[Switches]       [Arguments]   [Default Value]   [Description]
-h, --help                          false        display help information
-v, --version                       false        display program version
`);
}

//----------------------------------------------------------------
// MAIN : Deno script execution start
//----------------------------------------------------------------

if (import.meta.main) {
  // only returns if execCliArgs() did not find options to execute
  if (Deno.args.length > 0) await execCliArgs();

  await printVersionInfo();
  printHelp();
}
