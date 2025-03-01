// Filename: missingRoute.js
// middleware to handle any non-existing routes; returns a 404 message

const missingRoute = (req, res) => {
  res.render('error', { title: 'Error 404', description: 'Page Not Found' });
};

export default missingRoute;
