# Evaluation Frameworks

Open-source and commercial frameworks for implementing agent evaluations.

## Harbor

**Focus:** Running agents in containerized environments at scale.

- Infrastructure for running trials across cloud providers
- Standardized format for defining tasks and graders
- Popular benchmarks (Terminal-Bench 2.0) ship through Harbor registry
- Run established benchmarks alongside custom eval suites

**Website:** [harborframework.com](https://harborframework.com/)

## Promptfoo

**Focus:** Lightweight, flexible, declarative configuration.

- YAML configuration for prompt testing
- Assertion types from string matching to LLM-as-judge
- Open-source
- Used by Anthropic for many product evals

**Website:** [promptfoo.dev](https://www.promptfoo.dev/)

## Braintrust

**Focus:** Offline evaluation + production observability + experiment tracking.

- Iterate during development AND monitor in production
- `autoevals` library with pre-built scorers
- Factuality, relevance, and other common dimensions

**Website:** [braintrust.dev](https://www.braintrust.dev/)

## LangSmith

**Focus:** LangChain ecosystem integration.

- Tracing
- Offline and online evaluations
- Dataset management
- Tight LangChain integration

**Website:** [docs.langchain.com/langsmith/evaluation](https://docs.langchain.com/langsmith/evaluation)

## Langfuse

**Focus:** Self-hosted open-source alternative.

- Similar capabilities to LangSmith
- Self-hosted for data residency requirements
- Open-source

**Website:** [langfuse.com](https://langfuse.com/)

## Choosing a Framework

| Need | Consider |
|------|----------|
| Containerized agents at scale | Harbor |
| Lightweight YAML config | Promptfoo |
| Dev + production monitoring | Braintrust |
| LangChain ecosystem | LangSmith |
| Self-hosted / data residency | Langfuse |

## Framework vs Custom

Many teams:
- Combine multiple tools
- Roll their own framework
- Start with simple evaluation scripts

**Key insight:** Frameworks are only as good as the eval tasks you run through them.

**Recommendation:**
1. Quickly pick a framework that fits your workflow
2. Invest energy in the evals themselves
3. Iterate on high-quality test cases and graders

## Holistic Understanding

Automated evals are one of many methods:

| Method | Stage | Use |
|--------|-------|-----|
| Automated evals | Pre-launch, CI/CD | First line of defense |
| Production monitoring | Post-launch | Detect drift, real-world failures |
| A/B testing | Sufficient traffic | Validate significant changes |
| User feedback | Ongoing | Fill gaps, surface unknowns |
| Transcript review | Weekly | Build intuition, catch subtle issues |
| Human studies | Periodic | Calibrate LLM graders |

No single layer catches every issue. Combine methods like the Swiss Cheese Model from safety engineering.
