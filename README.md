# Cube

**An AI payment agent that spends money on its own, but only inside rules a human sets.**

Built for the NEAR autonomous payments hackathon ("money with a mind of its own").

## The problem

Autonomous agents need to pay for things (data, subscriptions, services) without a human approving every transaction. But an agent with an open wallet is dangerous: a bug, a bad prompt, or a compromised credential can drain it.

## What Cube does

Cube gives an agent a budget and a rulebook. Before every payment the agent checks:

- **Allowlist:** is the recipient approved?
- **Per-payment limit:** is this single payment small enough?
- **Daily budget:** does it stay within today's total allowance?

If all checks pass, Cube pays by itself. If not, it refuses and explains why. The human sets the rules once; the agent handles the rest.

## Demo

Run the built-in scenario (no account or network needed):

    node src/demo.js

It sends six payment requests: three approved, and three refused (unknown recipient, amount too large, daily budget exceeded).

## Project structure

    src/rules.js   - budget rules engine (pure logic, no network)
    src/agent.js   - the agent: checks rules, then pays via NEAR
    src/demo.js    - runnable demo scenario

## How payments work

In live mode, Cube sends NEAR testnet transfers using the near-api-js library. Only testnet funds are used, so no real money is at risk.

## Status

- [x] Rules engine: allowlist, per-payment limit, daily budget
- [x] Agent and simulation mode
- [ ] Live NEAR testnet payments (in progress)
- [ ] Simple web interface for the demo
- [ ] AI decision layer on top of the rules

## Requirements

Node.js 18 or newer, and npm install for the live mode.
