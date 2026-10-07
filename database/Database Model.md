## DATABASE MODEL — LEARNER SUPPORT PORTAL

1. Database Overview
The system will use a database to store and manage information about learners, assessors, administrators, tasks, learning resources and support requests.
The database will allow information to be securely stored and retrieved when users register, log in, manage tasks, monitor progress, access resources and request support.
For the project, Firebase Fire-store is a suitable database because it can store application data in collections and documents and can work well with a web application.

2. Main Collections
The proposed database will contain the following collections:
users
assessors
tasks
resources
supportRequests
However, there is an important design choice here.
Because Learners, and Assessors have different information and access requirements, we can keep their information in separate collections.

3. Database Structure
Collection 1: learners
Stores information about learners who register themselves.
Field
Data Type

Description
learnerId : String
Unique ID for the learner
firstName - String
Learner's first name
lastName - String
Learner's surname
email - String
Learner's email address
password - String

Authentication credential*
createdAt - Timestamp
Date/time account was created
Example:
learners
 └── learnerId
      ├── firstName: "Sarah"
      ├── lastName: "Smith"
      ├── email: "sarah@email.com"
      └── createdAt: timestamp
Important: If using Firebase Authentication, the password should not be stored directly in the Fire-store learners document. Firebase Authentication handles passwords securely. The database stores the user's Firebase uid.

4. assessors
Stores accounts created by the Admin on firebase.
Field
Data Type
Description
assessorId - String
Unique assessor ID
firstName -String
Assessor's first name
lastName - String
Assessor's surname
email - String
Assessor's email
username - String
Assessor login username
status - String

Account status
createdAt - Timestamp
Account creation date
createdBy - String
ID of Admin who created account
Example:
assessors
 └── assessorId / uid
      ├── firstName: "John"
      ├── lastName: "Doe"
      ├── email: "john@example.com"
      ├── username: "johndoe"
      ├── status: "active"
      ├── createdAt: timestamp
      └── createdBy: "adminId"


6. tasks
Stores tasks belonging to learners.
Field
Data Type
Description
taskId - String
Unique task ID
learnerId - String
ID of the learner who owns the task
title - String

Task title
description - String
Task description
status - String
Completed / Not Completed

createdAt - Timestamp
Date task was created
updatedAt - Timestamp
Date task was last updated
Example:
tasks
 └── taskId
      ├── learnerId: "L001"
      ├── title: "JavaScript Fundamentals"
      ├── description: "Complete JavaScript exercise"
      ├── status: "completed"
      ├── createdAt: timestamp
      └── updatedAt: timestamp

7. resources
Stores learning materials available to learners.
Field
Data Type
Description
resourceId - String
Unique resource ID
title - String
Resource title
description - String
Resource description
resourceType - String
Video, document, link, etc.
resourceUrl - String
Location of resource 
createdBy - String

Assessor who added resource
createdAt- Timestamp
Date resource was added
Example:
resources
 └── resourceId
      ├── title: "JavaScript Fundamentals"
      ├── description: "Introduction to JavaScript"
      ├── resourceType: "document"
      ├── resourceUrl: "..."
      ├── createdBy: "A001"
      └── createdAt: timestamp

8. supportRequests
Stores learner requests for assistance.
Field
Data Type
Description
requestId - String
Unique support request ID
learnerId - String

Learner who submitted the request
subject - String
Support request subject
message - String
Learner's problem/request
status - String

Pending / Resolved
assessorId - String

Assessor handling the request
response - String
Assessor's response

createdAt - Timestamp
Request creation date
updatedAt - Timestamp
Last update
Example:
supportRequests
 └── requestId
      ├── learnerId: "L001"
      ├── subject: "JavaScript Help"
      ├── message: "I need help with my task."
      ├── status: "pending"
      ├── assessorId: "A001"
      ├── response: ""
      ├── createdAt: timestamp
      └── updatedAt: timestamp

9. Relationships Between Collections
The important relationships are:
LEARNER
   │
   ├──────────< TASKS
   │
   └──────────< SUPPORT REQUESTS
                         │
                         │
                         ↓
                     ASSESSOR


ASSESSOR
   │
   └──────────< RESOURCES


ADMIN
   │
   └──────────< ASSESSOR ACCOUNTS


10. Progress Calculation
We don't need a separate progress collection.
The system can calculate progress from the learner's tasks.
For example:
Total Tasks = 10
Completed Tasks = 7

Progress =
7 ÷ 10 × 100

Progress = 70%
Therefore:
Learner
   ↓
Tasks
   ↓
Count completed tasks
   ↓
Count total tasks
   ↓
Calculate percentage
   ↓
Display Progress
This is better than storing a progress percentage because the percentage could become incorrect when a learner adds or deletes a task.

11. Firebase Fire-store Structure
For your actual project, I would represent it approximately like this:
Fire-store Database
│
├── learners
│    └── learnerId
│         ├── firstName
│         ├── lastName
│         ├── email
│         └── createdAt
│
├── assessors
│    └── assessorId
│         ├── firstName
│         ├── lastName
│         ├── email
│         ├── username
│         ├── status
│         └── createdAt
│
├── admins - The owner of firebase account.
│    
│
├── tasks
│    └── taskId
│         ├── learnerId
│         ├── title
│         ├── description
│         ├── status
│         ├── createdAt
│         └── updatedAt
│
├── resources
│    └── resourceId
│         ├── title
│         ├── description
│         ├── resourceType
│         ├── resourceUrl
│         ├── createdBy
│         └── createdAt
│
└── supportRequests
     └── requestId
          ├── learnerId
          ├── subject
          ├── message
          ├── status
          ├── assessorId
          ├── response
          ├── createdAt
          └── updatedAt

12. Database Model Summary for Your Report

The Learner Support Portal will use Firebase Fire-store as its database. The database will contain collections for learners, assessors, administrators, tasks, learning resources and support requests. Learners will be able to create their own accounts and manage their tasks, while assessor accounts will be created by the Admin. Each task will be linked to the learner who owns it, and support requests will be linked to both the learner and the assessor handling the request. Learner progress will be calculated dynamically from completed and total tasks rather than being stored as a separate value. Passwords will be handled by Firebase Authentication rather than stored as plain text in Fire-store.

