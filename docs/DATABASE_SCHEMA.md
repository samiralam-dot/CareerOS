# CareerOS Database Schema

## Overview

CareerOS uses a structured database with the following core collections/tables. All IDs are server-generated. Timestamps are stored in ISO 8601 format.

---

## Collections / Tables

### 1. **users**

Master collection for all user accounts.

```
users
  - _id          : ObjectId / UUID        (primary key)
  - email        : string                 (unique)
  - password     : string                 (hashed)
  - fullName     : string
  - role         : enum(student, recruiter, admin)
  - isActive     : boolean                (default: true)
  - lastLoginAt  : timestamp?
  - createdAt    : timestamp
  - updatedAt    : timestamp
```

**Indexes:** `email` (unique), `role`

---

### 2. **students**

Student-specific profile data.

```
students
  - _id               : ObjectId / UUID
  - userId            : ref → users._id    (unique)
  - rollNumber        : string
  - branch            : string
  - degree            : string             (B.Tech, M.Tech, etc.)
  - graduationYear    : number
  - cgpa              : number
  - skills            : array<string>
  - certifications    : array<{
        name          : string,
        issuer        : string,
        issueDate     : date,
        credentialUrl : string?
      }>
  - projects          : array<{
        title         : string,
        description   : string,
        technologies  : array<string>,
        githubUrl     : string?,
        liveUrl       : string?
      }>
  - experience        : array<{
        company       : string,
        position      : string,
        duration      : string,
        description   : string
      }>
  - resumeUrl         : string?            (Cloudinary URL)
  - profilePictureUrl : string?            (Cloudinary URL)
  - linkedinUrl       : string?
  - githubUrl         : string?
  - createdAt         : timestamp
  - updatedAt         : timestamp
```

**Indexes:** `userId` (unique), `cgpa`, `branch`, `graduationYear`

**Use Cases:** Student profile management, eligibility filtering, resume building, candidate search.

---

### 3. **recruiters**

Recruiter and company profile data.

```
recruiters
  - _id               : ObjectId / UUID
  - userId            : ref → users._id    (unique)
  - companyName       : string
  - designation       : string
  - companyWebsite    : string?
  - companySize       : string?
  - industry          : string?
  - companyLogoUrl    : string?            (Cloudinary URL)
  - description       : string?
  - location          : string?
  - contactNumber     : string?
  - isVerified        : boolean            (default: false)
  - verifiedBy        : ref → users._id?  (admin)
  - verificationDate  : timestamp?
  - createdAt         : timestamp
  - updatedAt         : timestamp
```

**Indexes:** `userId` (unique), `isVerified`, `companyName`

**Use Cases:** Recruiter profile management, company verification, job posting authorization.

---

### 4. **jobs**

Job and internship postings.

```
jobs
  - _id                 : ObjectId / UUID
  - recruiterId         : ref → recruiters._id
  - companyName         : string
  - title               : string
  - description         : string
  - type                : enum(internship, full_time, part_time, contract)
  - workMode            : enum(remote, hybrid, onsite)
  - location            : string?
  - duration            : string?
  - salary              : {
        min             : number,
        max             : number,
        currency        : string
      }
  - eligibility         : {
        minCGPA         : number?,
        degrees         : array<string>?,
        branches        : array<string>?,
        graduationYears : array<number>?
      }
  - requiredSkills      : array<string>
  - responsibilities    : array<string>
  - benefits            : array<string>?
  - applicationDeadline : timestamp
  - attachmentUrls      : array<string>?  (Cloudinary URLs)
  - isActive            : boolean          (default: true)
  - applicationsCount   : number           (default: 0)
  - createdAt           : timestamp
  - updatedAt           : timestamp
```

**Indexes:** `recruiterId`, `isActive`, `type`, compound(`isActive`, `createdAt`)

**Use Cases:** Job listings, search and filtering, eligibility checking, application tracking.

---

### 5. **applications**

Student job applications.

```
applications
  - _id           : ObjectId / UUID
  - studentId     : ref → students._id
  - jobId         : ref → jobs._id
  - status        : enum(applied, shortlisted, interview_scheduled, selected, rejected)
                    (default: applied)
  - statusHistory : array<{
        status    : string,
        timestamp : timestamp,
        note      : string?
      }>
  - resumeUrl     : string               (Cloudinary URL at time of apply)
  - coverLetter   : string?
  - offeredSalary : number?
  - joiningDate   : timestamp?
  - feedback      : string?
  - createdAt     : timestamp            (= appliedAt)
  - updatedAt     : timestamp
```

