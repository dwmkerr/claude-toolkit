# Roadmap: Zero to Great Evals

Field-tested advice for going from no evals to evals you can trust.

## Step 0: Start Early

Don't wait for hundreds of tasks. Start with 20-50 simple tasks from real failures.

**Why early:**
- Early changes have large, noticeable effects
- Small sample sizes suffice initially
- Evals get harder to build the longer you wait
- Product requirements naturally translate to test cases

## Step 1: Start with Manual Checks

Begin with behaviors you already verify manually:
- Checks run before each release
- Common tasks end users try
- Bug tracker and support queue issues

**Prioritize by user impact** - invest effort where it counts.

## Step 2: Write Unambiguous Tasks

A good task: two domain experts would independently reach the same pass/fail verdict.

**Requirements:**
- Task is passable by an agent following instructions correctly
- Everything the grader checks is clear from task description
- No failing due to ambiguous specs

**Create reference solutions:**
- Known-working output that passes all graders
- Proves task is solvable
- Verifies graders are correctly configured

**Red flag:** 0% pass rate across many trials (0% pass@100) usually means broken task, not incapable agent.

## Step 3: Build Balanced Problem Sets

Test both where behavior SHOULD and SHOULDN'T occur.

**Example - Web search:**
- Queries where model should search (weather)
- Queries where it should use existing knowledge (who founded Apple?)

One-sided evals create one-sided optimization.

## Step 4: Build Robust Eval Harness

**Requirements:**
- Agent in eval functions like production agent
- Environment doesn't introduce noise
- Each trial starts from clean environment
- No shared state between runs (files, cache, resources)

**Watch for:**
- Correlated failures from infrastructure flakiness
- Artificially inflated performance from shared state
- Agent gaining unfair advantage (e.g., reading git history from previous trials)

## Step 5: Design Graders Thoughtfully

1. **Choose deterministic graders where possible**
2. **Use LLM graders where necessary**
3. **Use human graders for validation**

**Principles:**
- Grade what agent produced, not path it took
- Build in partial credit for multi-component tasks
- Give LLM judges "Unknown" option to avoid hallucinations
- Create clear, structured rubrics per dimension
- Make graders resistant to bypasses/hacks

**Calibrate model graders:**
- Compare with human experts
- Adjust when divergence detected
- Once robust, human review only occasionally

## Step 6: Check the Transcripts

You won't know if graders work without reading transcripts and grades.

**What to look for:**
- Did agent make genuine mistake or did grader reject valid solution?
- Key details about agent and eval behavior
- Failures should seem fair - clear what went wrong

**Critical skill:** Reading transcripts verifies eval measures what matters.

## Step 7: Monitor for Capability Eval Saturation

**Eval saturation:** Agent passes all solvable tasks, no room for improvement.

**Signs:**
- Scores at or near 100%
- Progress appears to slow
- Large capability improvements show as small score increases

**Response:**
- Graduate saturated capability evals to regression suite
- Develop new, harder capability evals
- Don't take scores at face value - dig into details

## Step 8: Maintain Long-Term

An eval suite needs ongoing attention and clear ownership.

**Effective approach:**
- Dedicated evals team owns core infrastructure
- Domain experts and product teams contribute tasks
- Product teams run evaluations themselves

**Eval-driven development:**
1. Build evals to define planned capabilities
2. Iterate until agent performs well
3. When new model drops, run suite to see which bets paid off

**Enable contribution:**
- PMs, CSMs, salespeople can contribute eval tasks
- Use Claude Code to submit PRs
- People closest to users best positioned to define success
