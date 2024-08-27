/* Objective: Implement a simple authentication middleware that checks for a valid API key in the request headers.

 Requirements:

-Extract the API key from the request headers.
- Compare the extracted API key against a predefined list of valid keys.
-If the API key is invalid, respond with a 401 Unauthorized status code and an appropriate message.
-If the API key is valid, allow the request to proceed to the next middleware or route handler. 
*/

const express = require("express");
const app = express();
app.use(express.json());

const validkeys = ["1234567", "123456789", "1234567890"];

function simpleAuthMiddleware(req, res, next) {
  const key = req.headers.keyvalue;
  if (validkeys.includes(key)) {
    req.isAuth = true;
  } else {
    req.isAuth = false;
  }
  next();
}
app.use(simpleAuthMiddleware);

app.get("/", (req, res) => {
  let msg;
  if (req.isAuth) {
    msg = "Authentication middleware is working correctly.";
  } else {
    msg = "Authentication middleware is not working correctly.";
  }
  res.json({ message: msg });
});

app.listen(3000, () => {
  console.log("Running in port 3000");
});
