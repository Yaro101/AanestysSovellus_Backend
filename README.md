## AanestysSovellus

run --> npm install express mongoose dotenv bcryptjs jsonwebtoken cors

npm start to run the server in production mode.

npm run dev to run the server in development mode with automatic restarts.

run --> npm list

node_modules folder and the list of dependencies should look like this:

├── bcryptjs@2.4.3
├── cors@2.8.5
├── dotenv@16.4.5
├── express@4.21.1
├── jsonwebtoken@9.0.2
├── mongodb@6.10.0
├── mongoose@8.8.1
└── nodemon@3.1.7

# ! Note:

to avoid git commiting .env.local --cached

git rm .env --cached
git commit -m "Any message"
