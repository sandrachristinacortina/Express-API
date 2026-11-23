//Schema template start//
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  finished: { type: Boolean, default: false },
});

const Book = mongoose.model("Book", bookSchema);
//Schema Template end//

//Server route set up//
const express = require("express");
const server = express();

server.use(express.json());
//Server route set up end//

//Mongoose Connect start//
process.loadEnvFile(__dirname + "/.env");

async function connectToDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  server.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}
connectToDatabase().catch(console.error);
//Mongoose Connect end//

//POST Books ready to accept requests on port//
server.post("/books", async (req, res) => {
  const { title, author } = req.body ?? {};

  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    !title.trim() ||
    !author.trim()
  ) {
    return res.status(400).json({ error: "Enter a title and an author." });
  }

  const book = await Book.create({
    title: title.trim(),
    author: author.trim(),
  });
  res.status(201).json(book);
});
//POST Books ready to accept requests end//

// Get books, optionally filtered by finished status
server.get("/books", async (req, res) => {
  const filter = {};

  if (req.query.finished === "false") {
    filter.finished = false;
  } else if (req.query.finished === "true") {
    filter.finished = true;
  }

  const books = await Book.find(filter);
  res.json(books);
});
