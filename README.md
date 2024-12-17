<img src="public/logo.png" align="right" width="300">
<br/>

## AanestysSovellus

<br/>
run --> npm install express mongoose dotenv bcryptjs jsonwebtoken cors

npm start käynnistääksesi serveri tuotantotilassa.

npm run dev käynnistääksesi serverin kehitystilassa automaattisen uudelleenkäynnistyksen kanssa.

run --> npm list

node_modules kansio ja dependencies lista pitäisi näyttää tältä:

##    ├── bcryptjs@2.4.3
##    ├── cors@2.8.5
##    ├── dotenv@16.4.5
##    ├── express@4.21.1
##    ├── jsonwebtoken@9.0.2
##    ├── mongodb@6.10.0
##    ├── mongoose@8.8.1
##    └── nodemon@3.1.7

# ! Note:

välttääksesi git commiting .env.local --cached

git rm .env --cached
git commit -m "Esimerkki viesti"


## Testaus ohjeet Postmanilla: 

Mene Postmanin nettisivulle tai lataa Postman agentti täältä [here](https://www.postman.com/downloads/)

Siirtyessäsi nettisivulle sinun pitäisi nähdä valinta jolla voit lähettää uuden api Requestin "Getting started" napin kohdalla

## Uuden käyttäjän rekisteröinti

1. **Luo uusi Request**: Paina "New" napista ja valitse "Request".

2. **Nimeä Request**: Nimeä pyynto "Rekisteröi käyttäjä" tai kuten haluat.

3. **Muuta Authorization tyyppi*: Muista vaihtaa authorization tyyppi joka on "Bearer Token"

4. **Valitse metodi ja URL**: aseta metodi: `POST` ja URL: `http://localhost:5000/api/auth/register`.

5. **Aseta Headers**: Lisää header: `Content-Type: application/json`.
    
6. **Aseta Body**: Valitse "Body" välilehti, ja valitse "raw" ja aseta tyyppi: `JSON`. Lisää seuraava seuraava JSON:

Esimerkki:

```
    {
        "username": "user1",
        "password": "testing"  
    }
```

Jos haluat rekisteröidä adminina, lisää admin "rooli":

```
    {
        "username": "user1",
        "password": "testing",
        "role": "admin"
    }
```

## Sisäänkirjautuminen

1. **Muuta URL:** `http://localhost:5000/api/auth/login`

   Ja nyt kirjaudu sisään uudella rekisteröidyllä käyttäjälläsi

```
    {

        "username": "user1",
        "password": "testing"  
    }
```


Onnistuneen sisäänkirjautumisen jälkeen, saat tokenin


(Pidä mielessä että tokeneilla on 1 tunnin vanhenemisaika turvallisuussyistä, joten jos saat virheitä kuten invalid token, se todennäköisesti tarkoittaa että token on vanhentunut )

## Äänestyksen luominen (Vain Adminille)

Kirjauduttuasi sisään adminina, seuraa näitä ohjeita luodaksesi äänestyksen

1. **Muuta URL:** POST `http://localhost:5000/api/polls/` 

2. Mene **Authorization** välilehdelle ja liitä se tokeni joka sinulle annettiin kirjauduttuasi sisään.

3. **Kirjotia äänestys**

Esimerkki:

```
   {
    
    "question": "Whats your favourite car brand?",
    "options": [
        { "name": "Toyota" },
        { "name": "Audi" },
        { "name": "Saab" }
    ]

   }
```

Onnistuneesti luodessasi äänestyksen, konsolisi pitäisi näyttää tältä:

(Muista että kaikki id:t jotka ovat näytillä ovat esimerkkejä, oikeasti ne ovat paljon pidempiä)

```
{
"message": "Poll created successfully",
"poll": {
    "question": "Whats your favourite car brand?",
    "options": [
        {
            "name": "Toyota",
            "votes": 0,
            "_id": "option:Id1"
        },
        {
            "name": "Audi",
            "votes": 0,
            "_id": "option:Id2"
        },
        {
            "name": "Saab",
            "votes": 0,
            "_id": "option:Id3"
        }
    ],
    "createdBy": "admins user:Id",
    "votedBy": [],
    "_id": "poll:Id",
    "createdAt": "2024-12-04T21:54:48.397Z",
    "updatedAt": "2024-12-04T21:54:48.397Z",
    "__v": 0
}
}
```

## Äänestäminen (Vain käyttäjille)

(Muista että olet asettanut bearer tokenin Authorization välilehdessä samalla tavalla kirjauduttuasi sisään käyttäjänä)

1. **Muuta URL:** POST `http://localhost:5000/api/polls/poll:Id/vote`

2. Kirjoita seuraavasti jos haluat äänestää ensimmäistä vaihtoehtoa "Toyota"

```
{
    "optionId": "option:Id1"
}   
```

Äänestäessäsi onnistuneesti, konsolisi pitäisi näyttää tältä:

```
    {
    "message": "Vote recorded",
    "poll": {
        "_id": "poll:Id",
        "question": "Whats your favourite car brand?",
        "options": [
            {
                "name": "Toyota",
                "votes": 1,
                "_id": "option:Id1"
            },
            {
                "name": "Audi",
                "votes": 0,
                "_id": "option:Id2"
            },
            {
                "name": "Saab",
                "votes": 0,
                "_id": "option:Id3"
            }
        ],
        "createdBy": "admins user:Id",
        "votedBy": [
            "user:Id"
        ],
        "createdAt": "2024-12-04T09:35:13.988Z",
        "updatedAt": "2024-12-04T21:42:32.772Z",
        "__v": 1
    }
}
```

Äänestäminen uudestaan samalla käyttäjällä ei ole mahdollista, jonka tuloksena on tämä viesti jos yritetään:

```
{
    "message": "You have already voted on this poll"
}
```

## Äänestyksen poistaminen (Vain Adminille)

(Muista että olet asettanut bearer tokenin Authorization välilehdessä samalla tavalla kirjauduttuasi sisään adminina)

1. **Muuta URL:** DELETE `http://localhost:5000/api/polls/poll:Id/`

Poistaessasi äänestyksen onnistuneesti, konsolisi pitäisi näyttää tältä:

```
{
    "message": "Poll deleted successfully"
}
```

## Äänestyksien hakeminen

1. **Muuta URL:** Get `http://localhost:5000/api/polls/`

Konsolin pitäisi näyttää kaikki äänestykset

#######


# Voting-app (English)

<br/>
run --> npm install express mongoose dotenv bcryptjs jsonwebtoken cors

npm start to run the server in production mode.

npm run dev to run the server in development mode with automatic restarts.

run --> npm list

node_modules folder and the list of dependencies should look like this:

## ├── bcryptjs@2.4.3

## ├── cors@2.8.5

## ├── dotenv@16.4.5

## ├── express@4.21.1

## ├── jsonwebtoken@9.0.2

## ├── mongodb@6.10.0

## ├── mongoose@8.8.1

## └── nodemon@3.1.7

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

```
    {
        "username": "user1",
        "password": "testing"
    }
```

If you want to register as an admin, simply add this:

```
    {
        "username": "user1",
        "password": "testing",
        "role": "admin"
    }
```

## Logging in

1. **Change the URL to:** `http://localhost:5000/api/auth/login`

   And now login with the newly registered user

```
    {

        "username": "user1",
        "password": "testing"
    }
```

After successfully loggin in, you will be given a token

(Keep in mind that tokens have a 1hour expiration, so if you get errors like invalid token, it most likely means the token has expired )

## Creating a poll (Admin Only)

After logging in as an admin, follow these steps to create a poll

1. **Change the URL to:** POST `http://localhost:5000/api/polls/`

2. Go to the **Authorization** tab and paste the token you were given after logging in.

3. **Type in the poll**

Example:

```
   {

    "question": "Whats your favourite car brand?",
    "options": [
        { "name": "Toyota" },
        { "name": "Audi" },
        { "name": "Saab" }
    ]

   }
```

After successfully creating a poll, your console should look like this:

(Keep in mind the ids shown here are just examples, in reality the ids are much longer)

```
{
"message": "Poll created successfully",
"poll": {
    "question": "Whats your favourite car brand?",
    "options": [
        {
            "name": "Toyota",
            "votes": 0,
            "_id": "option:Id1"
        },
        {
            "name": "Audi",
            "votes": 0,
            "_id": "option:Id2"
        },
        {
            "name": "Saab",
            "votes": 0,
            "_id": "option:Id3"
        }
    ],
    "createdBy": "admins user:Id",
    "votedBy": [],
    "_id": "poll:Id",
    "createdAt": "2024-12-04T21:54:48.397Z",
    "updatedAt": "2024-12-04T21:54:48.397Z",
    "__v": 0
}
}
```

## Voting on a poll (User only)

(Make sure you have set the bearer token in the Authorization tab after logging in as an user)

1. **Change the URL to:** POST `http://localhost:5000/api/polls/pollId/vote`

2. Type in the following if you want to vote Toyota, the first option

```
{
    "optionId": "optionId1"
}
```

After successfully voting, your console should look like this:

```
    {
    "message": "Vote recorded",
    "poll": {
        "_id": "poll:Id",
        "question": "Whats your favourite car brand?",
        "options": [
            {
                "name": "Toyota",
                "votes": 1,
                "_id": "option:Id1"
            },
            {
                "name": "Audi",
                "votes": 0,
                "_id": "option:Id2"
            },
            {
                "name": "Saab",
                "votes": 0,
                "_id": "option:Id3"
            }
        ],
        "createdBy": "admins user:Id",
        "votedBy": [
            "user:Id"
        ],
        "createdAt": "2024-12-04T09:35:13.988Z",
        "updatedAt": "2024-12-04T21:42:32.772Z",
        "__v": 1
    }
}
```

Voting again with the same user is not possible, resulting with this message if attempted:

```
{
    "message": "You have already voted on this poll"
}
```

## Deleting a poll (Admin only)

(Make sure you have set the bearer token in the Authorization tab after logging in as an admin)

1. **Change the URL to:** DELETE `http://localhost:5000/api/polls/poll:Id/`

After successfully deleting the poll, your console should look like this:

```
{
    "message": "Poll deleted successfully"
}
```

## Getting all polls

1. **Change the URL to:** Get `http://localhost:5000/api/polls/`

The console should display all the polls.

## Getting a single poll by Id

1. **Change the URL to:** Get `http://localhost:5000/api/polls/poll:id`

The console should display a singular poll.
