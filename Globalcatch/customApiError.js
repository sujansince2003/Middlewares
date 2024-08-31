const express = require("express");
const app = express();

// Enable body-parser for GET requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

class ApiGetErr extends Error {
  constructor(msg, statusCode = 400) {
    super(msg);
    this.name = "ApiGetErr";
    this.message = msg;
    this.statusCode = statusCode;
    this.ApiGetErr = true;
  }
}

app.get("/", (req, res, next) => {
  const num = req.body.num;

  if (!num) {
    const err = new ApiGetErr("Missing required parameter", 400);
    return res.status(err.statusCode).json({ message: err.message });
  }

  try {
    // Process the number (e.g., double it)
    const doubledNum = num * 2;

    // Send the processed result
    res.json({ result: doubledNum });
  } catch (error) {
    next(new ApiGetErr("An error occurred during processing", 500));
  }
});
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (err instanceof ApiGetErr) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
