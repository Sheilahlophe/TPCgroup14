# TPCgroup14
## Project board


## Week 1 - Project planning
- Created a shared git repo
- Write project problem statement
- Define project scope
- Document client requirements
- Identify Learner and Assessor/Admin users
- Create at least 6 user stories
- Add acceptance criteria to each user story
- Create programming life cycle plan
- Create login pseudocode
- Create task creation pseudocode
- Assign project features to team members


*JavaScript Timeline and Console Demo*
*Part A - Annotated JavaScript Timeline*

*1995* - JavaScript was created by Brendan Eich at Netscape, It took him 10 days to build it. The original name was Mocha, then LiveScript the later to JavaScript.

*1997* - ECMAScrip 1 (ES1)- first official standard, published by ECMA International

*2009* - ECMAScript 5 (ES5)

*2015* - ECMAScript 6/ ES2015 (ES6)

*2017* - ECMAScript 8 (ES8/ES2017)


*Activity 2* 
*Part A - Architecture Investigation*
1. What is Client side development, and where does client side code execute?
Client side development is the part of an application that runs inside the user's own web browser rather than on the remote machine. It covers the HTML structure, CSS styling and the JavaScript logic that control what the learner sees and interacts with. In skilltrack, everything the learner directly experiences the dashboard layout, the task form, button clicks, form validation feedback, DOM updates when tsks is added, it executes on the learner's own device, inside the browser's JavaScript engine. No server is required to render this part of the interface.

2. *What is server side development, and how is it different from code executing in the browser.*
Server side development is code that run on the remote machine (a server or cloud service) rather than the user's device. It handle things the browser should not be trusted with or cannot do alone: like storing data permanently, verifying identity, enforcing business rules and security restrictions, and responding to requests from many different clients at once. The key difference is trust and location. Client side code is visible and editable by anyone using browser developer tools, so it can not be relied on to enforce security. Server side code is not directly visible or editable by the user. It receives requests over the network and decides whether to allow them based on rules the learner cannot bypass from the browser console.

3. *Role of HTML, CSS, JavaScript, Firebase Authentication, Firebase Realtime Database and the firebase REST API in SkillsTrack*

* HTML
Defines the structure of each screen the dashboard, task form, booking form, login page.

* CSS
Controls the visual presentation layout, theme and responsive behaviour.

* JavaScript
Runs entirely client side, handles form validation, event listeners, DOM updates, progress calculations, the mini game logic and building the HTTP requests sent to firebase. 

* Firebase Authentication
A server side/cloud service that verifies learner identity, issues session tokens and confirms who is making a request without SkillTrack ever storing or checking password itself.

* Firebase Realtime Database
The cloud hosted data store. Hold users, tasks, booking, scores and resources records. All persistent data lives here, not in the browser.

* Firebase REST API 
The communication layer bettwen the browser and the database. The client side JavaScript sends GET/POST/PUT/PATCH/DELETE HTTP requests to firebase's REST endpoints to read or write data, including an auth token so Firebase's security rules can check permissions.

4. *Is Firebase the same thing as serverside JavaScript? Explain your answer.*
No.
Firebase is a Backend-as-a-Service (BaaS), a set of pre-built cloud services that SkillTrack consumes over HTTP, rather than a server that the team writes and runs JavaScrip code on. Firebase provides server side functionality without requiring the team to build or run a traditional server side application.

5. *When a Learner creates a learning task, which operations happen client-side vs server-side?*

- Client-side (In the browser)
* The learner fills in the task form
* JavaScript validate the input, build a task object and construct an HTTP POST request
* On a successful responce, JavaScript update the DOM to show the new task without reloading the page.

- Server- side
* Firebase Authentication confirms the request includes a valid token for a signed in user
* Firebase's security rules check whether this user is allowed to write to that data path.
* Firebase Realtime Database stores the new task record permanently under tasks/taskId
* Firebase returns a response back to the browser


## Week 2
- Configure VS Code
- Configure code formatter
- Configure JavaScript linter
- Configure debugging tools
- Create README.md
- Create .gitignore
- Define git branch naming convention
- Create feature branches
- Create basic GitHub Actions CI workflows
- Define Firebase data structure
- Define user data
- Design bookings data
- Design scores data
- Plan Firebase security rules
- Plan REST API endpoints
- Plan POST request
- Plan GET request
- Plan PUT request
- Plan DELETE request
- Design JavaScript classes
- Choose assessor-approved JavaScript game library

## Week 3
