<h1>Middlewares in Express</h1>
**Middleware in backend development refers to software components that are assembled into an application pipeline to handle requests and responses. Each component chooses whether to pass the request on to the next component in the pipeline, and can perform certain actions before and after the next component is invoked in the pipeline. Middleware components can perform a variety of functions such as logging, error handling, serving static files, authentication, and more.**

![1_3U2QnpCYn5o7vgv_CzO4tQ.png](https://i.postimg.cc/dVnVS0x5/1-3-U2-Qnp-CYn5o7vgv-Cz-O4t-Q.png)

### Middleware Basics

Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle, the next() function.

Key points:

-   They can perform various tasks such as parsing data, authentication, logging, etc.
-   Middleware runs in the order they are defined in the Express app.

### Common Types of Middleware

1.  Application-level middleware:
    -   Runs at the beginning of each request/response cycle i.e for each route we defined
    -   Example: `app.use(express.json())`
2.  Router-level middleware:
    -   Applies only to specific routes.
    -   Example: `router.use(authMiddleware)`
3.  Error-handling middleware:
    -   Catches errors from upper middleware
    -   Example: `app.use((err, req, res, next) => { ... })`

### Creating Custom Middleware

```
function customMiddleware(req, res, next) {
  // Perform operations here
  next();
}

```

Usage:

```
app.use(customMiddleware);

```

### Best Practices

1.  Keep middleware simple and focused on one responsibility.
2.  Use error handling middleware to catch and handle errors gracefully.
3.  Order middleware carefully to ensure proper execution flow.
4.  Consider using third-party middleware for common functionalities like CORS, logging, etc.

This overview covers the basics of middleware in Express.js. For more detailed information, you might want to refer to the official Express documentation or other resources on web development.

Middleware Execution flow
=========================

When a client makes a request to an Express application, the following sequence occurs:

1.  The request enters the server.
2.  Each middleware function is executed in order.
3.  If the middleware doesn't call `next()`, it stops the request processing.
4.  If `next()` is called, control passes to the next middleware.
5.  Finally, the route handler is executed.

**How Middleware Functions Work**

A typical middleware function looks like this:

`function middlewareFunction(req, res, next) { // Access request and response objects // Perform operations

// Call next() to pass control to the next middleware next(); }`

Key points:

-   `req` contains information about the HTTP request.
-   `res` provides methods to send responses.
-   `next()` is a function passed to each middleware, allowing them to pass control to the next middleware.

**Middleware Execution Order**

Middleware functions execute in the order they are defined. For example:

`app.use((req, res, next) => { console.log('Time:', Date.now()); next(); });

app.use((req, res, next) => { console.log('URL:', req.url); next(); });`

Lets create a simple that demonstrates the core concept of middleware in Express.js.
====================================================================================

### Step 1: Define a Simple Middleware Function

Here's a very basic middleware function:

```
function greetMiddleware(req, res, next) {
  console.log("Hello from middleware!");
  next();
}

```

### Step 2: Set Up the Express App

Now, let's set up our Express app and use this middleware:

```
const express = require('express');
const app = express();

// Our simple middleware function
function greetMiddleware(req, res, next) {
  console.log("Hello from middleware!");
  next();
}

// Apply the middleware to all routes
app.use(greetMiddleware);

// Sample route handler
app.get('/', (req, res) => {
  res.send('Welcome to my home page!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

we are using  `app.use()` to apply middleware globally, affecting all routes but if we want only for a specific route this same middleware can be implemented as

```
const express = require('express');
const app = express();

// Our simple middleware function
function greetMiddleware(req, res, next) {
  console.log("Hello from middleware!");
  next();
}

// Sample route handler
//we are using middleware only in this route so this middleware will only be
// executed in this route but if we use app.use(greetMiddleware) it will be
// executed in every route
app.get('/',greetMiddleware, (req, res) => {
  res.send('Welcome to my home page!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

### Step 3: Run the Server and Make Requests

Run the server and make requests to `http://localhost:3000/`.

### Step 4: Analyze the Output

When you make a request, you should see the following output in your console:

```
Hello from middleware!
Welcome to my home page!

```

### Step 5: Explain How It Works

Let's break down what happens step by step:

1.  We define a simple middleware function `greetMiddleware`.
2.  We apply this middleware to all routes using `app.use(greetMiddleware)`. and if we want it in specific route only we can do. `app.get('/',greetMiddleware, (req, res) => { res.send('Welcome to my home page!'); });` doing this will only execute middleware in this route only
3.  When a request comes in, Express executes our middleware function.
4.  Inside the middleware, we log "Hello from middleware!" to the console.
5.  We immediately call `next()` without any delay.
6.  After the middleware finishes, control passes to the next middleware (in this case, our route handler).
7.  The route handler sends the response "Welcome to my home page!".

### Key Points to Consider

1.  This middleware logs a greeting message before the route handler processes the request.
2.  The middleware doesn't interfere with the normal flow of the request; it just adds some information to the console.
3.  Calling `next()` is crucial. Without it, the request would stop here, and no further processing would occur.
4.  This middleware is applied globally, so it will run for every request to the server.

### Best Practices

1.  Keep middleware functions simple and focused on a single responsibility.
2.  Use middleware for cross-cutting concerns like logging, authentication, or request transformation.
3.  Remember to call `next()` unless you specifically want to stop the request processing.
4.  In larger applications, you might want to add parameters to your middleware to make it more flexible.

This example demonstrates the most basic form of middleware in Express.js. It shows how middleware can intercept and potentially modify requests before they reach the route handlers, which is a powerful feature for building robust and efficient web applications.

One more Example of Middleware
------------------------------

*We created a simple Express application with a custom middleware function that checks if the current time falls within working hours. If the request is made outside of these hours, the middleware sends a response indicating that the service is unavailable. Otherwise, it allows the request to proceed to the route handler. This example demonstrates how middleware can be used to perform logic before passing control to route handlers, enabling modular and maintainable application design*.

`const express = require('express'); const app = express(); const PORT = 3000;`

`// Middleware to check working hours const workingHoursMiddleware = (req, res, next) => { const currentHour = new Date().getHours(); if (currentHour < 9 || currentHour > 17) { return res.status(503).send('Service unavailable outside working hours (9 AM to 5 PM)'); } next(); // Proceed to the next middleware or route handler };`

`// Use the middleware app.use(workingHoursMiddleware);`

`// Test route app.get('/', (req, res) => { res.send('Welcome! We are currently open.'); });`

`// Start the server app.listen(PORT, () => { console.log(Server running on <http://localhost>:${PORT}); });`

we are using  `app.use()` to apply middleware globally, affecting all routes but if we want only for a specific route this same middleware can be implemented as

`const express = require('express'); const app = express(); const PORT = 3000;`

`// Middleware to check working hours const workingHoursMiddleware = (req, res, next) => { const currentHour = new Date().getHours(); if (currentHour < 9 || currentHour > 17) { return res.status(503).send('Service unavailable outside working hours (9 AM to 5 PM)'); } next(); // Proceed to the next middleware or route handler };`

`// Route that uses the working hours middleware app.get('/test', workingHoursMiddleware, (req, res) => { res.send('This is the test route, and we are currently open.'); });`

`// Root route without the middleware app.get('/', (req, res) => { res.send('Welcome to the root route! This route is always available.'); });`

`// Start the server app.listen(PORT, () => { console.log(Server running on <http://localhost>:${PORT}); });`

See more in Github: <https://github.com/sujansince2003/Middlewares>
