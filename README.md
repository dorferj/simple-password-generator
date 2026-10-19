# Simple Password Generator

A lightweight, zero-dependency command-line password generator written in Node.js.

## Usage

```bash
node index.js [options]
```

### Options

| Option | Alias | Description | Default |
| --- | --- | --- | --- |
| `--length` | `-l` | Length of the password | `16` |
| `--uppercase` | `-u` | Include uppercase characters (`A-Z`) | `false` |
| `--special` | `-s` | Include special characters (`!@#$%...`) | `false` |
| `--hyphen` | | Separate password into chunks with hyphens | `false` |
| `--chunk` | `-c` | Chunk size (automatically enables hyphens) | `4` |
| `--help` | `-h` | Display usage and options | |

### Examples

```bash
# Default password (16 characters, lowercase + digits)
node index.js

# 20-character password with uppercase and special characters
node index.js -l 20 -u -s

# 16-character password split into chunks of 4 separated by hyphens
node index.js -l 16 -u -s -c 4

# 12-character password with uppercase and default chunking
node index.js --length 12 --uppercase --hyphen
```
