CLASS / OBJECT DESIGN

1. Overview

The system will use object-oriented programming concepts to represent important entities as classes/objects.

Each class will contain:

Attributes — information stored about the object.

Methods — actions the object can perform.


For this project, the main classes are:

1. Learner


2. Assessor


3. Admin


4. Task


5. Booking


6. SupportRequest


7. Resource




---

2. Learner Class

Purpose

Represents a learner who registers and uses the Learner Support Portal.

Attributes

Attribute	Data Type	Description

learnerId	String	Unique learner ID
firstName	String	Learner's first name
lastName	String	Learner's surname
email	String	Learner's email
tasks	Array	Learner's tasks
bookings	Array	Learner's bookings


Methods

Method	Description

register()	Creates a learner account
login()	Logs the learner into the system
createTask()	Creates a new task
updateTask()	Updates a task
deleteTask()	Deletes a task
markTaskComplete()	Marks a task as completed
viewProgress()	Displays learner progress
createBooking()	Creates a booking with an assessor
submitSupportRequest()	Sends a support request
viewResources()	Views available learning resources


Example

class Learner {
    constructor(learnerId, firstName, lastName, email) {
        this.learnerId = learnerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.tasks = [];
        this.bookings = [];
    }

    createTask(task) {
        this.tasks.push(task);
    }

    markTaskComplete(taskId) {
        const task = this.tasks.find(task => task.taskId === taskId);

        if (task) {
            task.status = "completed";
        }
    }

    viewProgress() {
        const totalTasks = this.tasks.length;

        if (totalTasks === 0) {
            return 0;
        }

        const completedTasks =
            this.tasks.filter(task => task.status === "completed").length;

        return (completedTasks / totalTasks) * 100;
    }
}


---

3. Assessor Class

Purpose

Represents an assessor who is created by the Admin and supports learners.

Attributes

Attribute	Data Type	Description

assessorId	String	Unique assessor ID
firstName	String	Assessor's first name
lastName	String	Assessor's surname
email	String	Assessor's email
username	String	Login username
status	String	Account status
bookings	Array	Bookings assigned to assessor


Methods

Method	Description

login()	Logs assessor into the system
viewLearners()	Views learners
viewBookings()	Views bookings
approveBooking()	Approves a learner's booking
rejectBooking()	Rejects a learner's booking
respondToSupport()	Responds to learner support requests
addResource()	Adds a learning resource
updateResource()	Updates a resource
deleteResource()	Deletes a resource


Example

class Assessor {
    constructor(assessorId, firstName, lastName, email, username) {
        this.assessorId = assessorId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.status = "active";
        this.bookings = [];
    }

    approveBooking(booking) {
        booking.status = "approved";
    }

    rejectBooking(booking) {
        booking.status = "rejected";
    }

    viewBookings() {
        return this.bookings;
    }
}


---

4. Admin Class

Purpose

Represents the administrator responsible for controlling assessor accounts.

Attributes

Attribute	Data Type	Description

adminId	String	Unique Admin ID
firstName	String	Admin's first name
lastName	String	Admin's surname
email	String	Admin's email


Methods

Method	Description

login()	Logs Admin into the system
createAssessor()	Creates an assessor account
updateAssessor()	Updates assessor information
manageAssessorAccess()	Activates/deactivates access
deleteAssessor()	Removes an assessor account


Example

