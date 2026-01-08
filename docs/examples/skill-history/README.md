# Skill History

Track which skills Claude invokes during a session.

```
/toolkit:skill-history
```

Claude sometimes misses skills or invokes unexpected ones. Without visibility, debugging is difficult. In the example below Claude Code clearly missed the skill call for 'chainsaw' before it was explicitly prompted:

![Claude misses a skill](./skill-miss.png)

You can use the `/toolkit:skill-history` command to check what skills have actually been run, and in response to what messages:

![Skill history output](./skill-history.png)

A shell script [`grepsession.sh`](../../../plugins/toolkit/scripts/grepsession.sh) is used to consistently find skill calls without blowing tokens - this provides enough context for Claude to look at adjacent messages from the session log if needed. Without this script it can take many iterations for Claude to find the right session log, and it will fill up context trying to do so.

## See Also

- `/toolkit:agent-history` - Track agent spawns
