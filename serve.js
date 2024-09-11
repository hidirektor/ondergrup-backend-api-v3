const express = require('express');
const app = express();
const routers = require('./routers');

app.get('/', function (req, res) {
  res.json('OnderGrup BACK-END API PROJECT');
});

app.use('/api/v3/auth', routers.authRouter);
app.use('/api/v3/user', routers.userRouter);
app.use('/api/v3/file', routers.fileRouter);

app.use((req, res, next) => {
  res.status(404).send('404 NOT FOUND');
});

module.exports = app;