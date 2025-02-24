

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const Document = require('./models/Document');

dotenv.config();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const io = socketIo(server, {
  cors: {

    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,


  },
});

app.use(cors({

  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true,


}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  app.post('/api/docs', async (req, res) => {
    try {
        const { content = '' } = req.body;
        const doc = new Document({ content });
        await doc.save();
        res.status(201).send({ _id: doc._id, content: doc.content });
    } catch (err) {
        console.error('Error creating document:', err);
        res.status(400).send({ error: 'Document creation failed', details: err.message });
    }
});

app.get('/api/docs/:id', async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).send({ error: 'Document not found' });
        res.send(doc);
    } catch (err) {
        console.error('Error fetching document:', err);
        res.status(500).send({ error: 'Failed to fetch document', details: err.message });
    }
});


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinDocument', (docId) => {
    console.log(`Client joined document: ${docId}`);
    socket.join(docId);

    Document.findById(docId)
      .then((doc) => {
        if (doc) {
          socket.emit('loadDocument', doc.content);
        }
      })
      .catch((err) => console.error('Error loading document:', err));
  });

  socket.on('sendChanges', ({ docId, content }) => {
    console.log(`Changes received for doc ${docId}`);

    socket.to(docId).emit('receiveChanges', content);

    Document.findByIdAndUpdate(docId, { content })
      .then(() => console.log('Document updated'))
      .catch((err) => console.error('Error updating document:', err));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
