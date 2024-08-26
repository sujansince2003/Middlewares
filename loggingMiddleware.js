// Objective: Create a middleware function that logs incoming HTTP requests, including the method, URL, and timestamp.

// Requirements:

// Log the HTTP method (GET, POST, etc.), the URL path, and the current timestamp for every incoming request.
// Ensure the log entries are formatted neatly and are easily readable.
const express = require("express");

const app = express();
let logstring;

function loggingmiddleware(req, res, next) {
  logstring = ` date is :${new Date().toISOString()} --  path is : ${
    req.path
  } and 
  HTTP Method is : ${req.method}`;
  console.log(logstring);
  next();
}
app.use(loggingmiddleware);
app.get("/", (req, res) => {
  res.send(
    `this is logging middleware route that logs incoming HTTP requests, including the method, URL, and timestamp i.e ${logstring}`
  );
});

app.listen("3000", () => {
  console.log("running on port 3000s");
});
