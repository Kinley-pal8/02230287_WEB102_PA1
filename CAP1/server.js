// Import required modules
const http = require('http'); // Module for creating an HTTP server
const fs = require('fs'); // Module for reading and writing files
const url = require('url'); // Module for parsing URL strings

// Function to read data from data.json file
const readData = () => {
  try {
    // Read the contents of data.json file
    const data = fs.readFileSync('data.json', 'utf-8');
    // Parse the JSON data and return it
    return JSON.parse(data);
  } catch (err) {
    // If the file doesn't exist
    if (err.code === 'ENOENT') {
      // Create a new data.json file with an empty array
      fs.writeFileSync('data.json', '[]');
      return [];
    } else {
      // Log the error and return an empty array
      console.error('Error reading data:', err);
      return [];
    }
  }
};

// Function to write data to data.json file
const writeData = (data) => {
  try {
    // Convert the data to JSON string and write it to data.json file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  } catch (err) {
    // Log the error if writing fails
    console.error('Error writing data:', err);
  }
};

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Get the request method and URL
  const { method, url: requestUrl } = req;
  // Parse the URL to get the path and query parameters
  const parsedUrl = url.parse(requestUrl, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Handle different routes
  switch (path) {
    case '/products':
      // Call the handleProducts function for /products route
      handleProducts(req, res, method, query);
      break;
    default:
      // Return 404 Not Found for other routes
      res.statusCode = 404;
      res.end('Not Found');
  }
});

// Function to handle products requests
const handleProducts = (req, res, method, query) => {
  // Read the products data
  const products = readData();
  // Get the product id from the query parameters
  const id = query.id;

  // Handle different HTTP methods
  switch (method) {
    case 'GET':
      // If an id is provided, return the product with that id
      if (id) {
        const product = products.find((p) => p.id === parseInt(id));
        if (product) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(product));
        } else {
          res.statusCode = 404;
          res.end('Product not found');
        }
      } else {
        // If no id is provided, return all products
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(products));
      }
      break;
    case 'POST':
      // Handle creating a new product
      let body = '';
      req.on('data', (chunk) => {
        // Accumulate the incoming data chunks
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          // Parse the request body as JSON
          const newProduct = JSON.parse(body);
          // Generate a new id for the product
          newProduct.id = products.length + 1;
          // Add the new product to the products array
          products.push(newProduct);
          // Write the updated products to data.json
          writeData(products);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(newProduct));
        } catch (err) {
          // If the request body is not valid JSON, return 400 Bad Request
          res.statusCode = 400;
          res.end('Bad Request');
        }
      });
      break;
    case 'PUT':
      // Handle updating an existing product
      if (id) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            // Parse the request body as JSON
            const updatedProduct = JSON.parse(body);
            // Find the index of the product with the given id
            const index = products.findIndex((p) => p.id === parseInt(id));
            if (index !== -1) {
              // Update the product at the found index
              products[index] = { ...products[index], ...updatedProduct };
              // Write the updated products to data.json
              writeData(products);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(products[index]));
            } else {
              res.statusCode = 404;
              res.end('Product not found');
            }
          } catch (err) {
            res.statusCode = 400;
            res.end('Bad Request');
          }
        });
      } else {
        res.statusCode = 400;
        res.end('Bad Request');
      }
      break;
    case 'PATCH':
      // Handle partially updating an existing product
      if (id) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            // Parse the request body as JSON
            const updatedFields = JSON.parse(body);
            // Find the index of the product with the given id
            const index = products.findIndex((p) => p.id === parseInt(id));
            if (index !== -1) {
              // Update the product with the new fields
              const updatedProduct = { ...products[index], ...updatedFields };
              // Replace the product with the updated one
              products[index] = updatedProduct;
              // Write the updated products to data.json
              writeData(products);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(updatedProduct));
            } else {
              res.statusCode = 404;
              res.end('Product not found');
            }
          } catch (err) {
            res.statusCode = 400;
            res.end('Bad Request');
          }
        });
      } else {
        res.statusCode = 400;
        res.end('Bad Request');
      }
      break;
    case 'DELETE':
      // Handle deleting an existing product
      if (id) {
        // Find the index of the product with the given id
        const index = products.findIndex((p) => p.id === parseInt(id));
        if (index !== -1) {
          // Remove the product from the array
          const deletedProduct = products.splice(index, 1)[0];
          // Write the updated products to data.json
          writeData(products);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(deletedProduct));
        } else {
          res.statusCode = 404;
          res.end('Product not found');
        }
      } else {
        res.statusCode = 400;
        res.end('Bad Request');
      }
      break;
    default:
      // If the HTTP method is not allowed, return 405 Method Not Allowed
      res.statusCode = 405;
      res.end('Method Not Allowed');
  }
};

// Start the server and listen on port 8081
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});