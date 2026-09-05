# AVYOMA CRM — API Architecture & Endpoint Specification

## 1. Core REST Endpoints

### Authentication & User Profile
- `POST /api/auth/login`: Authenticate user credentials & return JWT session token.
- `GET /api/auth/me`: Fetch current active user profile and RBAC permissions.

### Lead Management
- `GET /api/leads`: Fetch paginated lead records with filtering and sorting.
- `POST /api/leads`: Create a new lead profile.
- `PUT /api/leads/:id`: Update lead details and trigger score recalculation.
- `POST /api/leads/:id/convert`: Atomically convert lead into Account, Contact, and Opportunity.
- `POST /api/leads/public`: Public website lead submission endpoint with rate limiting & origin validation.

### Account Management
- `GET /api/accounts`: List company accounts.
- `POST /api/accounts`: Create new account profile.
- `GET /api/accounts/:id/details`: Fetch account overview, linked contacts, opportunities, proposals, and documents.

### Opportunity & Pipeline
- `GET /api/opportunities`: List opportunities.
- `PATCH /api/opportunities/:id/stage`: Move opportunity stage & recalculate weighted deal value.
- `POST /api/opportunities`: Create opportunity.

### Proposals & Quotations
- `GET /api/proposals`: List submitted quotations.
- `POST /api/proposals`: Generate quotation with line items and subtotal/tax calculations.

### Global Search & Analytics
- `GET /api/search?q=...`: Global search returning instant entity suggestions.
- `GET /api/reports/dashboard`: Executive KPI metrics and funnel calculations.
