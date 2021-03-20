# Fundoo_Notes_Api
user can register with fundoo notes using name, email id and password.
user can login with email id and password to fundoo notes as well reset password if forgotten.
used jwt token based authorization for login.
after login user can create, read, update, delete notes.

Prerequisites
 need to install Node.js along with access to NPM. To check, open your terminal and type:
node -v
npm -v

Database used is MongoDB and also install MongoDB Compass as UI

Usage
git clone https://github.com/payalghusalikar/Fundoo_Notes_Api.git cd FundooNotesBackEnd npm install (npm i) node server.js to run using nodemon : nodemon server.js

Go to http://localhost:2001/. If port 2001 is already in use on your machine, the program will specify the available port (incremental) for you.

you can replace the port in your .env file

Author
[Payal Ghusalikar] ((https://github.com/payalghusalikar))

