# Skill Categories & Patterns

Source: [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) - Anthropic

---

## Skill Categories

Before building, identify which category your skill falls into. This determines which techniques to use.

### Category 1: Document & Asset Creation

Creates consistent, high-quality output (documents, presentations, code, designs).

**Techniques:**
- Embedded style guides and brand standards
- Template structures for consistent output
- Quality checklists before finalizing
- No external tools required — uses Claude's built-in capabilities

**Example:** `frontend-design` — "Create distinctive, production-grade frontend interfaces with high design quality."

### Category 2: Workflow Automation

Multi-step processes that benefit from consistent methodology.

**Techniques:**
- Step-by-step workflow with validation gates
- Templates for common structures
- Built-in review and improvement suggestions
- Iterative refinement loops

**Example:** `skill-creator` — "Interactive guide for creating new skills. Walks the user through use case definition, frontmatter generation, instruction writing, and validation."

### Category 3: MCP Enhancement

Workflow guidance layered on top of MCP tool access.

**Techniques:**
- Coordinates multiple MCP calls in sequence
- Embeds domain expertise
- Provides context users would otherwise need to specify
- Error handling for common MCP issues

**Example:** `sentry-code-review` — "Automatically analyzes and fixes detected bugs in GitHub Pull Requests using Sentry's error monitoring data via their MCP server."

---

## Five Reusable Patterns

### Pattern 1: Sequential Workflow Orchestration

**Use when:** Users need multi-step processes in a specific order.

```markdown
## Workflow: Onboard New Customer

### Step 1: Create Account
Call MCP tool: `create_customer`
Parameters: name, email, company

### Step 2: Setup Payment
Call MCP tool: `setup_payment_method`
Wait for: payment method verification

### Step 3: Create Subscription
Call MCP tool: `create_subscription`
Parameters: plan_id, customer_id (from Step 1)
```

**Key techniques:**
- Explicit step ordering
- Dependencies between steps
- Validation at each stage
- Rollback instructions for failures

### Pattern 2: Multi-MCP Coordination

**Use when:** Workflows span multiple services.

```markdown
### Phase 1: Design Export (Figma MCP)
1. Export design assets
2. Generate design specifications

### Phase 2: Asset Storage (Drive MCP)
1. Create project folder
2. Upload all assets

### Phase 3: Task Creation (Linear MCP)
1. Create development tasks
2. Attach asset links
```

**Key techniques:**
- Clear phase separation
- Data passing between MCPs
- Validation before moving to next phase
- Centralized error handling

### Pattern 3: Iterative Refinement

**Use when:** Output quality improves with iteration.

```markdown
### Initial Draft
1. Fetch data, generate first draft

### Quality Check
1. Run validation: `scripts/check_report.py`
2. Identify issues (missing sections, formatting, data errors)

### Refinement Loop
1. Address each issue
2. Regenerate affected sections
3. Re-validate
4. Repeat until quality threshold met
```

**Key techniques:**
- Explicit quality criteria
- Validation scripts
- Know when to stop iterating

### Pattern 4: Context-Aware Tool Selection

**Use when:** Same outcome, different tools depending on context.

```markdown
### Decision Tree
1. Check file type and size
2. Determine best approach:
   - Large files (>10MB): cloud storage MCP
   - Collaborative docs: Notion/Docs MCP
   - Code files: GitHub MCP

### Execute
Based on decision, call appropriate tool

### Explain
Tell the user why that approach was chosen
```

**Key techniques:**
- Clear decision criteria
- Fallback options
- Transparency about choices

### Pattern 5: Domain-Specific Intelligence

**Use when:** The skill adds specialized knowledge beyond tool access.

```markdown
### Before Processing (Validation)
1. Fetch details via MCP
2. Apply domain rules (compliance, standards, etc.)
3. Document decision

### Processing
IF validation passed: proceed
ELSE: flag for review

### Audit Trail
Log all checks and decisions
```

**Key techniques:**
- Domain expertise embedded in logic
- Validation before action
- Comprehensive audit trail

---

## Choosing a Pattern

| Scenario | Pattern |
|----------|---------|
| Fixed sequence of steps | Sequential Workflow |
| Multiple services involved | Multi-MCP Coordination |
| Quality improves with rounds | Iterative Refinement |
| Different tools for different inputs | Context-Aware Selection |
| Specialized knowledge required | Domain-Specific Intelligence |

Most skills use one primary pattern but may combine elements from others.
