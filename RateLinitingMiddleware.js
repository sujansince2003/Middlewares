/* 
Rate Limiting Middleware
-Objective: Develop a rate-limiting middleware to prevent abuse by limiting the number of requests a client can make within a certain timeframe.

Requirements:

-Define a maximum number of requests allowed per client within a specific timeframe (e.g., 100 requests per minute).
-Track the number of requests made by each IP address.
-If a client exceeds the limit, respond with a 429 Too Many Requests status code and an appropriate message.
-Reset the request count for each IP address when the timeframe resets.


*/

const express = require("express");
const app = express();

// custom configration for rates and limit
const MAX_REQ_PER_WINDOW = 5; //Maximum requests allowed per time window
const WINDOW_SIZE_IN_MINUTES = 1; // Size of the time window in minutes

// now storing request count for each IP address

let requestCounts = new Map();

// why using Map
/* A Map is a collection of key-value pairs where each key is unique and maps to a specific value.
In our rate limiting middleware, Map is ideal because:
--Each IP address is unique, making it a perfect candidate for a Map key.
--We need fast lookup and increment operations for each IP address.
--The order of requests isn't crucial, but maintaining insertion order doesn't hurt.
 */

// defining function to reset all counters

function resetCounter() {
  requestCounts.clear();
}

setInterval(resetCounter, WINDOW_SIZE_IN_MINUTES * 60 * 1000);

function RateLimitingMiddleware(req, res, next) {
  const requestingIP = req.ip || req.socket.remoteAddress;

  // increase requests in this IP address
  let requests = requestCounts.get(requestingIP) || 0;
  requests++;
  requestCounts.set(requestingIP, requests);

  //   checking rate limit

  if (requests <= MAX_REQ_PER_WINDOW) {
    // more requests are allowed so calling next()
    next();
  } else {
    res.status(421).json({ msg: "Maximum request limit reached" });
  }
}

app.use(RateLimitingMiddleware);

app.get("/", (req, res) => {
  res.send("Hello this IP is making request successfully under rate limit");
});

app.listen("3000", () => {
  console.log("running on server 3000");
});
//ignore zD
// app.get("/reqobject", (req, res) => {
//   res.json({
//     reqUrl: req.url,
//     reqPath: req.path,
//     hostname: req.hostname,
//     protocol: req.protocol,
//     params: [req.baseUrl],

//     msg: "this is k",
//     ip: req.ip,
//     socket: req.socket.remoteAddress,
//     header: req.headers["x-forwarded-for"] ? "yes" : "no",
//   });
// });
