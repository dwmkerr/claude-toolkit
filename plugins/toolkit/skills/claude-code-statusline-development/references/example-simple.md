# Example: Simple Statusline

A minimal statusline showing model name and current directory.

## Script

`~/.claude/statusline.sh`:

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
dir=$(echo "$input" | jq -r '.workspace.current_dir')

echo "[$model] ${dir##*/}"
```

## Output

```
[Opus] my-project
```

## With Colors

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
dir=$(echo "$input" | jq -r '.workspace.current_dir')

# Colors
blue=$(tput setaf 4)
bold=$(tput bold)
reset=$(tput sgr0)

echo "${bold}${blue}[$model]${reset} ${dir##*/}"
```

## Python Version

`~/.claude/statusline.py`:

```python
#!/usr/bin/env python3
import json
import sys
import os

data = json.load(sys.stdin)
model = data['model']['display_name']
current_dir = os.path.basename(data['workspace']['current_dir'])

print(f"[{model}] {current_dir}")
```

## Node.js Version

`~/.claude/statusline.js`:

```javascript
#!/usr/bin/env node
const path = require('path');

let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
    const data = JSON.parse(input);
    const model = data.model.display_name;
    const dir = path.basename(data.workspace.current_dir);
    console.log(`[${model}] ${dir}`);
});
```

## Testing

```bash
echo '{"model":{"display_name":"Opus"},"workspace":{"current_dir":"/home/user/project"}}' | ./statusline.sh
```
