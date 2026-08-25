---
description: Review current changes for security vulnerabilities
---

Review the current git diff for security issues only.

Focus on:
- authentication
- authorization and access control
- session, cookie and JWT handling
- input validation
- SQL/command injection
- XSS and CSRF
- secrets and credentials
- PII exposure
- file upload and path traversal
- SSRF
- database permissions and RLS
- unsafe external input
- insecure configuration

Do not modify files.

Report only actionable security findings.

For each finding include:
- severity
- affected file/location
- risk
- recommended fix

If no meaningful security issue is found, say so clearly.

ให้สรุปรายงานเป็น"ภาษาไทย" และรูปแบบ "ตาราง"