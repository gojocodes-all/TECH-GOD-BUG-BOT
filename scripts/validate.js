"use strict";

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

require("../engine-requirements");

const IGNORED_DIRECTORIES = new Set([
    ".git",
    "coverage",
    "docs",
    "node_modules"
]);

function listJavaScriptFiles(rootDir) {
    const files = [];

    function visit(directory) {
        const entries = fs.readdirSync(directory, { withFileTypes: true })
            .sort((left, right) => left.name.localeCompare(right.name, "en"));

        for (const entry of entries) {
            if (entry.isSymbolicLink()) {
                continue;
            }

            const absolutePath = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                if (!IGNORED_DIRECTORIES.has(entry.name)) {
                    visit(absolutePath);
                }
                continue;
            }

            if (entry.isFile() && entry.name.endsWith(".js")) {
                files.push(path.relative(rootDir, absolutePath).split(path.sep).join("/"));
            }
        }
    }

    visit(rootDir);
    return files;
}

function runSyntaxChecks(rootDir, files) {
    for (const file of files) {
        const result = spawnSync(process.execPath, ["--check", file], {
            cwd: rootDir,
            encoding: "utf8"
        });

        if (result.error) {
            throw result.error;
        }

        if (result.status !== 0) {
            process.stdout.write(result.stdout || "");
            process.stderr.write(result.stderr || "");
            console.error(`Syntax validation failed for ${file}.`);
            return false;
        }
    }

    console.log(`Syntax checked ${files.length} JavaScript files.`);
    return true;
}

function runTests(rootDir, files) {
    const testFiles = files.filter((file) => /^test\/.*\.test\.js$/.test(file));

    if (testFiles.length === 0) {
        console.error("No supported Node.js test files were found.");
        return false;
    }

    const result = spawnSync(process.execPath, ["--test", ...testFiles], {
        cwd: rootDir,
        stdio: "inherit"
    });

    if (result.error) {
        throw result.error;
    }

    return result.status === 0;
}

function parseMode(argumentsList) {
    const supportedFlags = new Set(["--syntax-only", "--tests-only"]);
    const unknownFlag = argumentsList.find((argument) => !supportedFlags.has(argument));

    if (unknownFlag) {
        throw new Error(`Unknown validation option: ${unknownFlag}`);
    }

    if (argumentsList.includes("--syntax-only") && argumentsList.includes("--tests-only")) {
        throw new Error("Choose at most one validation mode.");
    }

    if (argumentsList.includes("--syntax-only")) {
        return "syntax";
    }

    if (argumentsList.includes("--tests-only")) {
        return "tests";
    }

    return "all";
}

function main() {
    const rootDir = path.resolve(__dirname, "..");
    const mode = parseMode(process.argv.slice(2));
    const files = listJavaScriptFiles(rootDir);

    if (mode !== "tests" && !runSyntaxChecks(rootDir, files)) {
        return 1;
    }

    if (mode !== "syntax" && !runTests(rootDir, files)) {
        return 1;
    }

    return 0;
}

if (require.main === module) {
    try {
        process.exitCode = main();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
}

module.exports = {
    IGNORED_DIRECTORIES,
    listJavaScriptFiles,
    parseMode
};
