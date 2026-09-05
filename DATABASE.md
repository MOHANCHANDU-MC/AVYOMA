# AVYOMA CRM — Database Schema & Data Models

## Relational Entity Model

```text
User (id, name, email, role, title)
  │
  ├── Lead (id, fullName, company, industry, estimatedValue, leadScore, leadStatus, leadOwner)
  │     │
  │     └── [Conversion] ──> Account (id, companyName, industry, taxId, annualRevenue)
  │                             ├── Contact (id, name, designation, email, phone, role)
  │                             ├── Opportunity (id, opportunityName, value, probability, salesStage)
  │                             │     └── Proposal (id, proposalNumber, subtotal, taxTotal, grandTotal)
  │                             ├── Activity (id, type, subject, date, notes)
  │                             ├── Task (id, title, dueDate, priority, status)
  │                             └── Document (id, fileName, fileType, size)
  │
  └── AuditLog (id, user, action, details, timestamp)
```
