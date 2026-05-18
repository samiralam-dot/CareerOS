# CareerOS API Documentation

## Overview

CareerOS uses a RESTful HTTP API. All requests are made to:

```
BASE_URL = VITE_BASE_URL  (set in your .env file)
```

Authentication is cookie-based. Pass `withCredentials: true` on protected routes. Requests and responses use `application/json` unless otherwise noted.

---

## Authentication

### Sign In

**POST** `/user/login`

```javascript
import { signIn } from '@services/api';

await signIn(email, password);
```

Stores the returned user object and role in `sessionStorage`.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response:**

```json
{
  "user": {
    "id": "user-id",
    "role": "student"
  }
}
```

---

### Sign Up

**POST** `/user/signup`

```javascript
import { signUp } from '@services/api';

await signUp(userData);
```

**Request Body:** Any user data object (varies by role).

---

### Sign Out

**POST** `/user/signout`

```javascript
import { signOut } from '@services/api';

await signOut();
```

---

## User API

### Get All Users

**GET** `/user`

```javascript
import { getAllUser } from '@services/api';

const users = await getAllUser();
```

---

### Get User by ID

**GET** `/user/:id`

```javascript
import { getuserById } from '@services/api';

const user = await getuserById(userId);
```

---

### Update User

**PUT** `/user/:id` 🔒

```javascript
import { updateUser } from '@services/api';

await updateUser(userId, {
  fullName: 'Updated Name',
  phone: '9876543210'
});
```

---

## Profile API

### Get Profile

**GET** `/profile` 🔒

```javascript
import { getProfile } from '@services/api';

const profile = await getProfile();
```

---

### Update / Create Profile

**POST** `/profile/create` 🔒

```javascript
import { updateProfile } from '@services/api';

const user = await updateProfile({
  bio: 'Full-stack developer',
  skills: ['React', 'Node.js'],
  cgpa: 8.5
});
```

**Returns:** Updated user object.

---

## Job API

### Get All Jobs

**GET** `/job`

```javascript
import { getAlljob } from '@services/api';

const jobs = await getAlljob();
```

**Returns:** Array of job objects.

---

### Get Job by ID

**GET** `/job/:id`

```javascript
import { getjobById } from '@services/api';

const job = await getjobById(jobId);
```

---

### Create Job

**POST** `/job/create` 🔒

```javascript
import { createJob } from '@services/api';

await createJob({
  title: 'Software Engineer Intern',
  companyName: 'Tech Corp',
  description: 'Job description...',
  type: 'internship',
  location: 'Remote',
  applicationDeadline: '2024-12-31'
});
```

---

### Update Job

**PUT** `/job/:id` 🔒

```javascript
import { updatejob } from '@services/api';

await updatejob(jobId, {
  title: 'Updated Title',
  description: 'Updated description'
});
```

---

### Delete Job

**DELETE** `/job/:id` 🔒

```javascript
import { deletejob } from '@services/api';

await deletejob(jobId);
```

---

## Application API

### Create Application

**POST** `/application/apply` 🔒

```javascript
import { createApplication } from '@services/api';

await createApplication({
  jobId: 'job-id',
  studentId: 'student-id',
  resumeUrl: 'https://...'
});
```

---

### Get Application by ID

**GET** `/application/:id` 🔒

```javascript
import { findapplication } from '@services/api';

const application = await findapplication(applicationId);
```

---

### Update Application

**PUT** `/application/:id` 🔒

```javascript
import { updateApplication } from '@services/api';

await updateApplication(applicationId, {
  status: 'shortlisted'
});
```

---

## Interview API

### Create Interview

**POST** `/interview/create` 🔒

```javascript
import { createInterview } from '@services/api';

await createInterview(
  jobId,
  ['student-id-1', 'student-id-2'],
  '2024-12-20',
  '10:00 AM',
  'https://meet.google.com/...'
);
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `jobId` | string | Associated job ID |
| `students` | array | Array of student IDs |
| `date` | string | Interview date |
| `time` | string | Interview time |
| `meetingLink` | string | Video call link |

---

### Update Interview

**PUT** `/interview/update/:id` 🔒

```javascript
import { updateInterview } from '@services/api';

await updateInterview(interviewId, {
  date: '2024-12-25',
  time: '2:00 PM'
});
```

---

### Delete Interview

**DELETE** `/interview/delete/:id` 🔒

```javascript
import { deleteInterview } from '@services/api';

await deleteInterview(interviewId);
```

---

## Notification API

### Create Notification

**POST** `/notification/create`

```javascript
import { createNotification } from '@services/api';

await createNotification(
  'Application Update',
  'Your application has been shortlisted.',
  userId
);
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Notification title |
| `message` | string | Notification body |
| `userId` | string | Recipient user ID |

---

### Mark Notification as Read

**PUT** `/notification/:id`

```javascript
import { updateNotification } from '@services/api';

await updateNotification(notificationId);
```

Sets `read: true` on the notification.

---

## Mail API

### Send OTP / Custom Email

**POST** `/send-mail`

```javascript
import { sendOtpMail } from '@services/api';

await sendOtpMail(
  'user@example.com',
  'Your OTP Code',
  '<p>Your OTP is <strong>123456</strong></p>'
);
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Recipient email address |
| `subject` | string | Email subject |
| `html` | string | HTML email body |

---

## File API

### Upload Files

**POST** `/upload` 🔒

Accepts `multipart/form-data`. Multiple files can be uploaded in a single request.

```javascript
import { uploadFiles } from '@services/api';

const result = await uploadFiles(fileArray);
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `files` | FileList / File[] | One or more files to upload |

---

### Delete File

**DELETE** `/deletefile`

```javascript
import { deleteFile } from '@services/api';

await deleteFile('cloudinary-public-id', 'image'); // resourceType optional
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `publicId` | string | ✅ | File's public ID |
| `resourceType` | string | ❌ | e.g. `image`, `raw`, `video` |

---

## Error Handling

All API functions throw on failure. Always wrap in try-catch:

```javascript
try {
  await createApplication(data);
  toast.success('Application submitted!');
} catch (error) {
  console.error('Error:', error);
  toast.error(error.message || 'Something went wrong');
}
```

Errors from `axios` expose `error.response?.data` for server-side messages. Where present, the API service layer re-throws this directly.

---

## Example: Full Application Flow

```javascript
import { useState } from 'react';
import { uploadFiles } from '@services/api';
import { createApplication } from '@services/api';
import toast from 'react-hot-toast';

const ApplyButton = ({ jobId, studentId }) => {
  const [loading, setLoading] = useState(false);

  const handleApply = async (resumeFile) => {
    setLoading(true);
    try {
      // 1. Upload resume
      const uploadResult = await uploadFiles([resumeFile]);
      const resumeUrl = uploadResult.url; // adjust to your response shape

      // 2. Submit application
      await createApplication({ jobId, studentId, resumeUrl });
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={() => handleApply(selectedFile)}>
      {loading ? 'Applying...' : 'Apply Now'}
    </button>
  );
};
```

---

## Security

- 🔒 Protected routes require an active session cookie (`withCredentials: true`)
- All traffic should be over HTTPS in production
- Role-based access is enforced server-side

---

## Best Practices

1. Always handle errors with try-catch
2. Show loading states during API calls
3. Validate inputs on both client and server side
4. Clean up any side effects (e.g. uploaded files) on failure
5. Use `sessionStorage` to persist user session data across page reloads (already handled by `signIn`)