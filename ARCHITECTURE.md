# System Architecture

## High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "🌐 Client Layer - Frontend Application"
        direction TB
        UI[React 18 + TypeScript<br/>Vite Build System]
        UI --> Public[Public Pages<br/>Home, Products, Support]
        UI --> UserDash[User Dashboard<br/>Accounts, Transactions]
        UI --> AdminDash[Admin Dashboard<br/>Management, Analytics]
    end
    
    subgraph "🔌 API & Integration Layer"
        direction TB
        SDK[Supabase Client SDK]
        Realtime[Supabase Realtime]
        CustomAPI[Custom API Services]
        CFWorker[Cloudflare Worker Client]
    end
    
    subgraph "⚙️ Backend Services - Supabase"
        direction TB
        Supabase[Supabase Platform]
        Supabase --> Auth[Authentication Service]
        Supabase --> DB[(PostgreSQL Database)]
        Supabase --> EdgeFunc[Edge Functions]
        Supabase --> Storage[File Storage]
        Supabase --> RealtimeSub[Realtime Subscriptions]
    end
    
    subgraph "💳 Payment Gateways"
        direction LR
        Stripe[Stripe API<br/>Global Payments]
        Paystack[Paystack API<br/>African Markets]
    end
    
    subgraph "🔐 Security & Validation"
        direction TB
        RLS[Row Level Security<br/>RLS Policies]
        JWT[JWT Authentication]
        HMAC[HMAC Signature<br/>License Verification]
        RBAC[Role-Based Access<br/>user/admin/worker]
    end
    
    subgraph "🗄️ Database Schema"
        direction TB
        Tables[Core Tables]
        Tables --> Profiles[profiles]
        Tables --> EAProducts[ea_products]
        Tables --> Licenses[licenses]
        Tables --> LicenseAccts[license_accounts]
        Tables --> Subscriptions[subscriptions]
        Tables --> Transactions[transactions]
        Tables --> Affiliates[affiliates]
    end
    
    subgraph "🌍 External Services"
        direction TB
        CFWorkerSvc[Cloudflare Worker<br/>License Verification]
        Email[SMTP Email Service<br/>Notifications]
        Telegram[Telegram Bot API<br/>Alerts]
    end
    
    UI --> SDK
    UI --> Realtime
    UI --> CustomAPI
    UI --> CFWorker
    UI --> Stripe
    UI --> Paystack
    
    SDK --> Supabase
    Realtime --> RealtimeSub
    CustomAPI --> Supabase
    CFWorker --> CFWorkerSvc
    
    Supabase --> RLS
    Auth --> JWT
    Auth --> RBAC
    CFWorkerSvc --> HMAC
    
    DB --> Tables
    
    Stripe --> Supabase
    Paystack --> Supabase
    
    Supabase --> Email
    Supabase --> Telegram
    CFWorkerSvc --> DB
    
    style UI fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px
    style Supabase fill:#3ECF8E,stroke:#2A9D7A,stroke-width:3px
    style DB fill:#FFD700,stroke:#D4AF37,stroke-width:3px
    style Stripe fill:#635BFF,stroke:#4A45B8,stroke-width:2px
    style Paystack fill:#00C964,stroke:#00994D,stroke-width:2px
    style CFWorkerSvc fill:#F38020,stroke:#D66F0A,stroke-width:2px
    style RLS fill:#FF6B6B,stroke:#D63031,stroke-width:2px
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase
    participant Payment
    participant CFWorker
    participant Email
    
    User->>Frontend: Register/Login
    Frontend->>Supabase: Authenticate
    Supabase-->>Frontend: JWT Token
    
    User->>Frontend: Browse Products
    Frontend->>Supabase: Fetch EA Products
    Supabase-->>Frontend: Product Data
    
    User->>Frontend: Purchase EA
    Frontend->>Payment: Initiate Payment
    Payment-->>Frontend: Payment Success
    
    Payment->>Supabase: Webhook (Payment Event)
    Supabase->>Supabase: Generate License
    Supabase->>Email: Send License Email
    Supabase-->>Frontend: License Created
    
    User->>Frontend: Link MT5 Account
    Frontend->>Supabase: RPC Function
    Supabase->>Supabase: Validate Limits
    Supabase-->>Frontend: Account Linked
    
    User->>Frontend: Validate License (EA)
    Frontend->>CFWorker: License Verification
    CFWorker->>Supabase: Check License Status
    Supabase-->>CFWorker: License Data
    CFWorker->>CFWorker: HMAC Sign
    CFWorker-->>Frontend: Signed Response
