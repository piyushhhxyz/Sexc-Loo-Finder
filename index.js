const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const multer = require('multer');
const express = require('express');
const shopRoutes = require('./src/routes/shops');
const { dbConnect } = require("./config/connectDB")
// const fileUpload = require("express-fileupload")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const upload = multer({ dest: 'uploads/' });

const S3 = new S3Client({
    region: 'YOUR_AWS_REGION',
    credentials: {
      accessKeyId: 'YOUR_ACCESS_KEY',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    },
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileStream = Readable.from(req.file.buffer);
  
    const params = {
      Bucket: 'GetEpicShitDone',
      Key: req.file.originalname,
      Body: fileStream,
    };
  
    try {
      await s3Client.send(new PutObjectCommand(params));
      console.log('File uploaded successfully');
      res.status(200).send('File uploaded');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to upload file');
    }
  });

app.use('/api/shops', shopRoutes);

dbConnect();
app.get("/", (_, res) => res.send("Welcome to The Royal Washrooms API"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
