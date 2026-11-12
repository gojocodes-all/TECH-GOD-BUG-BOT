"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
    listJavaScriptFiles,
    parseMode
} = require("../scripts/validate");

function writeFixture(rootDir, relativePath) {
    const absolutePath = path.join(rootDir, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, "module.exports = true;\n");
}

test("discovers JavaScript deterministically and skips generated working directories", (context) => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "tech-god-validation-"));
    context.after(() => fs.rmSync(rootDir, { force: true, recursive: true }));

    writeFixture(rootDir, "zeta.js");
    writeFixture(rootDir, "nested/alpha.js");
    writeFixture(rootDir, "nested/readme.md");
    writeFixture(rootDir, ".git/ignored.js");
    writeFixture(rootDir, "coverage/ignored.js");
    writeFixture(rootDir, "docs/ignored.js");
    writeFixture(rootDir, "node_modules/ignored.js");

    assert.deepEqual(listJavaScriptFiles(rootDir), ["nested/alpha.js", "zeta.js"]);
});

test("covers every maintained JavaScript surface in the current snapshot", () => {
    const rootDir = path.resolve(__dirname, "..");
    const files = listJavaScriptFiles(rootDir);

    for (const expectedPath of [
        "engine-requirements.js",
        "lib/index.js",
        "scripts/validate.js",
        "test/make-ordered-dictionary.test.js",
        "test/validate-repository.test.js",
        "WAProto/index.js"
    ]) {
        assert.equal(files.includes(expectedPath), true, expectedPath);
    }

    assert.equal(files.length >= 99, true);
});

test("accepts only one documented validation mode", () => {
    assert.equal(parseMode([]), "all");
    assert.equal(parseMode(["--syntax-only"]), "syntax");
    assert.equal(parseMode(["--tests-only"]), "tests");
    assert.throws(() => parseMode(["--unknown"]), /Unknown validation option/);
    assert.throws(
        () => parseMode(["--syntax-only", "--tests-only"]),
        /Choose at most one validation mode/
    );
});
