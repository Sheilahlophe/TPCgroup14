# Programming Life Cycle — Learner Support Portal

1. Problem Identification
  * The project aims to develop a Learner Support Portal that helps learners organise their learning activities, monitor their progress, request support, and access learning resources.
  * The system will also provide Assessors with tools to support learners, including managing support requests and uploading learning resources.

2.  Requirements Analysis
  * During this stage, the team identifies and documents what the system needs to do.
  * Functional requirements include:
    * Learner registration and login
    * Admin-controlled Assessor account creation
    * User authentication and access control
    * Task creation, viewing and updating
    * Task deletion with confirmation
    * Progress calculation
    * Support-session requests
    * Assessor management of support requests
    * Task searching and filtering
    * Learner access to learning resources
    * Assessor upload and management of resources
    * Educational mini-game
    * User preferences
    * Printing of progress summaries

  * Non-functional requirements include:
    * Security
    * Data privacy
    * Usability
    * Responsiveness
    * Performance
    * Maintainability
    * Input validation
    * Error handling
    * Database integrity
    * Browser compatibility
    * The requirements are linked to the User Stories and Acceptance Criteria.

3.  System Design
  * During this stage, the team designs how the system will work before writing the code.
    * The team will design:
      * User Interface
      * Wireframes will be created for important screens such as:
      * Learner registration
      * Login
      * Learner dashboard
      * Task management
      * Task deletion confirmation
      * Progress
      * Support booking
      * Learning resources
      * Mini-game
      * Assessor dashboard
      * Resource management
      * Database
      * The project will use Firebase to store and manage application data.
      * The planned data will include areas such as:
      * users
      * tasks
      * bookings
      * resources
      * gameScores
      * preferences

  * Access Control
  * The design will ensure that:
    * Learner
      → Learner functions

    * Assessor
      → Assessor functions

    * Admin
      → Assessor account management
    
    * Learners will register themselves, while Assessors will be registered/provisioned by the Admin.

4. Algorithm Design
  * Before coding, the team will plan the logic required for important system functions.
  * For this project, we will use pseudocode rather than flowcharts.
  * Important algorithms will include:
    * Learner registration
    * Login and authentication
    * Task creation
    * Task updating
    * Task deletion and confirmation
    * Progress calculation
    * Support booking
    * Resource management
    * Searching/filtering
    * Access control
  * The pseudocode will be checked against the relevant User Stories, Requirements and Acceptance Criteria before implementation.

5. Implementation / Coding
  * The team will implement the system using the selected technologies.
  * The project will use technologies such as:
    * HTML
    * CSS
    * JavaScript
    * Firebase
    * Git
    * GitHub

  * JavaScript will be used for application logic, including:
    * Form handling
    * Task management
    * Progress calculations
    * Searching and filtering
    * Authentication-related interface logic
    * Resource management
    * Mini-game logic
    * Error handling
    * Firebase will be used for authentication and data storage.

6. Testing
  * The team will test the system to ensure that it meets the Requirements and Acceptance Criteria.
  * Testing will include:
    * Functional Testing
    * Check whether each feature works as expected.
    * For example:
      * Can a Learner create a task?
      * Can the Learner delete the task after confirmation?
      * Can an Assessor upload a learning resource?

    * Validation Testing
    * Check invalid input such as:
      * Empty fields
      * Invalid email
      * Incorrect login credentials
      * Invalid task information

    * Access-Control Testing
    * Check that:
      * Learners cannot access Assessor functions.
      * Learners cannot modify another Learner's tasks.
      * Assessors cannot access Admin-only functions.
      * Unauthorised users cannot access protected areas.

    * Database Testing
    * Check that information is:
      * Correctly stored
      * Retrieved correctly
      * Updated correctly
      * Deleted correctly
      * Associated with the correct user

    * Usability Testing
    * Check that the interface is:
      * Easy to navigate
      * Understandable
      * Responsive
      * Consistent    

8. Deployment
  * Once the system has been tested and meets the agreed requirements, it will be prepared for deployment.
  * The team will:
    * Finalise the code
    * Check Firebase configuration
    * Verify security rules
    * Perform final testing
    * Prepare the production version
    * Ensure the application can be accessed by authorised users   

 9. Review and Evaluation
  * After implementation, the team will evaluate whether the project meets the original objectives.
  * The team will compare:
      Requirements
      ↓
      User Stories
      ↓
      Acceptance Criteria
      ↓
      Implemented Features
      ↓
      Test Results

  * The team will identify any remaining issues and make improvements where necessary.
  * Our Programming Life Cycle
      1. Problem Identification
                ↓
      2. Requirements Analysis
                ↓
      3. System Design
                ↓
      4. Algorithm Design
                ↓
      5. Implementation / Coding
                ↓
      6. Testing
                ↓
      7. Debugging & Maintenance
                ↓
      8. Deployment
                ↓
      9. Review & Evaluation       