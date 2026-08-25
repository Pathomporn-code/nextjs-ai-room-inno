---
name: git-commit-guide
description: Use when committing code, writing commit messages, reviewing staged changes, or preparing a Git commit in this Next.js project. Defines Conventional Commit format, project scopes, safety rules, and pre-commit checks.
metadata:
  version: "2.0.0"
---

# Git Commit Guidelines

## Commit Format

```text
<type>(<scope>): <subject>

[optional body]
```

Scope is optional when no meaningful project scope applies.

## Types

| Type | Use for |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `refactor` | Code restructure without behavior change |
| `style` | UI/CSS-only changes |
| `chore` | Config, dependencies, tooling |
| `docs` | Documentation or comments |
| `perf` | Performance improvement |

Choose the type that best represents the primary change.

## Project Scopes

| Scope | Maps to |
|---|---|
| `auth` | `src/lib/auth.ts`, `src/lib/auth-client.ts`, `(auth)/` |
| `product` | `(front)/product/`, product components |
| `cart` | `src/lib/cart-store.ts`, cart components |
| `course` | `(front)/course/`, course services |
| `contact` | `(front)/contact/`, `src/app/api/contact/` |
| `prisma` | `prisma/`, `src/lib/prisma.ts` |
| `ui` | `src/components/ui/`, shared components |
| `layout` | App/layout files |
| `api` | `src/app/api/` |
| `config` | `next.config.ts`, `prisma.config.ts`, project config |

Prefer the feature/domain scope over individual filenames.

If no meaningful scope applies:

```text
chore: update dependencies
```

## Subject Rules

- English only
- Use imperative/present tense: `add`, `fix`, `update`
- Keep it concise, preferably under 72 characters
- Do not end with a period
- Describe the actual change clearly

Examples:

```text
feat(product): add product detail page
fix(cart): fix total price when quantity is zero
chore(prisma): regenerate Prisma client after schema changes
style(ui): update badge color in hero component
refactor(auth): extract sign-in logic from page component
feat(api): add products endpoint with pagination
fix(contact): prevent XSS in email HTML template
```

## Safety Rules

Before committing:

- Never commit `.env` or files containing secrets
- Review staged changes before committing
- Do not use `--no-verify` without a clear reason
- Do not stage generated or ignored files unless intentionally tracked
- Do not amend, reset, force-push, or rewrite Git history without explicit confirmation
- Prefer one logical change per commit

## Workflow

### 1. Review Changes

```bash
git status --short
git diff
git diff --staged
```

Understand what changed before creating the commit.

### 2. Validate

Run relevant checks before committing:

```bash
npm run lint
```

Run tests or type checks when available and relevant.

If `prisma/schema.prisma` changed:

```bash
npx prisma generate
```

### 3. Stage Changes

Stage only files related to the logical change:

```bash
git add <files>
```

Avoid blindly staging everything when unrelated changes exist.

Then verify:

```bash
git status --short
git diff --staged
```

### 4. Check for Sensitive Files

Make sure the staging area does not contain:

```text
.env
.env.*
secrets
credentials
private keys
```

Do not print secret values while checking.

### 5. Commit

Generate the commit message from the staged diff:

```bash
git commit -m "<type>(<scope>): <subject>"
```

Use a commit body only when additional context is useful.

## Project Gotchas

- `.env` contains sensitive values such as `BETTER_AUTH_SECRET` and `DATABASE_URL`
- `generated/prisma/` is gitignored and normally should not be staged
- If Prisma schema changes, run `npx prisma generate` before committing
- Do not bypass Git hooks with `--no-verify` without a justified reason

## Checklist Before Committing

- [ ] Staged files belong to the intended logical change
- [ ] No `.env` or secrets are staged
- [ ] `npm run lint` passes
- [ ] Relevant tests/type checks pass when applicable
- [ ] Prisma client is regenerated if schema changed
- [ ] New shared types are placed in `src/types/` when appropriate
- [ ] New filenames follow project kebab-case convention
- [ ] Commit type and scope match the staged diff
- [ ] Commit subject is concise and uses imperative English
