import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import qr from 'qr-image';
import fs from 'fs';

const app = express();
const port = 3002;

// Set the directory path for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handle GET request to the root URL
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Handle POST request to /download
app.post('/download', express.json(), (req, res) => {
  const { url } = req.body;

  // Generate QR code image
  const qr_svg = qr.image(url);
  qr_svg.pipe(fs.createWriteStream(join(__dirname, 'qr_img.png')));

  // Save URL to a text file
  fs.writeFile(join(__dirname, 'URL.txt'), url, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving the URL.');
    } else {
      console.log('The files have been saved!');
      res.send('URL downloaded successfully.');
    }
  });
});

// Handle GET request to download the QR code image
app.get('/download/qr', (req, res) => {
  const qrImgPath = join(__dirname, 'qr_img.png');
  res.download(qrImgPath);
});

// Handle GET request to download the text file
app.get('/download/url', (req, res) => {
  const urlFilePath = join(__dirname, 'URL.txt');
  res.download(urlFilePath);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// This code is an example of a Node.js server using the Express framework. It sets up a server to handle requests, generate QR code images, save URLs to a text file, and serve static files. Let's go through each part:

// The code imports required modules: url, path, express, qr-image, and fs. These modules provide necessary functionality for handling URLs, file paths, server operations, QR code generation, and file system operations.

// An Express application is created using express() and assigned to the app constant.

// The port constant is set to 3002, specifying the port on which the server will listen for incoming requests.

// The __filename constant is set to the current file's URL path converted to the file system path using fileURLToPath() from the url module. The __dirname constant is set to the directory name of __filename using dirname() from the path module. These variables allow us to reference the current file's path and directory.

// The code sets up a route to handle GET requests to the root URL ("/"). When a GET request is made to the root URL, the server responds by sending the index.html file using res.sendFile().

// The code sets up a route to handle POST requests to the "/download" endpoint. It uses express.json() middleware to parse JSON data in the request body. When a POST request is made to "/download", the server generates a QR code image based on the URL received, saves the image to the file system, and saves the URL to a text file. It sends an appropriate response based on the success or failure of the file operations.

// The code sets up routes to handle GET requests to "/download/qr" and "/download/url". When a GET request is made to these endpoints, the server sends the corresponding files for download using res.download().

// The server is started by calling app.listen() with the specified port. It logs a message to the console to indicate that the server is running.

// This code provides a basic server implementation with routes to handle requests, generate and save QR code images, and serve static files. The server listens on port 3002 by default, but you can modify the port constant to use a different port if desired.