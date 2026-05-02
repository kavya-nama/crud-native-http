import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost:' + PORT;

type Todo = {
  id: string;
  title: string;
  createdAt: Date;
  completedAt: Date | null;
};

const todos: Todo[] = [
  {
    id: randomUUID(),
    title: 'Touch grass',
    createdAt: new Date(),
    completedAt: null,
  },
];

function findTodo(id: string) {
  return todos.find((todo) => todo.id === id);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Internal Server Error\n');
    console.error(`req.url does not exist`, req);
    return;
  }

  const url = new URL(`http://${HOST}${req.url}`);
  console.log(url);

  const pathList = url.pathname.split('/');
  pathList.shift();
  const { method } = req;
  let rawBody: Buffer[] = [];
  let body = '';

  req.on('data', (chunk) => {
    rawBody.push(chunk);
  });

  req.on('end', () => {
    body = Buffer.concat(rawBody).toString();

    switch (pathList[0]) {
      case '':
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ hello: 'world' }));
        break;

      case 'todos':
        if (!pathList[1]) {
          if (method === 'GET') {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(todos, null, 2) + '\n');
          } else if (method === 'POST') {
            if (body == '') {
              res.writeHead(400, { 'content-type': 'text/plain' });
              res.end('Bad Request\n');
              return;
            }
            try {
              const json = JSON.parse(body);
              if (!json['title']) {
                res.writeHead(422, { 'content-type': 'text/plain' });
                res.end(`key 'title' does not exist in body\n`);
                return;
              }
              const id = randomUUID();
              const todo = {
                id,
                title: json['title'],
                createdAt: new Date(),
                completedAt: null,
              };
              todos.push(todo);
              res.writeHead(201, { 'content-type': 'application/json' });
              res.end(JSON.stringify(todo, null, 2) + '\n');
            } catch (error: any) {
              res.writeHead(400, { 'content-type': 'text/plain' });
              res.end(`Bad Request\n`);
            }
          } else {
            res.writeHead(405, { 'content-type': 'text/plain' });
            res.end(`Method Not Allowed\n`);
          }
        } else {
          const id = pathList[1];
          const todo = findTodo(id);
          if (!todo) {
            res.writeHead(404, { 'content-type': 'text/plain' });
            res.end('Not Found\n');
            return;
          }
          if (method === 'GET') {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(todo, null, 2) + '\n');
          } else if (method === 'PATCH') {
            if (body == '') {
              res.writeHead(400, { 'content-type': 'text/plain' });
              res.end('Bad Request\n');
              return;
            }
            try {
              const json = JSON.parse(body);
              const index = todos.indexOf(todo);
              if (!('title' in json) && !('completed' in json)) {
                res.writeHead(422, { 'content-type': 'text/plain' });
                res.end(
                  `either of 'title' or 'completed' does not exist in body\n`,
                );
                return;
              }
              if (json['title']) {
                todos[index]!.title = json['title'];
              }
              if (json['completed'] !== undefined) {
                if (json['completed'] === true) {
                  todos[index]!.completedAt = new Date();
                } else {
                  todos[index]!.completedAt = null;
                }
              }
              res.writeHead(204);
              res.end();
            } catch (error: any) {
              res.writeHead(400, { 'content-type': 'text/plain' });
              res.end(`Bad Request\n`);
            }
          } else if (method === 'DELETE') {
            todos.splice(todos.indexOf(todo), 1);
            res.writeHead(204);
            res.end();
          } else {
            res.writeHead(405, { 'content-type': 'text/plain' });
            res.end(`Method Not Allowed\n`);
          }
        }
        break;

      default:
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('Not Found\n');
    }
  });
});

/*
GET /todos — return all todos
POST /todos — create a todo
GET /todos/:id — get one
PATCH /todos/:id — update it
DELETE /todos/:id — delete it
*/

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
