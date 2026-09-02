# crud-native-http

A tiny in-memory Todo API I made with just `node:http`, no Express.js. 

Wanted to see how raw HTTP works so I did routing and body parsing by hand.

## Running 

```bash
bun install
bun run dev

PORT=4000 bun run start
```

Runs on `http://localhost:3000` by default.

## Endpoints

```
GET    /              -> hello world
GET    /todos         -> list all
POST   /todos         -> create {title}
GET    /todos/:id     -> get one
PATCH  /todos/:id     -> update title or completed
DELETE /todos/:id     -> delete
```

Example:

```bash
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Touch grass"}'
curl http://localhost:3000/todos
```

