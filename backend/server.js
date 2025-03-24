const express = require('express');
const cors = require('cors');
const listingsRouter = require('./routes/listings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', listingsRouter);

app.listen(PORT, () => {
  console.log(`RankIt backend running at port ${PORT}`);
});