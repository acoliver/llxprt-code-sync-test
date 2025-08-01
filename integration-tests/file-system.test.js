/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { strict as assert } from 'assert';
import { test } from 'node:test';
<<<<<<< HEAD
import { TestRig } from './test-helper.js';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
=======
import { TestRig, printDebugInfo, validateModelOutput } from './test-helper.js';
>>>>>>> 38770660 (fix(tests): refactor integration tests to be less flaky (#4890))

test('should be able to read a file', async () => {
  const rig = new TestRig();
  await rig.setup('should be able to read a file');
  rig.createFile('test.txt', 'hello world');

  const result = await rig.run(
    `read the file test.txt and show me its contents`,
  );

  const foundToolCall = await rig.waitForToolCall('read_file');

  // Add debugging information
  if (!foundToolCall || !result.includes('hello world')) {
    printDebugInfo(rig, result, {
      'Found tool call': foundToolCall,
      'Contains hello world': result.includes('hello world'),
    });
  }

  assert.ok(foundToolCall, 'Expected to find a read_file tool call');

  // Validate model output - will throw if no output, warn if missing expected content
  validateModelOutput(result, 'hello world', 'File read test');
});

test('should be able to write a file', async () => {
  const rig = new TestRig();
  await rig.setup('should be able to write a file');
  rig.createFile('test.txt', '');

<<<<<<< HEAD
  // Debug: log the test directory
  console.log('Test directory:', rig.testDir);
  console.log('Working directory:', process.cwd());

  const output = rig.run(`edit test.txt to have a hello world message`);
  console.log('CLI output:', output);

  // Check if any files were created in the test directory
  const files = readdirSync(rig.testDir);
  console.log('Files in test directory:', files);
  for (const file of files) {
    const content = readFileSync(join(rig.testDir, file), 'utf-8');
    console.log(`File ${file} content:`, JSON.stringify(content));
  }

  // Debug: check if file exists and what's in it
  const expectedPath = join(rig.testDir, 'test.txt');
  console.log('Expected file path:', expectedPath);
  console.log('File exists:', existsSync(expectedPath));

  const fileContent = rig.readFile('test.txt');
  console.log('File content:', JSON.stringify(fileContent));
  console.log('File length:', fileContent.length);

  assert.ok(fileContent.toLowerCase().includes('hello'));
=======
  const result = await rig.run(`edit test.txt to have a hello world message`);

  // Accept multiple valid tools for editing files
  const foundToolCall = await rig.waitForAnyToolCall([
    'write_file',
    'edit',
    'replace',
  ]);

  // Add debugging information
  if (!foundToolCall) {
    printDebugInfo(rig, result);
  }

  assert.ok(
    foundToolCall,
    'Expected to find a write_file, edit, or replace tool call',
  );

  // Validate model output - will throw if no output
  validateModelOutput(result, null, 'File write test');

  const fileContent = rig.readFile('test.txt');

  // Add debugging for file content
  if (!fileContent.toLowerCase().includes('hello')) {
    const writeCalls = rig
      .readToolLogs()
      .filter((t) => t.toolRequest.name === 'write_file')
      .map((t) => t.toolRequest.args);

    printDebugInfo(rig, result, {
      'File content mismatch': true,
      'Expected to contain': 'hello',
      'Actual content': fileContent,
      'Write tool calls': JSON.stringify(writeCalls),
    });
  }

  assert.ok(
    fileContent.toLowerCase().includes('hello'),
    'Expected file to contain hello',
  );

  // Log success info if verbose
  if (process.env.VERBOSE === 'true') {
    console.log('File written successfully with hello message.');
  }
>>>>>>> 38770660 (fix(tests): refactor integration tests to be less flaky (#4890))
});
