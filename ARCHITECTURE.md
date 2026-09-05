# AVYOMA CRM — Technical Architecture Documentation

## 1. System Overview

AVYOMA CRM is constructed as a modular client-side single-page application (SPA) with a decoupled data service architecture.

```text
+-----------------------------------------------------------------------+
|                            APP SHELL                                  |
|  +------------------------+  +-------------------------------------+  |
|  |     Sidebar.jsx        |  |            Topbar.jsx               |  |
|  | (Nav, User, Collapse)  |  |  (Breadcrumb, Search, +Create, Bell)|  |
|  +------------------------+  +-------------------------------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                        ACTIVE MODULE VIEW                        |  |
|  |  Dashboard / Leads / Accounts / Opportunities / Pipeline / ...  |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                      STORAGE & BUSINESS LOGIC                         |
|   (storageService.js: Lead Scoring, Conversion Engine, Kanban Updates)|
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                   LOCALSTORAGE PERSISTENCE ENGINE                     |
+-----------------------------------------------------------------------+
```

---

## 2. Directory Structure

- `src/components/`: Shared UI primitives (DataTable, KanbanBoard, KPICard, StatusBadge, Modal, Drawer, GlobalSearchModal, GlobalCreateModal, NotificationDrawer).
- `src/modules/`: High-level domain modules (Dashboard, Leads, Accounts, Contacts, Opportunities, Pipeline, Activities, Tasks, Proposals, Products, Reports, Documents, AuditLogs, Settings).
- `src/services/`: State management and business calculation engines (`storageService.js`).
- `src/data/`: Default seed dataset (`seedData.js`).
- `src/utils/`: Formatters for currency (`INR`, `USD`), dates, lead scores, and ID generation (`formatters.js`).
