const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Configure multer

const url = "mongodb+srv://vinh:0798595814@cluster0.q9lnnq3.mongodb.net/comicDB?retryWrites=true&w=majority&appName=Cluster0";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase timeout to 5000ms (5 seconds)
};
const mongoClient = new MongoClient(url, options);

app.use(express.json());
app.use(cors());

app.get('/api/comics', async (req, res) => {
    try {
        await mongoClient.connect();
        const collection = mongoClient.db("comicDB").collection("comics");
        const comics = await collection.find({}).toArray();
        res.json(comics);
    } catch (err) {
        console.error("Error fetching comics:", err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
});

app.post('/api/comics', upload.single('image'), async (req, res) => {
    try {
        await mongoClient.connect();
        const collection = mongoClient.db("comicDB").collection("comics");
        const { title, category, chapters, author, moTaNgan, noiDungTruyen } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const result = await collection.insertOne({ image, title, category, chapters, author, moTaNgan, noiDungTruyen });

        res.status(201).json(result.ops[0]);
    } catch (err) {
        console.error("Error creating comic:", err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
});

app.put('/api/comics/:id', async (req, res) => {
    try {
        await mongoClient.connect();
        const collection = mongoClient.db("comicDB").collection("comics");
        const { id } = req.params;
        const { image, title, category, chapters, author } = req.body;

        const result = await collection.updateOne({ _id: new ObjectId(id) }, {
            $set: { image, title, category, chapters, author }
        });

        if (result.modifiedCount > 0) {
            const updatedComic = await collection.findOne({ _id: new ObjectId(id) });
            res.json(updatedComic);
        } else {
            res.status(404).send("Comic not found or not updated");
        }
    } catch (err) {
        console.error("Error updating comic:", err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
});

app.delete('/api/comics/:id', async (req, res) => {
    try {
        await mongoClient.connect();
        const collection = mongoClient.db("comicDB").collection("comics");
        const { id } = req.params;

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.sendStatus(204); // No content
        } else {
            res.status(404).send("Comic not found");
        }
    } catch (err) {
        console.error("Error deleting comic:", err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
