// Filename: app.js
// the Express.js server instance

import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// EJS templating
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// routes
app.get('/', (req, res) => {
  res.send('Simple Task Management');
});

// start server
app.listen(PORT, () => {
  console.log(
    `Simple Task Management application running at http://localhost:${PORT}`
  );
});
