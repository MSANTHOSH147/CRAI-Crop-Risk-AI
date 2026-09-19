# Security & Responsible Disclosure

CRAI has a public showcase repository and a separate private engineering environment.

## Never Commit

Do not commit:

- API keys
- Access tokens
- Passwords
- Database credentials
- `.env` files containing secrets
- Private datasets
- Model weights intended to remain private
- Proprietary prompts
- Internal decision thresholds
- Unpublished research artifacts
- Personally identifiable information

## Public / Private Boundary

The public repository contains the product-facing frontend, documentation and selected integration metadata.

The private engineering environment contains implementation details that are intentionally not published.

## Before Every Push

Check:

```bash
git status
git diff --cached
```

Then verify that no secrets, datasets, model files or private research artifacts are staged.

## Reporting

If you discover a security issue, please do not publish credentials or exploit details in a public issue. Contact the project maintainer privately with enough information to reproduce and assess the issue.
