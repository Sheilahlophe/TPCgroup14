# Test Plan

## 1. Introduction

The purpose of this test plan is to check if the Learner Support System is working correctly.

The testing will focus on the main features of the system, including login, registration, tasks, support bookings, learning resources, the dashboard and the JavaScript quiz game.

## 2. Testing Objectives

- Check that learners can register successfully.
- Check that learners can log in and log out.
- Check that only the correct users can access the correct pages.
- Check that learners can create, view, edit and delete tasks.
- Check that learners can search and filter tasks.
- Check that task progress is calculated correctly.
- Check that learners can book a support session.
- Check that learners can view their support booking status.
- Check that assessors can view and update support bookings.
- Check that assessors can add and delete learning resources.
- Check that learners can view learning resources.
- Check that the JavaScript quiz game works correctly.
- Check that data is saved and retrieved correctly from Firebase.
- Check that the system displays error and success messages correctly.

## 3. Types of Testing

### Functional Testing

This will be used to check if each feature works as expected.

### User Interface Testing

This will be used to check if buttons, forms, menus and pages are displayed and working correctly.

### Validation Testing

This will be used to check that users cannot submit incorrect or incomplete information.

### Authentication Testing

This will be used to check that users must log in and that learners and assessors access the correct parts of the system.

### Database Testing

This will be used to check that information is correctly saved, updated, retrieved and deleted from Firebase.

## 4. Test Environment

- VS Code will be used to work on the system.
- Google Chrome will be used to test the website.
- Firebase Authentication will be used for user login and registration.
- Firebase Realtime Database will be used to store system data.
- GitHub will be used to store the project files.

## 5. Main Features to Test

- Learner registration
- Learner login
- Assessor login
- Dashboard
- Task creation
- Task editing
- Task completion
- Task deletion
- Task search
- Task filtering
- Task progress
- Print progress
- Support booking
- Booking status
- Learning resources
- JavaScript quiz game
- Logout

## 6. Expected Test Results

The system should:

- Allow a learner to register with valid information.
- Prevent registration when required information is missing or incorrect.
- Allow registered users to log in with the correct details.
- Prevent users with incorrect login details from accessing the system.
- Allow learners to create and manage their own tasks.
- Allow learners to search and filter their tasks.
- Show the correct task progress on the dashboard.
- Allow learners to create support bookings.
- Allow assessors to view and update support bookings.
- Allow assessors to add and delete learning resources.
- Allow learners to view the available resources.
- Calculate the quiz score correctly.
- Save the required information to Firebase.
- Allow users to log out successfully.

## 7. Test Result

The results of each test will be recorded as:

- PASS – The feature works as expected.
- FAIL – The feature does not work as expected.

If a test fails, the problem will be identified and fixed before testing again.