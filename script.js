const { response } = require("express");
const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

const generatePersonId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

const generateHTML = function () {
  const entries = `<p>Phonebook has info for ${
    persons.length + 1
  }, \n ${new Date()}</p>`;
  return entries;
};
app.get("/info", (request, response) => {
  response.send(generateHTML());
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((per) => per.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((per) => per.id !== id);
  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: "content missing" });
  } else if (persons.map((per) => per.name).includes(body.name)) {
    return response.status(400).json({ error: "Name must be unique" });
  } else if (persons.map((per) => per.number).includes(body.number)) {
    return response.status(400).json({ error: "Number must be unique" });
  }
  const person = {
    id: generatePersonId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  console.log(persons);
  response.json(person);
});

const PORT =
  process.env.PORT ||
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
