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


# Month one - Formative questions

Q1. Explain why programming life cycle should be followed before coding?
- It helps developers to understand the problem and plan the solution, it saves time and reduces errors and make sure that the programme meets the users requirements.

Q2. List and explain the main steps of the programmimg life cycle.
- Problem analysis: Indentify the problems, users, objectives, inputs, outputs and limitations.
- Requirements gathering: Determine exactly what the programe must do and define its acceptance criteria
- Solution design: Plan the program's interface, date and logic using pseudocode, flowcharts or wireframes.
- Coding: Convert the planned solution into a working code 
- Testing and debugging: Test the program with different inputs, identify errors and correct
- Implementation: Deploy or release the completed program so users can use it.
- Documentantion: Record how the program works and provide instructions for users and developers
- Maintance: Fix all the problems, errors and improve perfomance.

Q3. Explain when const should be used instead of let. Also explain why var should normally be avoided in mordern Javascript.
- Const should be use when a variable will not be reassigned after it has be declared. let should be used were a variable need be changed. var should normally can be avoided because it has function scope.

Q4. Explain how local and global scope can affect the reliability and maintanability of Javascript application
- Local variables can be accessed inside the function or block where they are declared, reducing naming conflicts and accidental changes. Global Variables can be accessed and modify from different parts of the application, making errors harder to locate.

Q5. Explain how map(), filter(), and reduce() process an array of a task objects differently. Provide one suitable for each.
- map() process every task and create a new array of transformed values.It can be used to create an array containing only task titles.
-filter() create new arrays cointaining task to meet conditions, it can be used to select completed tasks.
- reduce() combines all tasks into a single results. It can be used to calculate the total number of tasks

Q6. Explain why an application should use classes or structured objects instead of storing related information in several unrelated variables.
- Classes and structured objects keep related information together.

Q7. Explain how branches, pull requests and automated checks reduce risk when developers collaborate in the projects
- Branches allow each developer to work on a new features withouth directly changing the stable main code. Pull requests allow team members to review and discuss changes before merging them. Automated checks run tests and code-quality checks automatically.

Q8. a. State the data type of each value
- UserName is a string
- age is a number
- isActive is a boolean
- SelectedProject is a null
b. Explain age how can it converted from a number to string
- The typeof operator is used to determine the data type of value or variable.

Q9. a. State the output of each statement
- 105
- true
- false

b. Explain why "10" + 5 does not produce number 15
- "10" is a string, when + operator is used with a string and number Js convers the number ito the string an jions the value.

c. Explain the difference between == and ===
== Compares values allows jsto convert their data types, === compares both values and their data types withot perfoming type conversion.

d. Rewrite the first statement so it ca produce 15
const total = Number("10") + 5;

Q10. a. Identify the parameters of calculateTotal().
- The parameters are price and quantity. The quantity parameter has a default value of 1.

b. Explain the purpose of the default value assigned to quantity.
- The default value ensures that if no quantity is provided, the function calculates the total for one item.

c. Explain what the return keyword does.
- The return keyword ends the function and sends the calculated result back to the place where the function was called.

d. State the value stored in orderTotal.
- 150 × 3 = 450

e. State the value stored in finalTotal.
- The 10% discount is 45, so 450 − 45 = 405.

f. Explain one difference between a function declaration and an arrow function.
- A function declaration uses the function keyword and can normally be called before its definition because it is hoisted. An arrow function uses the => syntax and does not have its own this value.

Q11. a.Write JavaScript code that uses a loop to display the title of every task.
- for (const task of tasks) {
    console.log(task.title);
}
b. Write JavaScript code that uses a conditional statement to display only completed tasks.
- for (const task of tasks) {
    if (task.completed === true) {
        console.log(task.title);
    }
}
c. Write JavaScript code that counts the number of completed tasks.
- const completedCount = tasks.filter(task => task.completed).length;
console.log(completedCount);

The answer displayed is 2.

d. Write JavaScript code that calculates the total number of hours for all tasks.
- const totalHours = tasks.reduce((total, task) => {
    return total + task.hours;
}, 0);

console.log(totalHours);

The answer displayed is 14.

e. Write JavaScript code that displays an appropriate message if no tasks are available.
- if (tasks.length === 0) {
    console.log("No tasks are available.");
}

Q15 

a. Explain what information the cookie stores.
- The cookie stores a preference named theme with the value dark.

b. Explain the purpose of max-age=3600.
- It means that the cookie will remain valid for 3,600 seconds, which is one hour.

c.Explain the purpose of path=/.
It makes the cookie available on every page of the website.

d.Write a JavaScript statement that displays the available cookies.
- console.log(document.cookie);

Q16. A registration form contains name, email address, password and age fields. Develop five test cases for the form. Include the input or condition and the expected result.

Test case	Input or condition	Expected result
Valid submission	Name: Lerato; email: lerato@example.com; password: Secure123; age: 25	Registration succeeds and a success message is displayed.
Missing value	Leave the name field empty while all other fields are valid.	Submission is rejected and “Name is required” is displayed.
Invalid email	Enter leratoexample.com as the email address.	Submission is rejected and an invalid-email message is displayed.
Boundary value	Enter the minimum permitted age, such as 18.	The age is accepted if 18 is the stated minimum age.
Invalid password	Enter a password shorter than the required minimum, such as abc.	Submission is rejected and a password-requirement message is displayed