LEARNER SUPPORT PORTAL PSEUDOCODE

- Learner registration

START

Display registration form

INPUT learner name
INPUT learner email
INPUT learner password
INPUT password confirmation

IF any required field is empty THEN
    Display "Please complete all required fields"
ELSE IF email format is invalid THEN
    Display "Please enter a valid email address"
ELSE IF password and password confirmation do not match THEN
    Display "Passwords do not match"
ELSE
    Check whether email already exists

    IF email already exists THEN
        Display "Email is already registered"
    ELSE
        Create Learner account
        Store Learner information in database
        Display "Registration successful"
        Redirect to Login
    END IF
END IF

END


- Assessor account provisioning

START

Admin logs into Admin area

INPUT Assessor name
INPUT Assessor email
GENERATE or SET authorised credentials

Validate Assessor information

IF information is invalid THEN
    Display error message
ELSE
    Create Assessor account
    Store Assessor account information
    Provide login credentials to Assessor
    Display "Assessor account created successfully"
END IF

END

-Login Pseudocode

START

Display login form

INPUT email
INPUT password

IF email or password is empty THEN
    Display "Please enter your email and password"
ELSE
    Authenticate user

    IF authentication fails THEN
        Display "Invalid login credentials"
    ELSE
        Retrieve authorised account information

        IF account is authorised as Learner THEN
            Redirect to Learner Dashboard

        ELSE IF account is authorised as Assessor THEN
            Redirect to Assessor Dashboard

        ELSE IF account is authorised as Admin THEN
            Redirect to Admin area

        ELSE
            Display "Access denied"
        END IF
    END IF
END IF

END


- Logout Pseudocode

START

User selects Logout

Sign out authenticated user

Clear active session

Redirect user to Login page

END


- Task Creation Pseudocode

START

Learner selects "Create Task"

Display task form

INPUT task title
INPUT task description
INPUT task category
INPUT task status

IF required information is missing THEN
    Display validation error
ELSE
    Create task record

    Store:
        userId
        title
        description
        category
        status
        createdAt
        updatedAt

    Save task to database

    IF task is saved successfully THEN
        Display "Task created successfully"
        Refresh task list
    ELSE
        Display "Unable to create task"
    END IF
END IF

END


- View learning tasks

START

Learner opens Task section

Get authenticated Learner ID

Retrieve tasks associated with Learner ID

IF no tasks are found THEN
    Display "No tasks available"
ELSE
    Display Learner's tasks
END IF

END


- Update learning task

START

Learner selects a task

Display current task information

INPUT updated task information

Validate updated information

IF information is invalid THEN
    Display validation error
ELSE
    Update task in database
    Update updatedAt

    IF update is successful THEN
        Display "Task updated successfully"
        Refresh task list
    ELSE
        Display "Unable to update task"
    END IF
END IF

END
 

-Delete Task Pseudocode

START

Learner selects Delete Task

Display confirmation message:

"Are you sure you want to delete this task?"

IF Learner selects Cancel THEN
    Close confirmation message
    Keep task unchanged

ELSE IF Learner selects Confirm THEN

    Verify that the task belongs to the authenticated Learner

    IF task belongs to Learner THEN
        Delete task from database

        IF deletion is successful THEN
            Remove task from displayed task list
            Display "Task deleted successfully"
        ELSE
            Display "Unable to delete task"
        END IF

    ELSE
        Display "Access denied"
    END IF

END IF

END


- Calculate learner progress

START

Retrieve authenticated Learner's tasks

COUNT all tasks

IF total tasks = 0 THEN
    Set progress percentage to 0%
ELSE
    COUNT completed tasks

    COUNT outstanding tasks

    CALCULATE progress percentage:

    progress =
        (completed tasks / total tasks) × 100
END IF

Display:
    Total tasks
    Completed tasks
    Outstanding tasks
    Progress percentage

END


- Search tasks

START

Learner enters search text

Retrieve Learner's tasks

Compare search text with task information

IF matching tasks are found THEN
    Display matching tasks
ELSE
    Display "No matching tasks found"
END IF

END



- Request support session 

START

Learner selects Support Session

Display booking form

INPUT required booking information

IF required information is missing THEN
    Display validation error
ELSE
    Create support request

    Set status to "pending"

    Store booking information in database

    IF booking is saved successfully THEN
        Display "Support request submitted successfully"
    ELSE
        Display "Unable to submit support request"
    END IF
END IF

END


- Assessor manages support requests

START

Assessor logs in

Verify Assessor access

IF access is authorised THEN
    Retrieve authorised support requests

    Display support requests

    Assessor selects a request

    View booking information

    Assessor selects new status

    Update support request

    Save changes to database

    Display "Support request updated successfully"

ELSE
    Display "Access denied"
END IF

END


- Learner accesses learning resources 

START

Learner opens Learning Resources

Retrieve available resources

IF resources are available THEN
    Display resource list

    Learner selects a resource

    Display:
        title
        type
        description
        category

    Learner selects Open

    Open resource

ELSE
    Display "No learning resources available"
END IF

END


-Assessor uploads learning resource

START

Assessor opens Resource Management

Verify Assessor access

IF access is authorised THEN

    INPUT resource title
    INPUT resource type
    INPUT resource URL/location
    INPUT resource description
    INPUT resource category

    Validate required information

    IF information is invalid THEN
        Display validation error
    ELSE
        Save resource to database

        Store Assessor ID as uploadedBy

        IF resource is saved successfully THEN
            Display "Resource uploaded successfully"
        ELSE
            Display "Unable to upload resource"
        END IF
    END IF

ELSE
    Display "Access denied"
END IF

END


- Assessor updates learning resource

START

Assessor selects resource

Verify Assessor access

IF access is authorised THEN

    Display existing resource information

    INPUT updated resource information

    Validate information

    IF information is valid THEN
        Update resource in database
        Display "Resource updated successfully"
    ELSE
        Display validation error
    END IF

ELSE
    Display "Access denied"
END IF

END


- Assessor Deletes Learning Resource

START

Assessor selects delete resource

Display confirmation message

IF Assessor selects Cancel THEN
    Keep resource unchanged

ELSE IF Assessor confirms deletion THEN

    Verify Assessor access

    IF access is authorised THEN
        Delete resource from database
        Display "Resource deleted successfully"
    ELSE
        Display "Access denied"
    END IF

END IF

END


- Mini Game

START

Learner opens mini game

Display game instructions

Set score to 0

WHILE game is active

    Display question/challenge

    INPUT Learner answer

    Check answer

    IF answer is correct THEN
        Increase score
        Display correct feedback
    ELSE
        Display incorrect feedback
    END IF

END WHILE

Display final score

Ask Learner if they want to play again

IF Learner chooses Yes THEN
    Restart game
ELSE
    Return to mini game screen or dashboard
END IF

END


- User Preference

START

User opens preferences

Display available themes

User selects Light or Dark theme

Apply selected theme

Store preference in browser cookie

Display updated interface

END


- Print progress summary

START

Learner opens Progress section

Retrieve current progress information

Display progress summary

Learner selects Print

Open browser print function

Learner prints or saves the progress summary

END