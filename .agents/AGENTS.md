# General Constraints
- **Confirmation Before Implementation**: Always present a proposed plan/strategy and ask for explicit user confirmation before modifying code or executing commands. Do not jump directly to implementation.

# Security & Architecture Standards

### 1. Next.js 16 Proxy Convention
- Use `src/proxy.ts` for route filtering, auth redirects, and header manipulation.
- Do not create or keep `src/middleware.ts` alongside `src/proxy.ts` (having both triggers a Next.js 16 build conflict).

### 2. Supabase Server Authentication
- In server components and API route handlers, always authenticate user sessions using `supabase.auth.getUser()`.
- Never use `supabase.auth.getSession()` for server-side authorization or data filtering as it only parses cookie payloads without server-side validation.

### 3. Environment Variables & Secrets
- Never expose backend secrets to the browser using `NEXT_PUBLIC_` prefixes.
- Avoid hardcoded fallback credentials or default secrets in source code.

### 4. Role Authorization & Access Control
- In auth callbacks and registration flows, strictly allowlist self-assignable roles (`['seeker', 'employer']`).
- Never allow query parameters or client payloads to grant `admin` privileges or overwrite existing database user roles.
- Protect sensitive administration endpoints server-side with `ADMIN_SECRET` verification.
