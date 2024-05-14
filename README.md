# WEB102_CAP1
# Simple Node.js Server for CRUD Operations on Products

This project showcases a basic Node.js server designed to perform CRUD (Create, Read, Update, Delete) operations on a list of products. The products' data is stored in a `data.json` file, ensuring persistence across server restarts. This setup is ideal for educational purposes or small-scale applications where a lightweight solution is preferred.

## Prerequisites

- Node.js installed on your machine.
- Basic knowledge of JavaScript and Node.js.

## Setup

1. Clone this repository or download the code.
2. Open a terminal or command prompt.
3. Navigate to the directory containing the downloaded code.
4. Run `npm install` to install the required dependencies (`http`, `fs`, and `url` modules are built-in, so no additional packages are needed).

## Running the Server

To start the server, execute the following command in your terminal:

![alt text](/assets/1.png)

The server will begin listening on `http://localhost:8081`.

## API Endpoints

### GET `/products`

- **Description**: Retrieves a list of all products.
- **HTTP Method**: GET
- **Response**: A JSON array of all products.

If a product ID is provided as a query parameter, the server returns the details of that specific product.

### POST `/products`

- **Description**: Creates a new product.
- **HTTP Method**: POST
- **Request Body**: A JSON object representing the new product.
- **Response**: A JSON object representing the newly created product.

### PUT `/products/:id`

- **Description**: Updates an existing product.
- **HTTP Method**: PUT
- **URL Parameter**: `id` - The ID of the product to update.
- **Request Body**: A JSON object with the fields to update.
- **Response**: A JSON object representing the updated product.

### PATCH `/products/:id`

- **Description**: Partially updates an existing product.
- **HTTP Method**: PATCH
- **URL Parameter**: `id` - The ID of the product to update.
- **Request Body**: A JSON object with the fields to update.
- **Response**: A JSON object representing the updated product.

### DELETE `/products/:id`

- **Description**: Deletes an existing product.
- **HTTP Method**: DELETE
- **URL Parameter**: `id` - The ID of the product to delete.
- **Response**: A JSON object representing the deleted product.

## Error Handling

The code implements robust error handling by using try-catch blocks to catch and handle errors related to file I/O, JSON parsing, and HTTP request processing. It also provides clear feedback to the client through HTTP status codes and error messages, ensuring that the application can recover from errors and maintain a consistent user experience.