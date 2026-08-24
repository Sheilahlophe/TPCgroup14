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

6. *Why should authentication, database access and security not be treated as purely client side concerns?*
Client side JavaScript is fully visible and editable by anyone using their browser's developer tools. A user can open the console, read the source code, change variable values, or send their own custom requests directly to the Firebase REST endpoints, bypassing the app's UI entirely. If security checks existed only in the browser's JavaScript, a learner could simple edit or skip that code and access or modify data that is not theirs. 
This is why SkillTrack's real security boundary must sit in Firebase's security rules and authentication service enforced server-side, where the user cannot alter or bypass it. 

7. *Two alternative backend/server side technologies instead of Firebase* 
Supabase and AWS Amplify

8. *Three security risks of misplacing sensitive logic or data in client side JavaScript*
- Exposed or bypassable business rules
- Data exposure through unrestricted read access.
- Credential or secret leakage.
