const express = require("express");
const zod = require("zod");
const schema = zod.array(zod.number());
const str = zod.string({
  required_error: "Nam is required",
  invalid_type_error: "name should be string",
});
const app = express();
app.use(express.json());
app.post("/", (req, res) => {
  const name = req.body.name;
  const response = str.safeParse(name);
  if (!response.success) {
    res.send(response.error.issues[0].message);
    // return;
  }
  res.send("name is " + name);
});
app.listen(3000, () => {
  console.log("3000");
});
