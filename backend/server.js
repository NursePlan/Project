require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');  // 👈 Aggiunto

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  // 👈 Aggiunto

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
