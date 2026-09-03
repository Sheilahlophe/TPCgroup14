##  Project Scope — Learner Support Portal


1. Scope Statement

  * The Learner Support Portal is a web-based system designed to help Learners organise and manage their learning activities while providing Assessors with tools to support and monitor Learners.
  * The system will allow Learners to register their own accounts, manage learning tasks, monitor their progress, request support sessions, access learning resources and participate in an educational mini-game.
  * Assessors will not register themselves. Assessor accounts will be created/provisioned by an Admin, who will provide authorised credentials to the Assessor. Assessors will then use those credentials to access the Assessor area.
  * The system will use Firebase for authentication and data storage, with appropriate access controls to protect user information.


2. In Scope
  * The following functionality is included in the project.

  2.1 Learner Registration and Authentication
    * The system will allow:
      *  Learners to register their own accounts.
      *  Learners to log in and log out.
      *  Admins to create/provision Assessor accounts.
      *  Assessors to log in using credentials provided by the Admin.
      *  The system to restrict access to authorised functionality.
      *  There will be no public option to select "Learner" or "Assessor" during  registration.

  2.2 Task Management
    * Learners will be able to:
      *  Create tasks.
      *  View their tasks.
      *  Update tasks.
      *  Change task status.
      *  Set task priority.
      *  Set task categories.
      *  Set due dates.
      *  Delete tasks.
      *  Task deletion will require confirmation before the task is permanently removed.

  2.3 Progress Tracking
    * The system will calculate and display Learner progress based on task information.
    * It will include:
      * Total tasks.
      * Completed tasks.
      * Outstanding tasks.
      * Overdue tasks.
      * Progress percentage.
      * Printable progress summary.
      * The Points system is excluded from the project.

  2.4 Support Session Booking
    * Learners will be able to:
      * Request a support session.
      * Enter the required booking information.
      * View their support requests.
      * View the status of their requests.
      * Assessors will be able to:
      * View authorised support requests.
      * Review booking information.
      * Update the status of support requests.

  2.5 Learning Resources
    * Learners will be able to:
      * View available learning resources.
      * Search/filter resources where applicable.
      * Open/access resources.
      * Assessors will be able to:
      * Add/upload learning resources.
      * View resources.
      * Edit resources.
      * Delete resources.
      * Learners will not be able to modify or delete resources.

  2.6 Search and Filtering
    * Learners will be able to search and filter their tasks using relevant information such as:
      * Task title.
      * Category.
      * Priority.
      * Status.

  2.7 Educational Mini-Game
    * The system will contain an educational mini-game that:
      * Can be accessed by Learners.
      * Accepts Learner input.
      * Uses JavaScript to process the game logic.
      * Produces a result.
      * Calculates a score where applicable.
      * Allows the Learner to play again.
      * The game score is not part of the Learner's main progress calculation.

  2.8 User Preferences
    * The system will allow users to select a display preference such as:
      * Light mode.
      * Dark mode.
      * The selected preference will be stored using browser cookies.

  2.9 Database
    * Firebase will be used to store the application's data.
    * The planned data areas include:
      * users
      * tasks
      * bookings
      * resources
      * gameScores
      * preferences
      * The database will associate records with the appropriate users and apply security rules to prevent unauthorised access.

  2.10 User Interface
      * The project will include appropriate interfaces/wireframes for:
        * Registration.
        * Login.
        * Learner Dashboard.
        * Task management.
        * Task deletion confirmation.
        * Progress.
        * Support booking.
        * Learning resources.
        * Mini-game.
        * Assessor Dashboard.
        * Resource management.


3. Out of Scope
  * The following functionality will not form part of the current project.

  3.1 Public Assessor Registration
    * Assessors will not be able to register themselves through the public registration page.
    * Their accounts will be created/provisioned by the Admin.

  3.2 Points and Gamification System
    * The system will not include a points-based learner progress system.
    * The mini-game may have its own score, but this score will not be used to calculate academic/task progress.

  3.3 Online Payments
    * The system will not process:
      * Payments.
      * Subscriptions.
      * Purchases.
      * Online transactions.

  3.4 Full Learning Management System
    * The project will not provide a complete LMS with functionality such as:
      * Online examinations.
      * Automated grading.
      * Course certification.
      * Video conferencing.
      * Full course authoring.

  3.5 Social Networking
    * The system will not include:
      * Public learner profiles.
      * Social feeds.
      * Followers.
      * Direct social messaging.

  3.6 Mobile Application
    * The current project is a web application. A dedicated Android or iOS application is outside the current scope.
    * The web application should, however, be responsive on mobile devices.


4. Target Users
  * The system will have three controlled user categories:
    * User
      * Main Responsibilities

    * Learner
      * Register, manage tasks, monitor progress, request support, access resources and play the game

    * Assessor
      * Support Learners, manage support requests and manage learning resources

    * Admin
      * Create/provision Assessor accounts and manage authorised Assessor access

5. Scope Boundaries
 * The project focuses specifically on learner organisation and support.
  * The main relationship is:
                        ADMIN
                          │
                Creates Assessor
                          │
                          ▼
                      ASSESSOR
                    ↙️        ↘️
          Support Learners   Resources
                  │              │
                  ▼              ▼
              LEARNER ───→ Learning
                  │          Resources
                  │
          ┌──────┼─────────┐
          ↓      ↓         ↓
        Tasks  Progress  Support
                          Requests


6. Scope Summary
  * The project will deliver a secure, responsive web-based Learner Support Portal that enables Learners to manage their learning activities and enables authorised Assessors to provide learning support.
  * The project will focus on authentication and access control, task management, progress calculation, support booking, learning resources, searching/filtering, user preferences and an educational mini-game.
  * The system will use Firebase for authentication and database functionality and will be developed using appropriate programming practices, including JavaScript, pseudocode, Git and GitHub.
