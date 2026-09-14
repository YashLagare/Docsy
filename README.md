# Docsy

**Document version:** 1.0  
**Current application version:** 0.0.1  
**Last updated:** 2026-09-12
**Project type:** Multi-tenant document workspace

## Table of Contents

- [1 Executive Summary](#1-executive-summary)
- [2 Project Overview](#2-project-overview)
- [3 Technology Stack](#3-technology-stack)
- [4 System Architecture](#4-system-architecture)
- [5 Repository Structure](#5-repository-structure)
- [6 Features](#6-features)
- [7 UI Screenshots](#7-ui-screenshots)
- [8 Database Design](#8-database-design)
- [9 Entity Relationship Diagram](#9-entity-relationship-diagram)
- [10 Security](#10-security)
- [11 Authentication](#11-authentication)
- [12 API Documentation](#12-api-documentation)
- [13 Third-party Services](#13-third-party-services)
- [14 Environment Variables](#14-environment-variables)
- [15 Major Dependencies](#15-major-dependencies)
- [16 Installation Guide](#16-installation-guide)
- [17 Deployment](#17-deployment)
- [18 Request Lifecycle](#18-request-lifecycle)
- [19 Performance](#19-performance)
- [20 Security Review](#20-security-review)
- [21 Challenges & Engineering Decisions](#21-challenges--engineering-decisions)
- [22 Future Improvements](#22-future-improvements)
- [23 Developer Notes](#23-developer-notes)

## 1 Executive Summary

Long documents are time-consuming to read, and AI answers can miss context or provide claims that are difficult to verify. Docsy helps users understand selected documents faster by returning streamed, source-referenced answers that can be checked against the uploaded material.

Docsy is a Next.js application for organizing source documents in workspaces and asking questions about selected documents. Users can upload supported files, create chats, receive streamed OpenRouter answers with source markers, search workspace data, manage account settings, and view usage information.

The application is implemented as a modular Next.js monolith. The browser renders App Router pages and client components. Server routes enforce session, workspace, and administrator checks before calling application stores, Better Auth, Stripe, Resend, OpenRouter, or Prisma. Neon PostgreSQL stores authentication records, workspace data, uploaded document bytes, chat data, usage events, subscriptions, avatars, settings, and audit logs.

## 2 Project Overview

### Objective

Help authenticated users understand long documents quickly while keeping answers connected to the selected source documents so important claims are easier to verify.

### Scope

Implemented scope includes:

- Public marketing pages and authentication dialogs.
- Email/password authentication with verification and password reset.
- Optional Google and GitHub OAuth.
- Workspace onboarding and organization membership.
- Document upload, download, listing, and deletion.
- Upload support for PDF, DOCX, TXT, and Markdown files. The upload formats and the formats currently extracted into text for question answering are not identical: DOCX, TXT, and Markdown are extracted; PDF bytes are stored and downloadable but are not text-extracted by the current AI flow.
- Chat creation, document attachment, streamed OpenRouter answers, source markers, and answer feedback.
- Workspace search, usage tracking, account settings, and account deletion.
- Administrator user, settings, plan, maintenance, retention, and audit-log operations.
- Optional Stripe Checkout, Customer Portal, and subscription webhooks.
- Scheduled chat-retention cleanup.

The repository does not implement separate object storage, a vector database, an OCR provider, an embeddings pipeline, a background document-processing queue, or an analytics service.

### Primary Modules

| Module | Responsibility |
| --- | --- |
| Marketing | Public landing page, pricing, FAQs, and authentication entry points |
| Authentication | Better Auth server configuration, client session access, email flows, and OAuth providers |
| Workspace | Organization onboarding, dashboard shell, navigation, settings, and account management |
| Library | Document upload, storage, extraction status, download, and deletion |
| Chat | Chat creation, document scope, OpenRouter question answering, source markers, and feedback |
| Search | Workspace command-palette search over chats and documents |
| Billing | Stripe Checkout, Customer Portal, entitlement reconciliation, and webhook processing |
| Administration | User creation, settings, plan grants, maintenance controls, retention, and activity logs |

### Target Users

The implemented user roles are regular authenticated workspace members and application administrators. Public visitors can view the marketing experience and authentication controls.

### Real-world Use Cases

- Reviewing research papers and academic material.
- Summarizing business reports and proposals.
- Asking questions about technical documentation and project documents.
- Checking policies, procedures, and other operational documents.
- Reviewing source-referenced answers in a chat.
- Managing workspace billing and account settings.
- Administrating users, plans, security switches, and retention policies.

## 3 Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript |
| Backend | Next.js route handlers and server components |
| Database | PostgreSQL on Neon |
| ORM and driver | Prisma 7 with `@prisma/adapter-neon` and `@neondatabase/serverless` |
| Authentication | Better Auth with Prisma persistence |
| AI provider | OpenRouter streaming chat-completions API |
| Email | Resend |
| Payments | Stripe Checkout, Customer Portal, and webhooks |
| Styling | Tailwind CSS v4, shadcn/ui, Base UI, Tailwind Merge, Tailwind Animate |
| UI components | Lucide React for interface icons, React Icons for brand icons, and Radix-style component primitives through the configured UI stack |
| Document processing | Mammoth for DOCX text extraction; TXT and Markdown are decoded as text; PDF bytes are stored but not text-extracted for the current OpenRouter flow |
| Markdown | `react-markdown` and `remark-gfm` |
| Build and validation | Next.js build, TypeScript compiler, ESLint, Prettier |
| Deployment | Vercel-compatible Next.js deployment; no Vercel manifest is checked in |
| Runtime | Node.js 22 or newer |
| Testing | No test framework or checked-in automated test suite is configured |

## 4 System Architecture

Docsy is a client-server monolith built with the Next.js App Router. Server-rendered pages and client components are deployed with the same application as the API route handlers. Prisma provides persistence through the Neon serverless PostgreSQL adapter.

### Current AI Answer Flow

The current answer path is:

```text
Select documents -> obtain available document content -> build model context
-> send question to OpenRouter -> stream answer -> store answer and source metadata
```

For DOCX, TXT, and Markdown files, available text is extracted and included in the model context. PDF files can be uploaded and stored, but the current implementation does not extract PDF text for the OpenRouter request. Source markers and saved passage metadata support the source reader for answers that reference extracted text.

```text
+-----------------------+       HTTPS        +------------------------------+
| Browser               | <----------------> | Next.js application          |
| Marketing and /app UI |                     | App Router and route handlers|
+-----------+-----------+                     +------+-----------------------+
            |                                         |
            | Session cookies and JSON/multipart       |
            v                                         v
+-----------------------+                     +------------------------------+
| Better Auth           |                     | Application stores           |
| Sessions and OAuth   |                     | Workspace, chat, documents,  |
+-----------------------+                     | billing, admin, and search  |
                                              +------+-----------------------+
                                                     |
                    +--------------------------------+------------------+
                    |                                                   |
                    v                                                   v
        +---------------------------+                       +----------------------+
        | Neon PostgreSQL            |                       | External integrations|
        | Auth, workspaces, bytes,   |                       | OpenRouter, Resend,  |
        | chats, usage, billing      |                       | Stripe, OAuth        |
        +---------------------------+                       +----------------------+
```

The application does not contain independently deployable frontend and backend services. The Next.js application can deploy as one Vercel project. No Vercel deployment manifest is checked in.

## 5 Repository Structure

```text
app/
  (marketing)/              Public landing routes and marketing layout
  (auth)/                    Password-reset route and auth layout
  app/                       Signed-in product routes and session boundary
    (chat)/                  Chat routes
    (workspace)/             Organization-scoped dashboard routes
    onboarding/              Workspace creation flow
  api/                      Next.js API route handlers
components/                 Feature and layout React components
hooks/                      Shared client hooks
lib/                        Server stores, auth, billing, AI, and utilities
prisma/
  schema.prisma              Prisma models and enums
  migrations/                Database migrations
public/                      Public static assets
scripts/                    Project maintenance scripts
ui-design/                  Light and dark UI reference screenshots
```

Important root files:

| File | Purpose |
| --- | --- |
| `package.json` | Runtime dependencies and development scripts |
| `prisma.config.ts` | Prisma schema and migration connection configuration |
| `next.config.ts` | Next.js configuration |
| `proxy.ts` | Optimistic cookie gate for signed-in routes |
| `vercel.json` | Not present; Vercel uses project settings and Next.js detection |
| `.env.example` | Runtime configuration template |
| `AGENTS.md` | Repository conventions and architecture notes |

Generated Prisma output is under `generated/prisma/` and is not manually edited. `node_modules`, build output, and coverage output are not part of the application source structure.

## 6 Features

### Marketing and Authentication Entry Points

- **Purpose:** Present the public product experience and open sign-in or sign-up dialogs.
- **Business value:** Provides the public entry point for workspace users.
- **Main components:** Marketing route components, site header, footer, auth dialog provider, sign-in dialog, and sign-up dialog.
- **Related APIs:** Better Auth catch-all route at `/api/auth/[...all]`.
- **Dependencies:** Next.js, React, Better Auth, Resend when email delivery is configured.

### Email and Social Authentication

- **Purpose:** Create accounts, sign in, verify email addresses, reset passwords, and optionally authenticate with Google or GitHub.
- **Business value:** Provides account access and recovery workflows.
- **Main components:** `lib/auth.ts`, `lib/auth-client.ts`, `components/auth/`, and `/reset-password`.
- **Related APIs:** `GET` and `POST /api/auth/[...all]`.
- **Dependencies:** Better Auth, Prisma, Neon, optional OAuth credentials, and optional Resend credentials.

### Workspace Onboarding and Multi-tenancy

- **Purpose:** Create and use an organization as the workspace boundary for application data.
- **Business value:** Keeps documents, chats, usage, subscriptions, and search results isolated by workspace.
- **Main components:** Onboarding route, workspace layout, session helpers, organization utilities, and dashboard navigation.
- **Related APIs:** Better Auth organization operations and workspace-scoped application routes.
- **Dependencies:** Better Auth organization models and PostgreSQL.

### Document Library

- **Purpose:** Upload, list, download, and delete source documents.
- **Business value:** Gives users a central source library for question answering.
- **Main components:** Library pages, document dropzone, library picker, `lib/documents.ts`, and document route handlers.
- **Related APIs:** `/api/documents` and `/api/documents/[documentId]`.
- **Dependencies:** PostgreSQL byte storage, Mammoth for DOCX extraction, and Next.js multipart handling.

### Document Question Answering

- **Purpose:** Ask questions over selected ready documents and receive streamed answers with sources.
- **Business value:** Helps users understand long documents faster while providing source references that make important answers easier to verify.
- **Main components:** Chat pages, chat composer, conversation, answer markdown, source reader, `lib/openrouter.ts`, and answer stores.
- **Related APIs:** `/api/chats`, `/api/chats/[chatId]/messages`, and chat document routes.
- **Dependencies:** OpenRouter, PostgreSQL, `react-markdown`, and `remark-gfm`.

### Search and Usage

- **Purpose:** Search workspace chat and document data and display question usage.
- **Business value:** Improves navigation and exposes plan usage information.
- **Main components:** Search page, command palette, usage page, search store, and usage store.
- **Related APIs:** `GET /api/search`.
- **Dependencies:** PostgreSQL and workspace session context.

### Billing and Entitlements

- **Purpose:** Start Stripe Checkout, open the Customer Portal, reconcile paid subscriptions, and grant plans from verified events or admin actions.
- **Business value:** Supports paid workspace plans while keeping entitlement decisions server-controlled.
- **Main components:** Billing settings page, `lib/stripe.ts`, `lib/billing.ts`, `lib/billing-store.ts`, and webhook handler.
- **Related APIs:** `/api/billing/checkout`, `/api/billing/portal`, and `/api/webhooks/stripe`.
- **Dependencies:** Stripe credentials, configured price IDs, and webhook signing secret.

### Administration and Retention

- **Purpose:** Manage users, settings, plans, maintenance mode, sign-up availability, retention, and activity-log export.
- **Business value:** Provides operational controls for the application.
- **Main components:** Admin routes, admin stores, security settings, activity log, and retention route.
- **Related APIs:** `/api/admin/users`, `/api/admin/settings`, `/api/admin/logs/export`, and `/api/cron/retention`.
- **Dependencies:** Admin role checks, Prisma, and `CRON_SECRET` for scheduled retention requests.

## 7 UI Screenshots

The following placeholders correspond to implemented page routes. Replace each placeholder with a screenshot only when a project screenshot is available.

| Page | Placeholder |
| --- | --- |
| Marketing home `/` | `<img width="1897" height="910" alt="Docsy" src="https://github.com/user-attachments/assets/55708dad-3def-4efc-96a2-62675795d96f" />
` |
| Password reset `/reset-password` | `<img width="1917" height="903" alt="image" src="https://github.com/user-attachments/assets/a67cb39b-a074-461c-a371-a5e3b7fceae3" />
` |
| Dashboard `/app` | `<img width="1842" height="955" alt="image" src="https://github.com/user-attachments/assets/15c48451-132b-4809-8528-7e26e48fd860" />
` |
| Onboarding `/app/onboarding` | `<img width="1917" height="912" alt="image" src="https://github.com/user-attachments/assets/df1d9773-25dc-4ce3-9a36-eacf9bbd31bc" />
` |
| Chats `/app/chats` | `<img width="1842" height="960" alt="image" src="https://github.com/user-attachments/assets/205ff5a1-72ea-4b9b-a77a-e3d967257f7e" />
` |
| Chat detail `/app/chats/[chatId]` | `<img width="1846" height="957" alt="image" src="https://github.com/user-attachments/assets/2b4f499a-c838-459f-92f3-6874bc6a3b48" />
` |
| Library `/app/library` | `<img width="1847" height="952" alt="image" src="https://github.com/user-attachments/assets/9213e356-6036-429e-8420-133e82aeb9f1" />
` |
| Search `/app/search` | `<img width="1847" height="958" alt="image" src="https://github.com/user-attachments/assets/64d439b1-db5b-4df0-b641-21d1d25e8cd8" />
` |
| Usage `/app/usage` | `<img width="1836" height="953" alt="image" src="https://github.com/user-attachments/assets/d6e1cc49-8660-44fd-b763-a5ede9e6813c" />
` |
| Settings `/app/settings` | `<img width="1831" height="962" alt="image" src="https://github.com/user-attachments/assets/ea7c2e4e-19a3-46f3-9f2d-e9a55948794d" />
` |
| Billing `/app/settings/billing` | `<img width="1832" height="958" alt="image" src="https://github.com/user-attachments/assets/8ae536fe-5fbc-49ef-a085-829ba2b5b82e" />
` |
| Danger zone `/app/settings/danger-zone` | `<img width="1846" height="962" alt="image" src="https://github.com/user-attachments/assets/26a1421b-896d-4459-9572-91648bb7bff3" />
` |
| Admin overview `/app/admin` | `<img width="1846" height="958" alt="image" src="https://github.com/user-attachments/assets/12e8b5c7-9d4f-4438-a5c1-271ac1dddae3" />
` |
| Admin users `/app/admin/users` | `<img width="1847" height="957" alt="image" src="https://github.com/user-attachments/assets/1be3ba42-276f-476b-b438-7f63013086db" />
` |
| New admin user `/app/admin/users/new` | `<img width="1835" height="956" alt="image" src="https://github.com/user-attachments/assets/3efb5ecd-f5ea-4c10-aeee-394f26e2174b" />
` |
| Admin security `/app/admin/security` | `<img width="1236" height="856" alt="image" src="https://github.com/user-attachments/assets/ef4dfa7e-18bb-493a-b4cf-0af8554631a2" />
` |
| Admin logs `/app/admin/logs` | `<img width="1512" height="861" alt="image" src="https://github.com/user-attachments/assets/d5b0251d-2d96-4002-914b-0fdeb184ce76" />
` |

## 8 Database Design

The database provider is PostgreSQL. Prisma 7 reads the migration URL from `prisma.config.ts`; the running application connects through the Neon adapter. Application document and avatar bytes are stored in PostgreSQL rather than an object-storage service.

### Better Auth and Workspace Models

| Model | Fields | Constraints and relationships |
| --- | --- | --- |
| `User` | `id String`, `name String`, `email String`, `emailVerified Boolean`, `image String?`, timestamps, `role String?`, ban fields | Primary key `id`; unique `email`; relations to sessions, accounts, members, and invitations |
| `Session` | `id`, `expiresAt`, `token`, timestamps, `ipAddress?`, `userAgent?`, `userId`, `activeOrganizationId?`, `impersonatedBy?` | Primary key `id`; unique `token`; index `userId`; cascades to user |
| `Account` | `id`, `accountId`, `providerId`, `userId`, OAuth token fields, `password?`, timestamps | Primary key `id`; index `userId`; cascades to user |
| `Verification` | `id`, `identifier`, `value`, `expiresAt`, timestamps | Primary key `id`; index `identifier` |
| `RateLimit` | `id`, `key`, `count`, `lastRequest` | Primary key `id`; unique `key` |
| `Organization` | `id`, `name`, `slug`, `logo?`, `createdAt`, `metadata?` | Primary key `id`; unique `slug`; relations to members and invitations |
| `Member` | `id`, `organizationId`, `userId`, `role`, `createdAt` | Primary key `id`; indexes on organization and user; cascades from organization and user |
| `Invitation` | `id`, `organizationId`, `email`, `role?`, `status`, `expiresAt`, `createdAt`, `inviterId` | Primary key `id`; indexes on organization and email; cascades from organization and inviter |

`User.emailVerified` defaults to `false`, `User.banned` defaults to `false`, `Member.role` defaults to `member`, `Invitation.status` defaults to `pending`, and timestamps use the defaults defined in `prisma/schema.prisma`.

### Application Models

| Model | Fields | Constraints and relationships |
| --- | --- | --- |
| `Avatar` | `id`, `userId`, `contentType`, `data Bytes`, `updatedAt` | Primary key `id` with `cuid()` default; unique `userId`; stores profile image bytes |
| `AdminLog` | `id`, `actorId?`, `actorName?`, `action`, `description`, `targetId?`, `createdAt` | Primary key `id` with `cuid()` default; index `createdAt`; append-only audit records |
| `AppSetting` | `id`, `allowSignUps`, `enforceTwoFactor`, `maintenanceMode`, `chatRetentionMonths?`, `updatedByUserId?`, `updatedAt` | Primary key defaults to `app`; single-row application settings record |
| `Subscription` | `id`, `organizationId`, Stripe customer/subscription IDs, `status?`, `planId`, price and interval fields, period fields, card summary fields, `source`, `grantedByUserId?`, timestamps | Primary key `id`; unique organization, customer, and subscription IDs; workspace entitlement record |
| `Document` | `id`, `organizationId`, `userId`, `name`, `contentType`, `sizeBytes`, `data Bytes`, `text?`, `pageCount?`, `status`, `failureReason?`, `createdAt` | Primary key `id` with `cuid()` default; compound index `[organizationId, createdAt]`; relates to chats through `ChatDocument` |
| `Chat` | `id`, `organizationId`, `userId`, `title`, timestamps | Primary key `id` with `cuid()` default; compound index `[organizationId, updatedAt]`; relations to documents and messages |
| `ChatDocument` | `chatId`, `documentId`, `position` | Composite primary key `[chatId, documentId]`; index `documentId`; cascades from chat and document |
| `Message` | `id`, `chatId`, `role`, `content`, `sources Json?`, `hidden`, `feedback?`, `createdAt` | Primary key `id` with `cuid()` default; compound index `[chatId, createdAt]`; cascades from chat |
| `QuestionEvent` | `id`, `organizationId`, `userId`, `chatId?`, `createdAt` | Primary key `id` with `cuid()` default; compound index `[organizationId, createdAt]`; persistent usage ledger |

`Document.status` uses `PROCESSING`, `READY`, and `FAILED`. `Message.role` uses `USER` and `ASSISTANT`. `Message.feedback` uses `UP` and `DOWN`.

## 9 Entity Relationship Diagram

```text
+----------------+       +----------------+       +----------------------+
| User           |       | Organization   |       | Subscription         |
| PK id          |       | PK id          |       | PK id                |
| email          |       | slug           |       | organizationId       |
+-------+--------+       +--------+-------+       | planId, status       |
        |                         |              +----------------------+
        | 1                       | 1
        |                         |
        | N                       | N
+-------v--------+       +--------v-------+
| Session        |       | Member         |
| PK id          |       | PK id          |
| userId FK      |       | userId FK      |
| token          |       | organizationId |
+----------------+       +----------------+
                                  |
                                  | 1
                                  | N
                         +--------v--------+
                         | Document        |
                         | PK id           |
                         | organizationId  |
                         | userId          |
                         | data, text      |
                         +--------+--------+
                                  |
                                  | N
                                  | N
                         +--------v--------+
                         | ChatDocument    |
                         | PK chatId +     |
                         |    documentId   |
                         | position        |
                         +--------+--------+
                                  |
                                  | N
                         +--------v--------+
                         | Chat            |
                         | PK id           |
                         | organizationId  |
                         | userId          |
                         +--------+--------+
                                  |
                                  | 1
                                  | N
                         +--------v--------+
                         | Message         |
                         | PK id           |
                         | chatId FK       |
                         | role, content   |
                         +-----------------+

+----------------+       +----------------+       +----------------+
| Avatar         |       | AdminLog       |       | QuestionEvent  |
| PK id          |       | PK id          |       | PK id          |
| userId unique  |       | actorId        |       | organizationId |
| data           |       | action         |       | userId         |
+----------------+       +----------------+       +----------------+
```

`Invitation` relates to `Organization` and to its inviting `User`. `Account` and `Verification` support Better Auth. `RateLimit` stores authentication rate-limit state. `AppSetting` is a single global settings record. Several application models intentionally use scalar IDs without Prisma relations so the Better Auth schema generator can preserve them.

## 10 Security

### Implemented Controls

- Better Auth manages email/password sessions and OAuth flows.
- Passwords are handled by Better Auth account storage rather than application code.
- Session data is stored in PostgreSQL and accessed through secure server-side helpers.
- Production cookies use secure settings through the auth configuration.
- Authentication routes use Better Auth's verification and password-reset mechanisms.
- API handlers use session and workspace guards.
- Administrator APIs require an administrator role.
- Workspace-scoped queries filter by the active organization.
- Stripe webhooks require signature verification.
- Retention requests require a bearer token matching `CRON_SECRET`.
- Document and avatar uploads validate type and size constraints.
- The application uses database-backed rate-limit records for authentication controls.
- Administrative activity is recorded in an append-only log.
- Card storage is limited to brand and last four digits; card numbers are handled by Stripe.

### Security Areas Not Implemented or Not Enforced

- `AppSetting.enforceTwoFactor` is stored but two-factor sign-in is not implemented.
- No separate external object-storage encryption policy exists because uploaded bytes are stored in PostgreSQL.
- No external WAF, SIEM, vulnerability scanner, or security-monitoring integration is configured in the repository.
- No application-level CORS configuration is documented or configured as a separate service.
- No automated security test suite is checked in.

## 11 Authentication

### Provider and Flows

Better Auth provides email/password authentication, email verification, password reset, session management, account deletion, email changes, and optional Google and GitHub OAuth. The authentication UI is modal-based except for `/reset-password`, which is a landing page for email links.

### Session and Authorization Strategy

Sessions are persisted in the `Session` model and represented to the browser through Better Auth cookies. The optimistic `proxy.ts` cookie gate protects `/app` navigation, while server layouts and API helpers perform the authoritative session check.

Authorization has three relevant boundaries:

1. A signed-in session is required for product access.
2. A workspace or organization is required for workspace-scoped product routes.
3. The administrator role is required for admin pages and admin APIs.

A workspace is represented by a Better Auth `Organization`. Data routes use the active organization to scope document, chat, search, usage, and billing operations.

```text
+-------------------+       +---------------------+       +----------------------+
| Browser           |       | Next.js auth route  |       | Better Auth          |
| Auth dialog       | ----> | /api/auth/[...all]  | ----> | Credentials/OAuth    |
+---------+---------+       +----------+----------+       +----------+-----------+
          |                            |                            |
          | session cookie             |                            | Prisma adapter
          v                            v                            v
+-------------------+       +---------------------+       +----------------------+
| proxy.ts          | ----> | Server session      | ----> | Neon PostgreSQL      |
| optimistic gate   |       | and org guards      |       | User/Session/Account |
+-------------------+       +----------+----------+       +----------------------+
                                       |
                                       v
                              +----------------------+
                              | Workspace or admin   |
                              | route authorization   |
                              +----------------------+
```

## 12 API Documentation

### Shared API Behavior

Workspace routes require a valid session and active workspace. Missing sessions return `401`; missing workspace context returns `403`. Administrator routes require an administrator role and return `403` for non-administrators. Inputs are supplied through path parameters, JSON, multipart form data, or signed headers; no API handler uses query parameters.

### Authentication and Account APIs

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET`, `POST` | `/api/auth/[...all]` | Better Auth | Catch-all authentication, session, verification, password, and OAuth operations |
| `POST` | `/api/avatar` | Signed-in user | Upload a PNG, JPEG, or WebP avatar up to 2 MB |
| `DELETE` | `/api/avatar` | Signed-in user | Delete the current user's avatar |
| `GET` | `/api/avatar/[userId]` | Public | Return stored avatar bytes with content type and cache headers |

### Document and Chat APIs

| Method | Endpoint | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/documents` | Workspace | None | Workspace document views |
| `POST` | `/api/documents` | Workspace | Multipart `file`; PDF, DOCX, TXT, or MD | `201` document view |
| `DELETE` | `/api/documents` | Workspace | None | Number of deleted documents |
| `GET` | `/api/documents/[documentId]` | Workspace | Path `documentId` | Original document bytes |
| `DELETE` | `/api/documents/[documentId]` | Workspace | Path `documentId` | `{ ok: true }` |
| `POST` | `/api/chats` | Workspace | JSON `documentIds`, one to twenty ready documents | `201 { id }` |
| `DELETE` | `/api/chats` | Workspace | None | Number of deleted chats |
| `DELETE` | `/api/chats/[chatId]` | Workspace | Path `chatId` | Deleted and retained shared-document counts |
| `POST` | `/api/chats/[chatId]/documents` | Workspace | JSON `documentIds` | Attached and already-attached counts |
| `POST` | `/api/chats/[chatId]/messages` | Workspace | Optional JSON `question` and `documentIds` | NDJSON stream containing answer events, errors, sources, and message ID |
| `PATCH` | `/api/chats/[chatId]/messages/[messageId]` | Workspace | JSON `feedback`: `UP`, `DOWN`, or `null` | Updated feedback |
| `GET` | `/api/search` | Workspace | None | Workspace chats and documents for search |

Document upload returns `400` for missing or empty files, `413` for oversized files, `415` for unsupported formats, and `422` for extraction failure. Chat answer requests return `503` when OpenRouter is unavailable, `404` when the chat is missing, `402` when usage allowance is exhausted, `409` when no answer or document scope is available, and `400` for invalid scope.

### Billing APIs

| Method | Endpoint | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/billing/checkout` | Workspace | JSON `plan` and `period` (`monthly` or `annual`) | Stripe Checkout URL |
| `POST` | `/api/billing/portal` | Workspace | None | Stripe Customer Portal URL |
| `POST` | `/api/webhooks/stripe` | Valid `stripe-signature` | Raw Stripe event body | `{ received: true, handled }` |

Checkout returns `400` for invalid plans or periods, `503` when billing or a price is unavailable, and `502` when Stripe does not return a URL. Portal requests return `503` when billing is disabled and `400` when no Stripe customer exists. Webhooks return `400` for missing or invalid signatures and do not require a user session.

### Administration and Maintenance APIs

| Method | Endpoint | Auth | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/admin/users` | Admin | JSON `name`, `email`, optional `password`, optional `planId` | Created user ID, email, one-time password, and plan |
| `PATCH` | `/api/admin/settings` | Admin | Settings patch for sign-ups, two-factor flag, maintenance, or retention | Updated settings and optional deletion count |
| `GET` | `/api/admin/logs/export` | Admin | None | Private CSV download |
| `POST` | `/api/cron/retention` | `Authorization: Bearer $CRON_SECRET` | None | Deletion count and cutoff timestamp |

Admin user creation returns `400` for validation failures, `409` for duplicate email, `502` for account-creation failure, and `207` when the account is created but workspace setup fails. Retention returns `503` when the secret is missing, `401` for an invalid bearer token, and `500` for purge failure.

## 13 Third-party Services

| Service | Usage | Configuration |
| --- | --- | --- |
| Neon | Hosted PostgreSQL database and serverless database driver | `DATABASE_URL`, `DATABASE_URL_UNPOOLED` or `DIRECT_URL` |
| Better Auth | Authentication, sessions, organizations, OAuth, verification, and password flows | `BETTER_AUTH_SECRET`, URLs, and optional OAuth credentials |
| OpenRouter | Document question answering through a configurable model | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` |
| Resend | Verification and password-reset email delivery | `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO` |
| Stripe | Checkout, Customer Portal, subscription webhooks, and paid entitlements | Stripe secret, webhook secret, and price IDs |
| Google OAuth | Optional social sign-in provider | Google client ID and secret |
| GitHub OAuth | Optional social sign-in provider | GitHub client ID and secret |
| Mammoth | DOCX text extraction library | No service credentials |

No external object storage, OCR, vector database, queue, or analytics service is configured.

## 14 Environment Variables

The following variables are referenced by application or Prisma configuration. Empty optional values disable their corresponding integration.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled Neon connection used by the running application |
| `DATABASE_URL_UNPOOLED` | Required for preferred migration setup | Direct Neon connection used by Prisma CLI; preferred over `DIRECT_URL` |
| `DIRECT_URL` | Optional fallback | Direct migration URL when `DATABASE_URL_UNPOOLED` is absent |
| `BETTER_AUTH_SECRET` | Yes | Better Auth session and token signing secret |
| `BETTER_AUTH_URL` | Deployment expected | Better Auth base URL and Stripe URL fallback |
| `NEXT_PUBLIC_APP_URL` | Deployment expected | Client auth base URL and Stripe redirect URL base |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional | Comma-separated additional trusted authentication origins |
| `RESEND_API_KEY` | Optional | Enables real transactional email delivery |
| `EMAIL_FROM` | Optional | Verified sender address; defaults to Resend sandbox sender when absent |
| `EMAIL_REPLY_TO` | Optional | Transactional email reply-to address |
| `GOOGLE_CLIENT_ID` | Optional pair | Google OAuth client identifier |
| `GOOGLE_CLIENT_SECRET` | Optional pair | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | Optional pair | GitHub OAuth client identifier |
| `GITHUB_CLIENT_SECRET` | Optional pair | GitHub OAuth client secret |
| `OPENROUTER_API_KEY` | Required for chat answers | OpenRouter API access |
| `OPENROUTER_MODEL` | Optional | OpenRouter model identifier; defaults to `openrouter/free` |
| `STRIPE_SECRET_KEY` | Required for billing | Stripe API access |
| `STRIPE_WEBHOOK_SECRET` | Required for Stripe webhooks | Stripe signature verification |
| `STRIPE_PRICE_PRO_MONTHLY` | Optional | Pro monthly recurring price ID |
| `STRIPE_PRICE_PRO_ANNUAL` | Optional | Pro annual recurring price ID |
| `STRIPE_PRICE_BUSINESS_MONTHLY` | Optional | Business monthly recurring price ID |
| `STRIPE_PRICE_BUSINESS_ANNUAL` | Optional | Business annual recurring price ID |
| `ADMIN_USER_IDS` | Optional | Comma-separated bootstrap administrator user IDs |
| `CRON_SECRET` | Required for retention endpoint | Bearer token for scheduled retention requests |

`NODE_ENV` is read by the runtime and framework but is not a project-specific variable in `.env.example`. The repository does not reference additional application environment variables outside this table.

## 15 Major Dependencies

| Dependency | Role |
| --- | --- |
| `next` | App Router, server rendering, route handlers, and production server |
| `react`, `react-dom` | UI component runtime |
| `better-auth` | Authentication and organization/session workflows |
| `@prisma/client`, `prisma` | Database client, schema, migrations, and Studio |
| `@neondatabase/serverless`, `@prisma/adapter-neon` | Neon PostgreSQL connectivity |
| `openrouter` HTTP integration | OpenRouter streaming chat-completions API for document answers |
| `resend` | Transactional email transport |
| `stripe` | Billing, Checkout, Customer Portal, and webhook integration |
| `mammoth` | DOCX text extraction |
| `react-markdown`, `remark-gfm` | Render assistant Markdown and GitHub-flavored Markdown |
| `tailwindcss`, `tw-animate-css` | Styling and animation utilities |
| `shadcn`, `@shadcn/react`, `@base-ui/react` | UI component system and primitives |
| `lucide-react` | Interface icons |
| `react-icons` | Brand and social icons |
| `recharts` | Usage and dashboard chart rendering |

## 16 Installation Guide

### Prerequisites

- Node.js 22 or newer.
- npm.
- A Neon PostgreSQL database.
- A local copy of this repository.
- Optional credentials for Resend, OpenRouter, Stripe, Google, and GitHub depending on enabled features.

### Install and Configure

```bash
npm install
cp .env.example .env
```

On Windows PowerShell, the equivalent copy command is:

```powershell
Copy-Item .env.example .env
```

Fill the database, Better Auth, and URL variables in `.env`. Set optional service variables only for the integrations being used. Keep `.env` out of version control.

### Database

Use the pooled Neon endpoint for `DATABASE_URL` and the direct, non-pooler endpoint for `DATABASE_URL_UNPOOLED`. Then create and apply the development migration:

```bash
npm run db:migrate
```

Generate the Prisma client independently when required:

```bash
npm run db:generate
```

Open Prisma Studio with:

```bash
npm run db:studio
```

When Better Auth options or plugins change, regenerate the auth schema and create a migration:

```bash
npm run auth:generate
npm run db:migrate
```

### Development

```bash
npm run dev
```

The development application runs at `http://localhost:3000` unless Next.js selects another port.

### Validation and Production Build

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

The repository does not define an automated test command or checked-in test suite.

## 17 Deployment

Vercel is the intended hosting platform for the Next.js application. The repository does not contain a `vercel.json`; Vercel can detect the Next.js project automatically. Neon remains the PostgreSQL provider, while OpenRouter, Resend, Stripe, and optional OAuth providers remain external integrations.

```text
+-----------------------+        deploy        +--------------------------+
| Vercel project        | -------------------> | Next.js build            |
| Environment variables |                       | Install, compile, bundle |
+-----------+-----------+                       +------------+-------------+
            |                                                |
            | runtime                                         | HTTPS requests
            v                                                v
+-----------------------+                       +--------------------------+
| Vercel environment    |                       | Next.js application       |
| Production secrets    | -------------------> | Pages and route handlers  |
+-----------------------+                       +------------+-------------+
                                                                 |
                         +---------------------------------------+----------------+
                         |                                                        |
                         v                                                        v
              +--------------------------+                         +----------------------+
              | Neon PostgreSQL          |                         | OpenRouter, Resend,  |
              | Application persistence |                         | Stripe, OAuth        |
              +--------------------------+                         +----------------------+
```

### Vercel Environment Variables

Add the variables from [Environment Variables](#14-environment-variables) in `Vercel Dashboard -> Project -> Settings -> Environment Variables`. Configure separate values for Development, Preview, and Production as needed. Do not commit `.env` or secret values.

Production URL values should use the deployed domain:

```env
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
BETTER_AUTH_TRUSTED_ORIGINS="https://your-domain.com"
```

Google and GitHub variables are optional Vercel environment variables. Add each provider's client ID and secret only when that social login is enabled. Register these callback URLs with the provider:

```text
https://your-domain.com/api/auth/callback/google
https://your-domain.com/api/auth/callback/github
```

Prisma migrations must be applied with the direct Neon connection before or during deployment. Vercel does not run a repository-defined pre-deploy migration command in this project, so run the production migration separately with:

```bash
npm run db:deploy
```

The repository does not include a Dockerfile, GitHub Actions deployment workflow, or checked-in Vercel manifest.

## 18 Request Lifecycle

A typical workspace document request follows the route, session, organization, store, and persistence boundaries below.

```text
+--------------------+       +-------------------------+
| Browser             | ----> | Next.js App Router      |
| Page or client API  |       | Route handler           |
+--------------------+       +------------+------------+
                                          |
                                          v
                             +-------------------------+
                             | Session and workspace   |
                             | guard                   |
                             +------------+------------+
                                          |
                         unauthorized ----+---- authorized
                              |                       |
                              v                       v
                       +-------------+      +-------------------------+
                       | 401 / 403   |      | Input parsing and       |
                       | JSON error  |      | type/size validation    |
                       +-------------+      +------------+------------+
                                                       |
                                                       v
                                          +-------------------------+
                                          | Domain store and        |
                                          | organization filtering  |
                                          +------------+------------+
                                                       |
                              +------------------------+----------------+
                              |                                         |
                              v                                         v
                 +-------------------------+                 +----------------------+
                 | Prisma Neon adapter    |                 | External provider    |
                 | PostgreSQL persistence  |                 | OpenRouter, Stripe,  |
                 +------------+------------+                 | Resend, or OAuth     |
                              |                              +----------+-----------+
                              +------------------------+----------------+
                                                       v
                                          +-------------------------+
                                          | JSON, bytes, CSV, or    |
                                          | NDJSON response         |
                                          +-------------------------+
```

For a chat answer, the domain layer also records usage and assistant content while the route streams NDJSON events to the client.

## 19 Performance

### Implemented Optimizations

- Neon serverless adapter is used for PostgreSQL connectivity.
- Prisma client reuse is configured for non-production development behavior.
- Workspace-scoped database indexes exist for document creation time, chat update time, message creation time, and question-event creation time.
- Avatar responses use immutable cache headers.
- Chat answers stream NDJSON instead of waiting for a complete response.
- Usage events are stored separately from chat records so usage accounting survives chat deletion.
- Document and avatar upload limits constrain request payload size.

### Potential Bottlenecks

- Document and avatar bytes are stored in PostgreSQL, increasing database storage and transfer requirements.
- Chat answer latency depends on OpenRouter response time and document payload size.
- Search currently returns workspace chat and document data without a separate search index.
- DOCX extraction and PDF handling occur within application request processing.
- No background processing queue is configured for document extraction.

### Scalability Considerations

The current design is a single Next.js service with Neon PostgreSQL. Larger document volumes or higher concurrent upload and chat workloads would require measurement of database storage, connection behavior, request duration, OpenRouter limits, and server memory before scaling decisions are made.

### Future Optimizations

- Move large document and avatar payloads to an object-storage service.
- Introduce asynchronous or background document processing for extraction and status transitions.
- Introduce document chunking, embeddings, retrieval indexing, and citation mapping for more scalable question answering over large documents.
- Add stronger search and retrieval capabilities as workspace data volume grows.
- Add automated unit, integration, authorization, webhook, and end-to-end tests.
- Implement the currently unbuilt 2FA sign-in flow and connect it to the existing security setting.
- Add production observability, alerting, and operational health checks.

## 20 Security Review

### Current Security Strengths

- Centralized Better Auth session handling.
- Server-side workspace and admin authorization guards.
- Stripe signature verification before subscription handling.
- Bearer-token protection for retention cleanup.
- Upload content-type and size validation.
- Database-backed authentication rate-limit records.
- Server-controlled billing entitlements based on verified Stripe data or admin grants.
- Append-only administrative activity records.
- Production secure-cookie configuration.

### Current Risks

- Two-factor enforcement is represented as a setting but is not implemented.
- Uploaded source and avatar bytes are stored in the primary database, which can increase blast radius and storage cost.
- No checked-in automated security, integration, or end-to-end tests validate the protected routes.
- Optional deployment credentials and service configuration are operational responsibilities outside `railway.json`.
- Admin bootstrap through `ADMIN_USER_IDS` must be removed or emptied after a real administrator is established.

### Recommended Improvements

- Implement and test the two-factor authentication workflow before enabling the stored setting.
- Add automated authorization tests for cross-workspace document, chat, billing, and admin access.
- Add dependency and secret scanning to the deployment workflow.
- Add webhook replay and idempotency tests for Stripe event handling.
- Define production logging, alerting, backup, and database-retention procedures.

## 21 Challenges & Engineering Decisions

- **App Router monolith:** Pages, server components, client components, and APIs remain in one Next.js project, keeping deployment and route ownership centralized.
- **Organization as workspace:** Better Auth organizations provide the existing tenant boundary and membership model.
- **PostgreSQL byte storage:** Documents and avatars are stored beside application metadata, avoiding a separate storage service in the current implementation.
- **Direct migration connection:** Prisma CLI prefers `DATABASE_URL_UNPOOLED` because Neon pooled connections are unsuitable for DDL transactions.
- **Server-controlled entitlements:** Subscription state is written from Stripe data or explicit admin grants rather than from client-selected plan values.
- **Streaming answer protocol:** Chat answers are returned as NDJSON so text and completion/source events can reach the browser incrementally.
- **Separate usage ledger:** `QuestionEvent` preserves usage records independently from chat deletion.
- **Modal authentication:** Sign-in and sign-up are dialogs; password reset has a route because an emailed link requires a page destination.

## 22 Future Improvements

- **Not implemented yet:** Implement two-factor authentication and connect it to the existing security setting.
- **Not implemented yet:** Add automated unit, integration, authorization, webhook, and end-to-end coverage.
- **Not implemented yet:** Move binary document and avatar storage out of PostgreSQL when scale requires it.
- **Not implemented yet:** Add asynchronous extraction and retry handling for large or complex documents.
- **Not implemented yet:** Introduce document chunking, embeddings, retrieval indexing, and citation mapping for more scalable question answering over large documents.
- **Not implemented yet:** Add stronger search and retrieval capabilities if workspace data volume increases.
- **Not implemented yet:** Add operational observability, alerting, database backup documentation, and deployment health checks.
- Reconcile README terminology with `.env.example` by documenting `DATABASE_URL_UNPOOLED` as the preferred migration variable and `DIRECT_URL` as its fallback alias.

## 23 Developer Notes

### Maintainability

- Keep server-only modules such as `lib/auth.ts`, database stores, Stripe code, and email transport out of client components.
- Keep workspace and administrator guards at every data access boundary, not only at layout level.
- Preserve the distinction between pooled runtime database access and direct migration access.
- Regenerate the Better Auth schema through the project script rather than invoking the CLI directly.

### Refactoring Opportunities

- Add shared typed request schemas for repeated JSON validation.
- Add API contract tests for documented status codes and streaming events.
- Isolate binary storage behind a storage abstraction before introducing external object storage.
- Consolidate deployment and local environment documentation around the preferred Neon variable names.

### Technical Debt

- The stored two-factor setting has no corresponding authentication enforcement.
- The repository has no automated test suite.
- Production operational controls are not represented in the repository beyond the Railway deployment manifest.
- Marketing copy references broader document capabilities than the implemented PDF, DOCX, TXT, and Markdown upload handlers provide.

### Documentation Quality

This document describes checked-in routes, models, integrations, scripts, deployment configuration, and environment references. Values for secrets, database credentials, OAuth credentials, Stripe credentials, and service keys must be supplied through deployment-specific secret management.

---

Written by Yash Lagare
