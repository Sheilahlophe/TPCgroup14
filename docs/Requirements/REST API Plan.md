 ## REST API PLAN — LEARNER SUPPORT PORTAL

1. Purpose of the REST API
The REST API will allow the frontend of the Learner Support Portal to communicate with the backend and database.
It will handle operations such as:
Registering learners
Logging users in
Managing tasks
Calculating/viewing progress
Managing learning resources
Creating support requests
Creating bookings
Allowing Assessors to view and approve/reject bookings
Allowing Admins to create and manage Assessor accounts
The API will use standard HTTP methods such as:
Method
Purpose
GET
Retrieve information
POST
Create new information
PUT
Update existing information
PATCH
Partially update information
DELETE
Remove information

2. API Base URL
During development, the API could use:
/api
For example:
/api/tasks
When the application is deployed, this can be replaced with the actual server URL.

3. Authentication Endpoints
Authentication controls access to the system.
Method
Endpoint
Description
User
POST
/api/auth/register
Register a new learner
Learner
POST
/api/auth/login
Log in to the system
All users
POST
/api/auth/logout
Log out
All users
GET
/api/auth/me
Get current user's information
All users
Example
POST /api/auth/register
Request:
{
  "firstName": "Sarah",
  "lastName": "Mokoena",
  "email": "sarah@example.com",
  "password": "****"
}
The system creates a Learner account.
There must be no role selection during learner registration.

4. Learner Endpoints
Method
Endpoint
Description
GET
/api/learners
Get learners
GET
/api/learners/:id
Get a specific learner
PUT
/api/learners/:id
Update learner information
DELETE
/api/learners/:id
Delete learner account
Access to these endpoints should be restricted according to the user's permissions.

5. Task Endpoints
Method
Endpoint
Description
GET
/api/tasks
Get tasks
GET
/api/tasks/:id
Get one task
POST
/api/tasks
Create a task
PUT
/api/tasks/:id
Update a task
PATCH
/api/tasks/:id/status
Update task completion status
DELETE
/api/tasks/:id
Delete a task
Create Task
POST /api/tasks
Example:
{
  "title": "JavaScript Fundamentals",
  "description": "Complete JavaScript exercise",
  "status": "not_completed"
}
The backend should automatically associate the task with the authenticated learner.
Delete Task
DELETE /api/tasks/:id
The frontend should first display:
Are you sure you want to delete this task?

[ DELETE ] [ CANCEL ]
Only after confirmation should the API request be sent.

6. Progress Endpoints
We agreed that progress should be calculated from tasks rather than stored as a separate value.
Method
Endpoint
Description
GET
/api/progress
Get current learner's progress
GET
/api/progress/:learnerId
Get a learner's progress where authorised
Example Response
{
  "totalTasks": 10,
  "completedTasks": 7,
  "progressPercentage": 70
}
Calculation:
Completed Tasks / Total Tasks × 100
There is no points system.

7. Learning Resource Endpoints
Method
Endpoint
Description
User
GET
/api/resources
View resources
Learner/Assessor
GET
/api/resources/:id
View one resource
Learner/Assessor
POST
/api/resources
Add resource
Assessor
PUT
/api/resources/:id
Update resource
Assessor
DELETE
/api/resources/:id
Delete resource
Assessor
Example:
GET /api/resources
The learner receives a list of available learning materials.

8. Support Request Endpoints
Method
Endpoint
Description
User
GET
/api/support
View support requests
Authorised users
GET
/api/support/:id
View one request
Authorised users
POST
/api/support
Create support request
Learner
PUT
/api/support/:id
Update/respond to request
Assessor
PATCH
/api/support/:id/status
Update request status
Assessor
Learner creates request
POST /api/support
{
  "subject": "JavaScript Help",
  "message": "I need help understanding functions."
}
Initial status:
pending
The Assessor can then respond and change the status.

