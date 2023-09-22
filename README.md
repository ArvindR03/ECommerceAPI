# E-Commerce API with Role Based Authentication

An API created with Express.js that uses a connection to a given MongoDB  to access information to products on the database, and more info. Uses JWT Authentication and implements role based user access such that only sellers can modify existing products.

### Setup

The `.env` file must include `DATABASE_URL` to connect to an external MongoDB database, `PORT` for the Express app to listen on, and `USER_AUTH_COLLECTION_NAME` to refer to the name of the collection in the database storing information about the users.