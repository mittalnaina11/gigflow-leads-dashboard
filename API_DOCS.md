# GigFlow API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the header:
```
Authorization: Bearer <your_jwt_token>
```

All responses follow the shape:
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... },
  "meta": { ... },       // pagination only
  "errors": [ ... ]      // validation errors only
}
```

---

## Authentication

### POST /auth/register

Register a new user account.

**Request Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"          // "admin" | "sales" (default: "sales")
}
```

**Success Response** `201`
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "657a1b2c3d4e5f6789abcdef",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    }
  }
}
```

**Error Responses**

`400` — Validation failed
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email" }
  ]
}
```

`409` — Email already exists
```json
{
  "success": false,
  "message": "An account with this email already exists."
}
```

---

### POST /auth/login

Login with email and password.

**Request Body**
```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Success Response** `200`
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "657a1b2c3d4e5f6789abcdef",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    }
  }
}
```

**Error Response** `401`
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

### GET /auth/me

Get the currently authenticated user. Requires auth.

**Success Response** `200`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "657a1b2c3d4e5f6789abcdef",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## Leads

### GET /leads

Fetch a paginated, filtered list of leads. Requires auth.

> **RBAC**: Admin users receive all leads. Sales users receive only leads they created.

**Query Parameters**

| Parameter | Type | Description | Example |
|---|---|---|---|
| `status` | string | Filter by status | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter by source | `Website`, `Instagram`, `Referral` |
| `search` | string | Search name or email (case-insensitive) | `Rahul` |
| `sort` | string | Sort order | `latest` (default) or `oldest` |
| `page` | number | Page number (default: 1) | `2` |
| `limit` | number | Records per page (default: 10, max: 100) | `10` |

**Example Request**
```
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1&limit=10
```

**Success Response** `200`
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "_id": "657a1b2c3d4e5f6789abcdef",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "status": "Qualified",
        "source": "Instagram",
        "notes": "Interested in enterprise plan",
        "createdBy": {
          "_id": "657a000000000000000000001",
          "name": "Admin User",
          "email": "admin@gigflow.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T08:00:00.000Z"
      }
    ]
  },
  "meta": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### POST /leads

Create a new lead. Requires auth.

**Request Body**
```json
{
  "name": "Priya Patel",
  "email": "priya@startup.io",
  "status": "New",
  "source": "Referral",
  "notes": "Referred by Rahul. Looking for a team plan."
}
```

| Field | Required | Type | Constraints |
|---|---|---|---|
| `name` | ✅ | string | 2–100 chars |
| `email` | ✅ | string | Valid email |
| `status` | ❌ | string | `New` (default), `Contacted`, `Qualified`, `Lost` |
| `source` | ✅ | string | `Website`, `Instagram`, `Referral` |
| `notes` | ❌ | string | Max 500 chars |

**Success Response** `201`
```json
{
  "success": true,
  "message": "Lead created successfully.",
  "data": {
    "lead": {
      "_id": "657a1b2c3d4e5f6789abcdef",
      "name": "Priya Patel",
      "email": "priya@startup.io",
      "status": "New",
      "source": "Referral",
      "notes": "Referred by Rahul. Looking for a team plan.",
      "createdBy": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com" },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### GET /leads/stats

Get aggregate statistics for the dashboard cards. Requires auth.

> **RBAC**: Admin gets stats for all leads. Sales users get stats for their own leads only.

**Success Response** `200`
```json
{
  "success": true,
  "data": {
    "total": 142,
    "byStatus": {
      "New": 54,
      "Contacted": 38,
      "Qualified": 31,
      "Lost": 19
    },
    "bySource": {
      "Website": 68,
      "Instagram": 47,
      "Referral": 27
    }
  }
}
```

---

### GET /leads/export

Download all leads as a CSV file. Requires auth.

> **RBAC**: Admin exports all leads. Sales users export only their own leads.

**Response** — `200` with `Content-Type: text/csv` and `Content-Disposition: attachment; filename="leads.csv"`

**CSV Format**
```
"Name","Email","Status","Source","Notes","Created At"
"Rahul Sharma","rahul@example.com","Qualified","Instagram","Interested","2024-01-15T10:30:00.000Z"
```

---

### GET /leads/:id

Get a single lead by ID. Requires auth.

**URL Parameter**: `id` — MongoDB ObjectId

**Success Response** `200`
```json
{
  "success": true,
  "data": {
    "lead": {
      "_id": "657a1b2c3d4e5f6789abcdef",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Interested in enterprise plan",
      "createdBy": { "_id": "...", "name": "Admin", "email": "admin@gigflow.com" },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T08:00:00.000Z"
    }
  }
}
```

**Error Responses**

`400` — Invalid ID format
```json
{ "success": false, "message": "Invalid lead ID" }
```

`403` — Sales user trying to access another user's lead
```json
{ "success": false, "message": "Access denied." }
```

`404` — Not found
```json
{ "success": false, "message": "Lead not found." }
```

---

### PUT /leads/:id

Update an existing lead. Requires auth. All fields are optional.

**URL Parameter**: `id` — MongoDB ObjectId

**Request Body** (all fields optional)
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.new@example.com",
  "status": "Contacted",
  "source": "Referral",
  "notes": "Follow-up call scheduled for Monday."
}
```

**Success Response** `200`
```json
{
  "success": true,
  "message": "Lead updated successfully.",
  "data": {
    "lead": { ...updatedLeadObject }
  }
}
```

---

### DELETE /leads/:id

Delete a lead by ID. Requires auth.

> **RBAC**: Admin can delete any lead. Sales users can only delete leads they created.

**URL Parameter**: `id` — MongoDB ObjectId

**Success Response** `200`
```json
{
  "success": true,
  "message": "Lead deleted successfully."
}
```

---

## Error Reference

| Status | Meaning |
|---|---|
| `400` | Bad request / validation failed |
| `401` | Unauthenticated (missing or invalid token) |
| `403` | Forbidden (authenticated but not authorised) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email on register) |
| `429` | Too many requests (rate limit hit) |
| `500` | Internal server error |

---

## Rate Limiting

All `/api/*` routes are rate-limited to **100 requests per 15 minutes** per IP address.

When the limit is exceeded, the response is:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```
