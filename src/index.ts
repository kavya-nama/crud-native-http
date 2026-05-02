import http from 'node:http';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost:' + PORT;

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Internal Server Error\n');
    console.error(`req.url does not exist`, req);
    return;
  }

  const url = new URL(`http://${HOST}${req.url}`);
  const pathList = url.pathname.split('/');
  pathList.shift();

  switch (pathList[0]) {
    case '':
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ hello: 'world' }));
      break;
    default:
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('Not Found\n');
  }
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
