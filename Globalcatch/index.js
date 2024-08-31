const express = require("express");
const app = express();

//regular routes and middleware goes here
app.post("/", (req, res) => {
  const num = req.body.num;
  res.send(num);
});

//at last we defined a middleware with 4 arguments sthat catches errors from above routes and middlwares
app.use((err, req, res, next) => {
  res.send("Something went wrong::msg from ");
});

app.listen(3000, () => {
  console.log("running in port 3000");
});