```

## Database Schema Relationships

```mermaid
erDiagram
    profiles ||--o{ licenses : "owns"
    profiles ||--o{ subscriptions : "has"
    profiles ||--o{ transactions : "makes"
    profiles ||--o{ affiliates : "can_be"
    profiles ||--o{ support_tickets : "creates"
    
    ea_products ||--o{ licenses : "generates"
    ea_products ||--o{ subscriptions : "offers"
    
    licenses ||--o{ license_accounts : "links_to"
    licenses ||--o{ license_logs : "logs"
    licenses ||--o{ license_sessions : "tracks"
    licenses ||--o{ license_validations : "validates"
    
    subscription_tiers ||--o{ subscriptions : "defines"
    subscription_tiers ||--o{ licenses : "applies_to"
    
    transactions ||--|| licenses : "creates"
    
    profiles {
        uuid id PK
        uuid user_id FK
        text email
        text role
        timestamp created_at
    }
    
    ea_products {
        uuid id PK
        text name
        text product_code
        text description
        decimal price
        int max_mt5_accounts
    }
    
    licenses {
        uuid id PK
        uuid user_id FK
        uuid ea_product_id FK
        text license_key
        text status
        boolean is_active
        timestamp expires_at
    }
    
    license_accounts {
        uuid id PK
        uuid license_id FK
        bigint account
        text broker
        text status
    }
    
    subscriptions {
        uuid id PK
        uuid user_id FK
        uuid tier_id FK
        text status
        timestamp current_period_end
    }
```

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        A[App.tsx<br/>Root Component]
        A --> B[Layout Components]
        A --> C[Page Components]
        A --> D[Feature Components]
        
        B --> B1[Header]
        B --> B2[Footer]
        B --> B3[DashboardLayout]
        
        C --> C1[Public Pages]
        C --> C2[Auth Pages]
        C --> C3[Dashboard Pages]
        C --> C4[Admin Pages]
        
        D --> D1[Account Management]
        D --> D2[Payment Forms]
        D --> D3[License Cards]
        D --> D4[UI Components]
    end
    
    subgraph "State Management"
        E[React Context]
        E --> E1[Auth Context]
        E --> E2[Theme Context]
        
        F[TanStack Query]
        F --> F1[Data Fetching]
        F --> F2[Cache Management]
    end
    
    subgraph "Services Layer"
        G[API Services]
        G --> G1[Supabase Client]
        G --> G2[Payment Service]
        G --> G3[Account Service]
    end
    
    A --> E
    A --> F
    D --> G
    
    style A fill:#4A90E2
    style E fill:#9B59B6
    style F fill:#E74C3C
    style G fill:#27AE60
```

## Security Architecture

```mermaid
graph TB
    subgraph "Authentication Flow"
        A[User Login] --> B[Supabase Auth]
        B --> C{JWT Token}
        C -->|Valid| D[Access Granted]
        C -->|Invalid| E[Access Denied]
    end
    
    subgraph "Authorization Layer"
        D --> F[Role Check]
        F -->|Admin| G[Admin Access]
        F -->|User| H[User Access]
        F -->|Worker| I[Worker Access]
    end
    
    subgraph "Data Protection"
        G --> J[RLS Policies]
        H --> J
        I --> J
        J --> K[Row-Level Filtering]
        K --> L[Database Query]
    end
    
    subgraph "License Security"
        M[License Request] --> N[Cloudflare Worker]
        N --> O[HMAC Verification]
        O -->|Valid| P[License Data]
        O -->|Invalid| Q[Rejected]
    end
    
    style B fill:#3ECF8E
    style J fill:#FF6B6B
    style O fill:#F38020
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        A[Users] --> B[CDN<br/>Vercel/Cloudflare]
        B --> C[Static Assets<br/>React Build]
        
        C --> D[Supabase Cloud]
        D --> E[PostgreSQL<br/>Managed Database]
        D --> F[Edge Functions<br/>Serverless]
        D --> G[Auth Service]
        
        C --> H[Payment APIs]
        H --> I[Stripe]
        H --> J[Paystack]
        
        C --> K[Cloudflare Workers]
        K --> L[License Verification]
        
        D --> M[External Services]
        M --> N[SMTP Email]
        M --> O[Telegram API]
    end
    
    subgraph "Development Environment"
        P[Local Dev Server<br/>Vite] --> Q[Supabase Local<br/>or Dev Project]
        P --> R[Test Payment Keys]
    end
    
    style B fill:#000000,color:#fff
    style D fill:#3ECF8E
    style E fill:#FFD700
    style I fill:#635BFF
    style J fill:#00C964
    style K fill:#F38020
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI Framework |
| **Build Tool** | Vite 5 | Fast build & dev server |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS + Components |
| **Routing** | React Router v6 | Client-side routing |
| **State** | React Context + TanStack Query | Global state + Server state |
| **Backend** | Supabase | BaaS (Database + Auth + Functions) |
| **Database** | PostgreSQL | Relational database |
| **Payments** | Stripe + Paystack | Payment processing |
| **Validation** | Cloudflare Workers | License verification |
| **Email** | SMTP (Gmail) | Transactional emails |
| **Notifications** | Telegram Bot API | User alerts |

---

**Note**: These diagrams can be rendered using:
- GitHub (Mermaid support)
- Mermaid Live Editor: https://mermaid.live
- VS Code with Mermaid extension
- Documentation sites (GitBook, Notion, etc.)

