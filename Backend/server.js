const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { setIO } = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  socket.on('joinAdminRoom', (adminId) => {
    if (adminId) socket.join(String(adminId));
  });
});

setIO(io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/warehouse', require('./routes/warehouseRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// FIX: Changed these to plural to match Frontend API calls
app.use('/api/deliveries', require('./routes/deliveryRoutes')); 
app.use('/api/transfers', require('./routes/transferRoutes'));   
app.use('/api/receipts', require('./routes/receiptRoutes')); 
app.use('/api/adjustments', require('./routes/adjustmentRoutes')); // Ensure plural

app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/movements', require('./routes/movementRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));