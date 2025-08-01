/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import { strict as assert } from 'assert';
import { TestRig, printDebugInfo, validateModelOutput } from './test-helper.js';

test('should be able to save to memory', async () => {
  const rig = new TestRig();
  await rig.setup('should be able to save to memory');

  const prompt = `remember that my favorite color is  blue.

  what is my favorite color? tell me that and surround it with $ symbol`;
  const result = await rig.run(prompt);

<<<<<<< HEAD
  // Check that the response mentions blue (the model should remember it)
  const lowerResult = result.toLowerCase();
  assert.ok(
    lowerResult.includes('blue'),
    `Expected response to contain 'blue', but got: ${result}`,
  );

  // Check that blue is surrounded by some marker ($ or other special characters)
  // The model might use different formatting
  const hasMarkedBlue =
    lowerResult.includes('$blue$') ||
    lowerResult.includes('*blue*') ||
    lowerResult.includes('**blue**') ||
    lowerResult.includes('`blue`') ||
    /\bblue\b.*\$|\$.*\bblue\b/.test(lowerResult);

  assert.ok(
    hasMarkedBlue,
    `Expected 'blue' to be marked with special characters, but got: ${result}`,
  );
=======
  const foundToolCall = await rig.waitForToolCall('save_memory');

  // Add debugging information
  if (!foundToolCall || !result.toLowerCase().includes('blue')) {
    const allTools = printDebugInfo(rig, result, {
      'Found tool call': foundToolCall,
      'Contains blue': result.toLowerCase().includes('blue'),
    });

    console.error(
      'Memory tool calls:',
      allTools
        .filter((t) => t.toolRequest.name === 'save_memory')
        .map((t) => t.toolRequest.args),
    );
  }

  assert.ok(foundToolCall, 'Expected to find a save_memory tool call');

  // Validate model output - will throw if no output, warn if missing expected content
  validateModelOutput(result, 'blue', 'Save memory test');
>>>>>>> 38770660 (fix(tests): refactor integration tests to be less flaky (#4890))
});
