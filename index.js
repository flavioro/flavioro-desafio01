const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;
//const projects = [];
const projects = [
  { id: 1, title: "Projeto JavaScript", tasks: [] },
  { id: 2, title: "Node", tasks: [] },
  { id: 3, title: "React", tasks: [] }
];

//Middlewares global
server.use((req, res, next) => {
  console.count();
  console.log(`Método ${req.method}; URL: ${req.url} `);

  next();
});

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

//POST /projects:
//A rota deve receber id e title dentro corpo de cadastrar um novo projeto
//dentro de um array no seguinte formato:
//{ id: "1", title: 'Novo projeto', tasks: [] };
//Certifique-se de enviar tanto o ID quanto o título do projeto
//no formato string com àspas duplas.

//POST /projects/:id/tasks:
//A rota deve receber um campo title e
//armazenar uma nova tarefa no array de tarefas de um
//projeto específico escolhido através do
//id presente nos parâmetros da rota;

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/** * Tasks  */
server.post("/projects/:id/tasks", (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectId = projects.find(p => p.id == id);
  //Chegando no indice informado deleta a qtde de usuários informados
  //nesse caso 1;
  projects.splice(projectId, 1);

  return res.send();
});

server.listen(4000);
