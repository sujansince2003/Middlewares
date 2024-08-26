const express = require("express");

const app = express();

// creating a  middleware to count number of requests

let count = 0;

function countRequest(req, res, next) {
  count++;
  console.log("Request count  every routes: ", count);
  next();
}
let countonsingleRoute = 0;
function countRequestonSingleRoutes(req, res, next) {
  countonsingleRoute++;
  console.log("Request count  on single route: ", countonsingleRoute);
  next();
}

app.use(countRequest); //using middleware globally to count request

app.get("/", (req, res) => {
  res.send(`current reuest count on every route is ${count}`);
});

app.get("/countsingleroute", countRequestonSingleRoutes, (req, res) => {
  res.send(`req on this route  is ${countonsingleRoute} and globally ${count}`);
});

app.listen("3000", () => {
  console.log("running on port 3000");
});
