#!/usr/bin/env node

const { parseArgs } = require('node:util');
const crypto = require('node:crypto');

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function printHelp() {
  console.log(`
Usage: node index.js [options]

A simple password generator.

Options:
  -l, --length <num>     Password length (default: 16)
  -u, --uppercase        Include uppercase characters
  -s, --special          Include special characters
  --hyphen               Separate password into chunks with hyphens (default chunk size: 4)
  -c, --chunk <num>      Chunk size for hyphen separation (automatically enables hyphens)
  -h, --help             Show this help message

Examples:
  node index.js
  node index.js -l 20 -u -s
  node index.js -l 16 -u -s -c 4
  node index.js --length 12 --uppercase --hyphen
`);
}

function parseCommandLineArgs() {
  const options = {
    length: { type: 'string', short: 'l', default: '16' },
    uppercase: { type: 'boolean', short: 'u', default: false },
    special: { type: 'boolean', short: 's', default: false },
    hyphen: { type: 'boolean', default: false },
    chunk: { type: 'string', short: 'c' },
    help: { type: 'boolean', short: 'h', default: false },
  };

  try {
    const { values } = parseArgs({
      options,
      strict: false,
      allowPositionals: false,
    });
    return values;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function generatePassword(length, useUppercase, useSpecial) {
  const pools = [LOWERCASE, NUMBERS];
  if (useUppercase) pools.push(UPPERCASE);
  if (useSpecial) pools.push(SPECIAL);

  const allChars = pools.join('');
  const chars = [];

  // Guarantee at least one character from each selected pool if length permits
  if (length >= pools.length) {
    for (const pool of pools) {
      chars.push(pool[crypto.randomInt(0, pool.length)]);
    }
  }

  // Fill remaining characters
  while (chars.length < length) {
    chars.push(allChars[crypto.randomInt(0, allChars.length)]);
  }

  // Shuffle using Fisher-Yates
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

function chunkString(str, size) {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks.join('-');
}

function main() {
  const values = parseCommandLineArgs();

  if (values.help) {
    printHelp();
    return;
  }

  const length = parseInt(values.length, 10);
  if (isNaN(length) || length <= 0) {
    console.error('Error: Length must be a positive integer.');
    process.exit(1);
  }

  const useUppercase = Boolean(values.uppercase) && !values['no-uppercase'];
  const useSpecial = Boolean(values.special) && !values['no-special'];

  const useHyphens = Boolean(values.hyphen || values.chunk !== undefined) && !values['no-hyphen'];

  let chunkSize = 4;
  if (values.chunk !== undefined) {
    chunkSize = parseInt(values.chunk, 10);
    if (isNaN(chunkSize) || chunkSize <= 0) {
      console.error('Error: Chunk size must be a positive integer.');
      process.exit(1);
    }
  }

  const rawPassword = generatePassword(length, useUppercase, useSpecial);
  const finalPassword = useHyphens ? chunkString(rawPassword, chunkSize) : rawPassword;

  console.log(finalPassword);
}

main();
