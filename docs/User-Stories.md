## USER STORIES

# Learner Registration and Login
* As a Learner, I want to register and log into the system so that I can securely access my Learner Dashboard and manage my learning activities.

# Acceptance Criteria
* Only Learners can register through the public registration page.
* The Learner must provide the required registration information.
* The system validates the registration information.
* The system prevents registration with an existing email address.
* The system creates the Learner account after successful registration.
* An Assessor cannot register through the Learner registration page.
* An Assessor receives login credentials from the Admin.
* A Learner can log in using their registered credentials.
* An authorised Assessor can log in using credentials provided by the Admin.
* Invalid login credentials produce an appropriate error message.
* Successful login takes the user to the appropriate dashboard.
* Users can log out.


# Manage Learning Tasks
* As a Learner, I want to create, view, update and complete my learning tasks so that I can organise and manage my learning activities.

# Acceptance Criteria
* Learner can create a task.
* Learner can enter a title and description.
* Learner can select a category.
* Learner can select a priority.
* Learner can enter a due date.
* Learner can view their own tasks.
* Learner can edit their own tasks.
* Learner can change task status.
* Tasks are stored in Firebase.
* Each task is associated with the Learner who created it.
* Learners cannot modify another Learner's tasks.

# Delete Learning Tasks
* As a Learner, I want to delete unwanted tasks after confirming the deletion so that I can keep my task list organised.

# Acceptance Criteria
* A delete option is available for the Learner's task.
* The system displays a confirmation dialog before deletion.
* Selecting Cancel keeps the task.
* Selecting Confirm/Delete removes the task.
* The deleted task is removed from Firebase.
* The task disappears from the displayed task list.
* The system displays appropriate success/error feedback.
* A Learner cannot delete another Learner's task.

# View and Calculate Progress
* As a Learner, I want to see my learning progress so that I can understand how much of my work I have completed.

# Acceptance Criteria
* The system displays the total number of tasks.
* The system counts completed tasks.
* The system counts outstanding tasks.
* The system identifies overdue tasks.
* The system calculates an overall progress percentage.
* Progress is calculated from the Learner's actual task data.
* Progress updates when task status changes.
* The Learner can print a progress summary.
* No Points system is included.

# Request a Support Session
* As a Learner, I want to request a support session so that I can receive assistance with my learning.

# Acceptance Criteria
* Learner can access the support booking form.
* Learner can provide the required booking information.
* Required fields are validated.
* The booking is saved to Firebase.
* A new booking receives an appropriate status, such as pending.
* The Learner receives confirmation after submitting the request.
* An appropriate error message is displayed if submission fails.
* Learner can view their submitted support requests.

# Manage Learner Support
* As an Assessor, I want to view and manage learner support requests so that I can provide appropriate assistance to Learners.

# Acceptance Criteria
* Only an authorised Assessor can access the Assessor Dashboard.
* Assessor can view authorised support requests.
* Assessor can view relevant booking information.
* Assessor can update the booking status.
* Updated booking information is saved to Firebase.
* The Learner can see the updated status of their request.
* Assessor cannot access Admin-only account-management functions.

# Search and Filter Tasks
* As a Learner, I want to search and filter my tasks so that I can quickly find the work I need.

# Acceptance Criteria
* Learner can search for tasks.
* Matching tasks are displayed.
* Learner can filter tasks by relevant criteria such as status, category or priority.
* The task list updates when filters are applied.
* Searching/filtering does not modify the stored task data.
* JavaScript array methods are used to process the task information.

# Access Learning Resources
* As a Learner, I want to access learning materials and resources so that I can use them to support my learning.

# Acceptance Criteria
* Learner can view available learning resources.
* Learner can see the resource title.
* Learner can see the resource type.
* Learner can see the description and category.
* Learner can open/access an available resource.
* Learner can search or filter resources where applicable.
* Learner cannot edit or delete resources.

# Manage Learning Resources
* As an Assessor, I want to upload and manage learning materials/resources so that Learners can access useful materials to support their learning.

# Acceptance Criteria
* Assessor can access the resource-management section.
* Assessor can add/upload a learning resource.
* Assessor can provide a title.
* Assessor can select the resource type.
* Assessor can provide a description.
* Assessor can assign a category.
* The resource is saved to Firebase.
* Assessor can edit resources.
* Assessor can delete resources.
* Only an authorised Assessor can manage resources.
* Learners can access resources but cannot modify or delete them.
* The system provides success/error feedback.

# Learning Mini-Game
* As a Learner, I want to play an educational mini-game so that I can practise my skills in an interactive way.

# Acceptance Criteria
* Learner can access the mini-game.
* The game accepts user input.
* JavaScript processes the game logic.
* The game provides a meaningful result.
* A score can be calculated.
* Learner can play again.
* The game does not interfere with the Learner's task data.