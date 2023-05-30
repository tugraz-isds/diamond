const app = require('./app');

const appPort = process.env.PORT || 8000;

app.listen(appPort, () => {
  console.log(`App listening at http://localhost:${appPort}`);
});

