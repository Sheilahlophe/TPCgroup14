## System Requirements 
# A. Functional Requirements

# Learner Registration
* The system shall allow Learners only to register through the public registration page.
The registration process shall validate the required information before creating an account.
* There shall be no option for a user to select an Assessor account during registration.

# Assessor Account Provisioning
* The system shall allow an Admin to create/provision Assessor accounts.
* Assessors shall not register themselves through the public Learner registration page.
* The Admin shall provide the Assessor with authorised login credentials.

# Authentication
* The system shall authenticate:
*   Registered Learners
*   Admin-created Assessors using their authorised credentials.

# Access Control
* The system shall restrict functionality according to the authenticated user's authorisation.
* Learner access:
* Own tasks
* Own progress
* Support requests
* Learning resources
* Mini-game
* Preferences
* Printing
* Assessor access:
* Authorised learner information
* Learner progress
* Support requests
* Resource management
* Admin access:
*   Assessor account provisioning/management
*   Users shall not be able to access functionality outside their authorised access.

# Create Tasks
* The system shall allow a Learner to create a learning task containing:
*   Task title
*   Description
*   Category
*   Status
*   Each task shall be associated with the Learner who created it.

# View Tasks
* The system shall allow Learners to view their own tasks, including:
*   Title
*   Description
*   Category
*   Status
*   Learners shall not be able to access another Learner's private tasks.

# Update Tasks
* The system shall allow Learners to update their own task information, including the task status.

# Delete Tasks
* The system shall allow Learners to delete their own tasks.
* The system shall require confirmation before permanently deleting a task.

# Progress Calculation
* The system shall calculate Learner progress based on task completion.
* The dashboard shall display:
*   Total tasks
*   Completed tasks
*   Outstanding tasks
*   Progress percentage

# Support Session Booking
* The system shall allow Learners to submit support-session requests.
* The system shall validate the booking information and provide appropriate feedback.

# Support Request Management
* The system shall allow authorised Assessors to view and manage Learner support requests.
* Assessors shall be able to update the appropriate booking status.

# Search and Filter
* The system shall allow Learners to search and filter their tasks.

# Learner Resource Access
* The system shall allow Learners to view and access available learning resources.
* Learners shall not be able to modify or delete resources.

# Assessor Resource Management
* The system shall allow authorised Assessors to:
*   Add/upload resources
*   View resources
*   Edit resources
*   Delete resources

*  Resource information shall include appropriate fields such as:
*   title
*   type
*   url
*   description
*   category
*   uploadedBy
*   createdAt

# Mini-Game
* The system shall provide a playable educational mini-game.
* The game shall process user input and produce a meaningful result/score.

# User Preferences
* The system shall allow users to select a non-sensitive preference such as:
* Light theme
* Dark theme
* The selected preference shall be stored using a browser cookie.

# Print Progress
* The system shall allow Learners to print a suitable progress summary.

# Navigation and Redirects
* The system shall provide appropriate navigation and redirects.
*   For example:
    Learner registration
            ↓
    Login
            ↓
    Learner Dashboard
    and:
    Assessor credentials
            ↓
    Login
            ↓
    Assessor Dashboard
    Unauthorised users attempting to access protected functionality shall be denied or redirected.


# B. Non-Functional Requirements

# Security
* The system shall protect user information and restrict access to authorised users.
* Firebase Authentication and appropriate Firebase security rules shall be used.

# Data Privacy
* Learners shall only access their own private learning records.
* Assessors shall only access information required for their authorised responsibilities.

# Usability
* The interface shall be simple, clear and easy to navigate.

# Responsiveness
* The application shall work on:
*   Desktop
*   Tablet
*   Mobile

# Performance
* The system should respond efficiently to normal user actions and database operations.

# Maintainability
* The code shall be:
*   Organised
*   Readable
*   Modular
*   Reusable where appropriate
*   Consistently formatted

# Input Validation
* The system shall validate user input before processing or storing it.

# Error Handling
* The system shall handle errors without crashing and provide understandable feedback.
* The JavaScript implementation shall appropriately use:
*   try
*   catch
*   finally
*   throw
*   and at least one custom error where required.

# Database Integrity
* Records shall be associated with the appropriate authenticated user.
* For example:
    users/{uid}
          ↑
          │
    tasks/{taskId}
          │
          └── userId

# Browser Compatibility
* The application should operate correctly in modern browsers such as Chrome, Edge and Firefox.

# Version Control
* The project shall use Git/GitHub for version control and demonstrate appropriate commits, branches, pull requests, reviews and merges.

# OUR NEW STRUCTURE
* Now everything is much more consistent:
    USER STORIES
        ↓
    REQUIREMENTS
        ↓
    USE CASES
        ↓
    WIREFRAMES
        ↓
    DATABASE
        ↓
    PSEUDOCODE
        ↓
    JAVASCRIPT
        ↓
    TESTING

* And our authentication model is now:
                    ADMIN
                      │
              Creates Assessor
                      │
                      ↓
              Assessor credentials
                      │
                      ↓
                    LOGIN
                      │
                Assessor Dashboard


    Learner
      │
      │ Self-registration
      ↓
    Account created
      │
      ↓
      LOGIN
      │
      ↓
    Learner Dashboard