**Indexes:** `studentId`, `jobId`, compound(`jobId`, `status`), `status`

**Use Cases:** Application tracking, status management, recruiter shortlisting, placement statistics.

---

### 6. **interviews**

Interview scheduling and management.

```
interviews
  - _id           : ObjectId / UUID
  - jobId         : ref → jobs._id
  - recruiterId   : ref → recruiters._id
  - students      : array<ref → students._id>
  - date          : string               (e.g. "2024-12-20")
  - time          : string               (e.g. "10:00 AM")
  - meetingLink   : string?
  - location      : string?
  - status        : enum(scheduled, completed, cancelled, rescheduled)
                    (default: scheduled)
  - feedback      : string?
  - notes         : string?
  - createdAt     : timestamp
  - updatedAt     : timestamp
```

**Indexes:** `jobId`, `recruiterId`, compound(`students`, `date`)

**Use Cases:** Interview scheduling, calendar view, feedback recording, rescheduling.

---

### 7. **notifications**

User notifications.

```
notifications
  - _id       : ObjectId / UUID
  - userId    : ref → users._id
  - title     : string
  - message   : string
  - read      : boolean         (default: false)
  - readAt    : timestamp?
  - createdAt : timestamp
```

**Indexes:** `userId`, compound(`userId`, `read`)

**Use Cases:** User alerts, application status updates, interview invites, system announcements.

---

### 8. **reports**

Generated placement reports.

```
reports
  - _id         : ObjectId / UUID
  - type        : enum(placement, recruitment, analytics)
  - period      : {
        startDate : timestamp,
        endDate   : timestamp
      }
  - summary     : object          (aggregated statistics)
  - generatedAt : timestamp
  - createdBy   : ref → users._id (admin)
  - createdAt   : timestamp
```

**Indexes:** `createdBy`, compound(`type`, `createdAt`)

**Use Cases:** Placement reports, data export, historical tracking.

---

### 9. **analytics**

Aggregated metrics cache.

```
analytics
  - _id       : ObjectId / UUID
  - type      : enum(daily, weekly, monthly)
  - date      : timestamp
  - metrics   : {
        totalApplications : number,
        totalPlacements   : number,
        avgSalary         : number,
        topCompanies      : array<object>,
        branchWiseStats   : object
      }
  - updatedAt : timestamp
```

**Indexes:** compound(`type`, `date`)

**Use Cases:** Dashboard analytics, trend analysis, admin insights.

---

## Relationships

### One-to-One

```
users  ──────  students
users  ──────  recruiters
```

### One-to-Many

```
recruiters  ──────<  jobs
jobs        ──────<  applications
students    ──────<  applications
users       ──────<  notifications
jobs        ──────<  interviews
```

### Many-to-Many (through applications)

```
students  >──────<  jobs   (via applications)
```

---

## Data Flow

### 1. Student Registration

```
POST /user/signup
  └─ Create user record (role: student)
POST /profile/create
  └─ Create student profile linked to userId
```

### 2. Job Application

```
POST /upload
  └─ Upload resume → Cloudinary → get resumeUrl
POST /application/apply
  └─ Create application (status: applied)
  └─ Increment jobs.applicationsCount
POST /notification/create
  └─ Notify recruiter of new application
```

### 3. Status Update

```
PUT /application/:id  { status: 'shortlisted' }
  └─ Update application.status
  └─ Append to application.statusHistory
POST /notification/create
  └─ Notify student of status change
```

### 4. Interview Scheduling

```
POST /interview/create  { jobId, students[], date, time, meetingLink }
  └─ Create interview record
POST /notification/create  (per student)
  └─ Notify each student of interview details
```

---

## Best Practices

1. Use **transactions** for operations that touch multiple collections (e.g. apply + increment count)
2. **Paginate** all list endpoints — never return unbounded arrays
3. Always **validate on both client and server** before writing to DB
4. Store Cloudinary **publicId alongside URL** for future deletion via `DELETE /deletefile`
5. Append to `statusHistory` array on every status change — never overwrite history
6. Use **compound indexes** on frequently filtered fields (jobId + status, userId + read)
7. **Soft delete** with `isActive: false` on jobs rather than hard deletes

---

## Future Extensions

1. **messages** — Direct recruiter ↔ student chat
2. **events** — Placement drives and workshops
3. **feedback** — Platform improvement collection
4. **auditLogs** — Admin compliance and change tracking
