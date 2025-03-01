// Filename: missingRoute.js
// middleware to handle any non-existing routes; returns a 404 message

const missingRoute = (req, res) => {
  res.status(404).send('404 Page Not Found');
};

export default missingRoute;
