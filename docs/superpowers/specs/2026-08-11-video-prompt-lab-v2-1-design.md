# Video Prompt Lab v2.1 — Compiler, Router, Dataset & Eval Design

Date: 2026-08-11
Branch: `agent/v2-compiler-evals`
Status: approved direction, implementation pending final spec review

## 1. Goal

Upgrade Video Prompt Lab from a high-quality prompt knowledge base into an engineering-oriented prompt compiler that can:

1. normalize a creative request into a stable intermediate representation (Video IR);
2. route the request by