9. Booking Endpoints
Because we added the booking functionality, this is an important part of the API.
Method
Endpoint
Description
User
GET
/api/bookings
View bookings
Learner/Assessor
GET
/api/bookings/:id
View one booking
Learner/Assessor
POST
/api/bookings
Create booking
Learner
PUT
/api/bookings/:id
Update booking
Authorised user
PATCH
/api/bookings/:id/approve
Approve booking
Assessor
PATCH
/api/bookings/:id/reject
Reject booking
Assessor
DELETE
/api/bookings/:id
Cancel/delete booking
Authorised user
Create Booking
POST /api/bookings
Example:
{
  "assessorId": "A001",
  "date": "2026-09-10",
  "time": "10:00",
  "reason": "Help with JavaScript"
}
The system automatically records:
learnerId
status = "pending"
createdAt
Approve Booking
PATCH /api/bookings/B001/approve
The status changes:
PENDING → APPROVED
Reject Booking
PATCH /api/bookings/B001/reject
The status changes:
PENDING → REJECTED

10. Assessor Management Endpoints
These endpoints are primarily controlled by the Admin.
Method
Endpoint
Description
User
GET
/api/assessors
View assessors
Admin
GET
/api/assessors/:id
View assessor
Admin
POST
/api/assessors
Create assessor account
Admin
PUT
/api/assessors/:id
Update assessor
Admin
PATCH
/api/assessors/:id/status
Activate/deactivate account
Admin
DELETE
/api/assessors/:id
Remove assessor account
Admin
Important
There is no:
POST /api/assessors/register
for self-registration.
Instead:
ADMIN
   ↓
POST /api/assessors
   ↓
Create Assessor Account
   ↓
Credentials provided to Assessor
   ↓
Assessor logs in

11. API Access Control
The API should make sure that users can only perform actions they are authorised to perform.

Function
1. Learner
2. Assessor
3. Admin

Register
✅
❌
❌
Login
✅
✅
✅
Manage own tasks
✅
❌
❌
View own progress
✅
❌
❌
Create support request
✅
❌
❌
Respond to support
❌
✅
❌
View bookings
Own
Assigned/available
As required
Create booking
✅
❌
❌
Approve booking
❌
✅
❌
Reject booking
❌
✅
❌
Add resources
❌
✅
❌
Create assessor
❌
❌
✅
Manage assessor access
❌
❌
✅

12. Complete REST API Summary
For your project report, this is the clean table I recommend including:
Resource
GET
POST
PUT/PATCH
DELETE
Authentication
✓
✓
—
—
Learners
✓
✓*
✓
✓
Tasks
✓
✓
✓
✓
Progress
✓
—
—
—
Resources
✓
✓
✓
✓
Support
✓
✓
✓
—
Bookings
✓
✓
✓
✓
Assessors
✓
✓**
✓
✓
* Learner registration
** Admin creates assessor account

13. REST API Flow
The overall system communication can be represented as:
┌──────────────┐
│   FRONTEND   │
│  Web Portal  │
└──────┬───────┘
       │
       │ HTTP Requests
       ↓
┌──────────────────────┐
│       REST API       │
├──────────────────────┤
│ Authentication       │
│ Learners             │
│ Tasks                │
│ Progress             │
│ Resources            │
│ Support              │
│ Bookings             │
│ Assessors            │
└──────────┬───────────┘
           │
           │ Database Requests
           ↓
┌──────────────────────┐
│   Firebase/Firestore │
└──────────────────────┘

14. Short Description for the Project Report
The Learner Support Portal will use a REST API to allow the frontend application to communicate with the backend and database. The API will provide endpoints for authentication, learner registration, task management, progress tracking, learning resources, support requests, bookings and assessor management. HTTP methods such as GET, POST, PUT, PATCH and DELETE will be used according to the operation being performed. Access control will ensure that learners, assessors and administrators can only perform actions appropriate to their permissions.