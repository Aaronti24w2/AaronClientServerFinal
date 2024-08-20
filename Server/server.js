const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://aaronti2002:Ah251102@todoappcluster.ljh4a.mongodb.net/?retryWrites=true&w=majority&appName=ToDoAppCluster";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const db = client.db('ToDoAppDatabase');
        const tasksCollection = db.collection('tasks');

        app.get('/api/tasks', async (req, res) => {
            try {
              const tasks = await tasksCollection.find().toArray();
              res.json(tasks);
            } catch (error) {
              res.status(500).json({ message: 'Error fetching tasks' });
            }
          });

          app.post('/api/tasks', async (req, res) => {
            try {
              const task = req.body;
              const result = await tasksCollection.insertOne(task);
              res.status(201).json(result.ops[0]);
            } catch (error) {
              res.status(400).json({ message: 'Error creating task' });
            }
          });

          app.patch('/api/tasks/:id', async (req, res) => {
            try {
              const { id } = req.params;
              const updateData = req.body;
              const result = await tasksCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
              );
              if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Task not found' });
              }
              res.json({ message: 'Task updated' });
            } catch (error) {
              res.status(400).json({ message: 'Error updating task' });
            }
          });

          app.delete('/api/tasks/:id', async (req, res) => {
            try {
              const { id } = req.params;
              const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
              if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Task not found' });
              }
              res.json({ message: 'Task deleted' });
            } catch (error) {
              res.status(500).json({ message: 'Error deleting task' });
            }
          });
      
        } catch (error) {
          console.error('Error connecting to MongoDB Atlas', error);
        }
      }
      
      connectToDatabase().catch(console.error);

      


      if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
      }

      module.exports = app;

