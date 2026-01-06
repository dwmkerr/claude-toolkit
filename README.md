# claude-toolkit

General purpose Claude Code plugins for introspection and debugging.

## Quickstart

Add the marketplace, install the plugins:

```
/plugin marketplace add dwmkerr/claude-toolkit
/plugin install skills@claude-toolkit
/plugin install agents@claude-toolkit
```

For local development, clone and move to the repo:

```bash
# Clone and go to the repo.
git clone https://github.com/dwmkerr/claude-toolkit.git
cd claude-tooklit
```

Then install the local marketplace repo and plugins:

```
/plugin marketplace add ./
/plugin install skills@claude-toolkit
/plugin install agents@claude-toolkit
```

If you make changes and want to quickly update, run `make bump` which will increase the 'rc' version (release candidate), then:

```
# Lol, please upvote this issue so that the below could work!
# https://github.com/anthropics/claude-code/issues/11676
/plugin update skills@claude-toolkit
/plugin update agents@claude-toolkit
```

Uninstall if needed:

```
/plugin marketplace remove claude-toolkit
```

## Plugins

### skills

Introspect skill invocations in your Claude Code session.

| Command | Description |
|---------|-------------|
| `/skills:history` | Show skills invoked this session |

Example output:

```
| Time     | Skill              | Invoker        | Triggered By                    |
|----------|--------------------|----------------|---------------------------------|
| 09:23:15 | typescript-dev     | main           | "fix the type errors in..."     |
| 09:31:45 | technical-writing  | researcher     | "research how to document..."   |
```

### agents

Introspect agent invocations in your Claude Code session.

| Command | Description |
|---------|-------------|
| `/agents:history` | Show agents spawned this session |

Example output:

```
| Time     | Agent              | Task                          | Triggered By                    |
|----------|--------------------|-------------------------------|---------------------------------|
| 09:23:15 | researcher         | Research Claude plugins       | "are there github repos..."     |
| 10:15:02 | claude-code-guide  | Check install conventions     | "is this idiomatic..."          |
```

## Local development


## License

MIT
