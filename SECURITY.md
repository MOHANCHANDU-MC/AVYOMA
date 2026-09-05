# AVYOMA CRM — Security Architecture & RBAC Guidelines

## Security Controls

1. **Role-Based Access Control (RBAC)**:
   - 7 defined user roles: `Super Admin`, `Admin`, `Sales Manager`, `Sales Executive`, `Technical / Engineering`, `Finance`, `Viewer`.
   - Granular permission matrix restricting edit, export, stage move, and deletion rights based on assigned role.

2. **Defence & Aerospace Confidentiality**:
   - Mandatory security classification metadata (`Public`, `Internal`, `Confidential`, `Highly Confidential`) on sensitive opportunities and tenders.

3. **Audit Trails**:
   - Immutable system logging for stage changes, value updates, lead conversions, and document uploads.
