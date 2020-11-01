export default function handler(req, res) {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'application/json');
  // throw new Error('ha ha');
  // res.end(JSON.stringify({ name: 'John Doe' }));
  res.status(500).send('Something broke!');
}
