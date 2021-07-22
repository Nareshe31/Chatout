<h1 align="center">Welcome to Chatout 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>


### 🕵️‍♀️Description

> A web application to chat with your family members and friends (who are already an user) in realtime.

### Features
- Login using QR code
- Search any existing user (after logging in)
- Chat with any existing user (after logging in)
- Send images from your internal memory, clipboard or even by dropping them (after logging in)

### ✨ Demo
------------
This application is deployed on **[Heroku](https://www.heroku.com/).**  Please check it out **[here😃](https://chat-out.herokuapp.com/)**.

[![Demo gif](https://res.cloudinary.com/dkmxj6hie/image/upload/v1626971905/Chatout-demo_pcqfcs.gif "Demo")](https://res.cloudinary.com/dkmxj6hie/image/upload/v1626971905/Chatout-demo_pcqfcs.gif "Demo")



### Built with
-------

- **[React](https://reactjs.org/)** - a free and open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.
- **[Node](https://nodejs.org/)** - an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.
- **[Express](https://expressjs.com/)** - a back end web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js.
- **[MongoDB](https://www.mongodb.com/)** - a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.
- **[Socket.io](https://socket.io/)** - a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js.


### Prerequirements
- **[Node](https://nodejs.org/en/download/)** >=10.0.0
- **[MongoDB](https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3)**
- **[npm](https://nodejs.org/en/download/package-manager/)**


### Installation & Usage
--------
1. Clone this repository or download it as zip
2. Setup frontend by installing dependencies

   `cd client`
 
   `npm install`
 
3. Setup backend by installing dependencies

   `npm install`
  
4. Configure `.env` file in server folder and insert the following code. Replace values with yours
```javascript
    PORT=5000
    MONGO_URI="your-mongodb-uri"
    JWT_SECRET="your-jwt-secret"
```
5. Make sure mongodb is running in your system
6. Running application in development mode
   1. Client side

      `cd client`
    
      `npm run start`

      Open `http://localhost:3000` in your browser to see client
   2. Server side
   
      `npm run server`
	  
	  Open `http://localhost:5000` in your browser to see server



### Author
---------
👤 **Naresh E**

* Website: https://nareshe.netlify.app
* Github: [@Nareshe31](https://github.com/Nareshe31)
* LinkedIn: [@naresh-e](https://linkedin.com/in/naresh-e)


### Show your support
----------

Give a ⭐️ if this project helped you!

