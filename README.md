## AanestysSovellus

run --> npm install express mongoose dotenv bcryptjs jsonwebtoken cors

npm start to run the server in production mode.

npm run dev to run the server in development mode with automatic restarts.

run --> npm list

node_modules folder and the list of dependencies should look like this:

##    ├── bcryptjs@2.4.3
##    ├── cors@2.8.5
##    ├── dotenv@16.4.5
##    ├── express@4.21.1
##    ├── jsonwebtoken@9.0.2
##    ├── mongodb@6.10.0
##    ├── mongoose@8.8.1
##    └── nodemon@3.1.7

# ! Note:

to avoid git commiting .env.local --cached

git rm .env --cached
git commit -m "Any message"


## Testing steps with Postman: 

Go to postman website or download the Postman agent from [here](https://www.postman.com/downloads/)

Entering the website you should see an option to send a new api request, under the "Getting started" tab

## Registering an user

1. **Create a New Request**: Click on the "New" button and select "Request".

2. **Name the Request**: Name it "Register user" or however you like.

3. **Change the authorization type**: Make sure to change Auth type to "Bearer Token"

4. **Select Method and URL**: Set the method to `POST` and the URL to `http://localhost:5000/api/auth/register`.

5. **Set Headers**: Add a header with `Content-Type: application/json`.
    
6. **Set Body**: Select the "Body" tab, choose "raw" and set the type to `JSON`. Add the following JSON:

Example:

    {
        "username": "user1",
        "password": "testing"  
    }

If you want to register as an admin, simply add this:

    {
        "username": "user1",
        "password": "testing",
        "role": "admin"
    }


## Logging in

1. **Change the URL to: **`http://localhost:5000/api/auth/login`

    And now login with the newly registered user

    {

        "username": "user1",
        "password": "testing"  
    }

    After successfully loggin in, you will be given a token

    (Keep in mind that tokens have a 1hour expiration, so if you get errors like invalid token, it most likely means the token has expired )

## Creating a poll (Admin Only)

After logging in as an admin, follow these steps to create a poll

1. **Change the URL to:**`http://localhost:5000/api/polls/` 

2. Go to the **Authorization** tab and paste the token you were given after logging in.

3. **Type in the poll**

Example:

   {
    
    "question": "Whats your favoourite car brand?",
    "options": [
        { "name": "Toyota" },
        { "name": "Audi" },
        { "name": "Saab" }
    ]

   }