class Admin {
    constructor(adminId, firstName, lastName, email) {
        this.adminId = adminId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    createAssessor(assessor) {
        return assessor;
    }

    manageAssessorAccess(assessor, status) {
        assessor.status = status;
    }
}


---

5. Task Class

Purpose

Represents a task belonging to a learner.

Attributes

Attribute	Data Type	Description

taskId	String	Unique task ID
learnerId	String	Owner of the task
title	String	Task title
description	String	Task description
status	String	Completed/Not Completed
createdAt	Timestamp	Creation date
updatedAt	Timestamp	Last update


Methods

Method	Description

updateTask()	Updates task details
markComplete()	Marks task as completed
deleteTask()	Removes task


Important

The Task class does not contain:

dueDate
priority
overdue
points

because these were removed from the project requirements.


---

6. Booking Class 

This is particularly important because of the new requirement that the Assessor must view and approve bookings.

Purpose

Represents a booking made by a learner with an assessor.

Attributes

Attribute	Data Type	Description

bookingId	String	Unique booking ID
learnerId	String	Learner making the booking
assessorId	String	Selected assessor
date	Date	Booking date
time	String	Booking time
reason	String	Reason for booking
status	String	Pending/Approved/Rejected


Methods

Method	Description

createBooking()	Creates a booking
approveBooking()	Changes booking to approved
rejectBooking()	Changes booking to rejected
cancelBooking()	Cancels a booking


Example

class Booking {
    constructor(bookingId, learnerId, assessorId, date, time, reason) {
        this.bookingId = bookingId;
        this.learnerId = learnerId;
        this.assessorId = assessorId;
        this.date = date;
        this.time = time;
        this.reason = reason;
        this.status = "pending";
    }

    approveBooking() {
        this.status = "approved";
    }

    rejectBooking() {
        this.status = "rejected";
    }
}


---

7. SupportRequest Class

Purpose

Represents a request for assistance submitted by a learner.

Attributes

Attribute	Data Type	Description

requestId	String	Unique request ID
learnerId	String	Learner making the request
assessorId	String	Assessor handling request
subject	String	Request subject
message	String	Learner's message
status	String	Pending/Resolved
response	String	Assessor's response


Methods

Method	Description

submitRequest()	Submits a support request
respond()	Adds an assessor response
resolve()	Marks request as resolved



---

8. Resource Class

Purpose

Represents learning material available to learners.

Attributes

Attribute	Data Type	Description

resourceId	String	Unique resource ID
title	String	Resource title
description	String	Resource description
resourceType	String	Document, video, link, etc.
resourceUrl	String	Location of resource
createdBy	String	Assessor who created it


Methods

Method	Description

createResource()	Creates a resource
updateResource()	Updates resource
deleteResource()	Deletes resource
viewResource()	Opens resource



---

9. Class Relationships

The classes relate to each other as follows:

┌──────────────┐
                    │    ADMIN     │
                    └──────┬───────┘
                           │
                     creates/manages
                           │
                           ↓
                    ┌──────────────┐
                    │   ASSESSOR   │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ↓             ↓             ↓
        Resources      Bookings      Support Requests
                           ↑             ↑
                           │             │
                           │             │
                    ┌──────┴───────┐     │
                    │    LEARNER   │─────┘
                    └──────┬───────┘
                           │
                           ↓
                         Tasks

More specifically:

Admin
  │
  └── creates → Assessor

Learner
  │
  ├── owns → Tasks
  │
  ├── creates → Booking → Assessor
  │
  └── creates → SupportRequest → Assessor

Assessor
  │
  ├── manages → Resources
  │
  ├── approves/rejects → Bookings
  │
  └── responds to → SupportRequests

10. Two Key Classes for the Project

If your assignment specifically says "Design at least 2 classes/objects", you don't necessarily need to implement all seven classes above in detail.

The strongest two to demonstrate are:

Learner

Because it handles:

Tasks

Progress

Bookings

Support


Booking

Because it demonstrates the important interaction between:

Learner

Assessor

Booking status

Approve/Reject functionality


You can therefore present these two as your main class/object designs, while the other classes can be included as supporting classes.

11. Short Report Description

> The system will use object-oriented design to represent key entities as classes. Each class will contain attributes representing its data and methods representing the actions that can be performed. The main classes include Learner, Assessor, Admin, Task, Booking, SupportRequest and Resource. The Learner class manages learner activities such as tasks, progress, bookings and support requests, while the Assessor class manages bookings, resources and learner support. The Booking class is responsible for storing booking information and allowing an Assessor to approve or reject a learner's booking.



This design now ties directly into the database model and REST API plan, particularly the Booking object and the approve/reject API endpoints.