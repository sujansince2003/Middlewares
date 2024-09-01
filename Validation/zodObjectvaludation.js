const express = require("express");
const zod = require("zod");
const app = express();

const schema = zod.object({
  name: zod.string().min(1, "Name is required"),
  num: zod
    .number()
    .int("Number must be an integer")
    .positive("Number must be positive"),
});

app.use(express.json());

app.post("/", (req, res) => {
  try {
    const validate = schema.safeParse(req.body);

    if (!validate.success) {
      const errors = validate.error.errors.reduce((acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      }, {});

      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { name, num } = validate.data;
    res.send(`${name} and ${num}`);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Running Zod object validation server on port 3001");
});
