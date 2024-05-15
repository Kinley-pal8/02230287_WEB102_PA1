// Import required modules
const http = require("http"); // Module for creating an HTTP server
const fs = require("fs/promises"); // Module for reading and writing files (using promises)

// Function to read data from data.json file
const readData = async () => {
 try {
   // Read the contents of data.json file
   const data = await fs.readFile("data.json", "utf-8");
   // Parse the JSON data and return it
   return JSON.parse(data);
 } catch (err) {
   // If the file doesn't exist or there's an error reading it
   console.error("Error reading data:", err);
   // Create a new data.json file with an empty array
   await fs.writeFile("data.json", "[]");
   return [];
 }
};

// Function to write data to data.json file
const writeData = async (data) => {
 try {
   // Convert the data to JSON string and write it to data.json file
   await fs.writeFile("data.json", JSON.stringify(data, null, 2));
 } catch (err) {
   // Log the error if writing fails
   console.error("Error writing data:", err);
 }
};

// Create an HTTP server
const server = http.createServer(async (req, res) => {
 // Get the request method and URL
 const { method, url: requestUrl } = req;
 // Parse the URL to get the path and query parameters
 const parsedUrl = new URL(requestUrl, `http://${req.headers.host}`);
 const path = parsedUrl.pathname;
 const queryParams = Object.fromEntries(parsedUrl.searchParams);

 // Handle different routes
 switch (path) {
   case "/products":
     // Call the handleProducts function for /products route
     await handleProducts(req, res, method, queryParams);
     break;
   default:
     // Return 404 Not Found for other routes
     res.statusCode = 404;
     res.end("Not Found");
 }
});

// Function to handle products requests
const handleProducts = async (req, res, method, queryParams) => {
 // Read the products data
 const products = await readData();
 // Get the product id from the query parameters
 const id = queryParams.id;

 // Helper function to send a JSON response
 const sendJSONResponse = (statusCode, data) => {
   res.statusCode = statusCode;
   res.setHeader("Content-Type", "application/json");
   res.end(JSON.stringify(data));
 };

 // Handle different HTTP methods
 switch (method) {
   case "GET":
     // If an id is provided, return the product with that id
     if (id) {
       const product = products.find((p) => p.id === parseInt(id));
       if (product) {
         sendJSONResponse(200, product);
       } else {
         res.statusCode = 404;
         res.end("Product not found");
       }
     } else {
       // If no id is provided, return all products
       sendJSONResponse(200, products);
     }
     break;
   case "POST":
     // Handle creating a new product
     let body = "";
     req.on("data", (chunk) => {
       body += chunk.toString();
     });
     req.on("end", async () => {
       try {
         // Parse the request body as JSON
         const newProduct = JSON.parse(body);
         // Generate a new id for the product
         newProduct.id = products.length + 1;
         // Add the new product to the products array
         products.push(newProduct);
         // Write the updated products to data.json
         await writeData(products);
         sendJSONResponse(201, newProduct);
       } catch (err) {
         // If the request body is not valid JSON, return 400 Bad Request
         res.statusCode = 400;
         res.end("Bad Request");
       }
     });
     break;
   case "PUT":
     // Handle updating an existing product
     if (id) {
       let body = "";
       req.on("data", (chunk) => {
         body += chunk.toString();
       });
       req.on("end", async () => {
         try {
           // Parse the request body as JSON
           const updatedProduct = JSON.parse(body);
           // Find the index of the product with the given id
           const index = products.findIndex((p) => p.id === parseInt(id));
           if (index !== -1) {
             // Update the product at the found index
             products[index] = { ...products[index], ...updatedProduct };
             // Write the updated products to data.json
             await writeData(products);
             sendJSONResponse(200, products[index]);
           } else {
             res.statusCode = 404;
             res.end("Product not found");
           }
         } catch (err) {
           res.statusCode = 400;
           res.end("Bad Request");
         }
       });
     } else {
       res.statusCode = 400;
       res.end("Bad Request");
     }
     break;
   case "PATCH":
     // Handle partially updating an existing product
     if (id) {
       let body = "";
       req.on("data", (chunk) => {
         body += chunk.toString();
       });
       req.on("end", async () => {
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
             await writeData(products);
             sendJSONResponse(200, updatedProduct);
           } else {
             res.statusCode = 404;
             res.end("Product not found");
           }
         } catch (err) {
           res.statusCode = 400;
           res.end("Bad Request");
         }
       });
     } else {
       res.statusCode = 400;
       res.end("Bad Request");
     }
     break;
   case "DELETE":
     // Handle deleting an existing product
     if (id) {
       // Find the index of the product with the given id
       const index = products.findIndex((p) => p.id === parseInt(id));
       if (index !== -1) {
         // Remove the product from the array
         const deletedProduct = products.splice(index, 1)[0];
         // Write the updated products to data.json
         await writeData(products);
         sendJSONResponse(200, deletedProduct);
       } else {
         res.statusCode = 404;
         res.end("Product not found");
       }
     } else {
       res.statusCode = 400;
       res.end("Bad Request");
     }
     break;
   default:
     // If the HTTP method is not allowed, return 405 Method Not Allowed
     res.statusCode = 405;
     res.end("Method Not Allowed");
 }
};

// Start the server and listen on port 8081
const PORT = 8081;
server.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});