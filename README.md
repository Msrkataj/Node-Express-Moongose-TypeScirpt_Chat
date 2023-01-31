**Final project during the Node.js course,** along with my own addition of guest login, registration and logout.<br/>
The chat is aimed at a geological company collecting data from the field, the chat will allow communication between person 'in the field'.

## Technologies:
- TypeScript<br/>
- ExpressJS<br/>
- Socket.io for communication in real time<br/>
- Mongoose to interact with the data-base<br/>
- Handlebars <br/>
- Passport, Express-session<br/>
- BCrypt<br/>

## Presentation: 

At the beginning, we are greeted by the login window, if the user doesn't have an acount yet, he can login as a guest.
Passport was used for simple user-password authorization in conjunction with express-session for session management, after logging in,
you can set up an account where data in saved along with the encrypt BCrypt password in MongoDB.
Messages can be sent either publicy to everyone or to a specific person, after logout and logging back in, the messegaes aren't deleted.<br/>
The project is constantly being improved.
## Start Chat:
```
npm start
```
<a href="https://postimg.cc/y39fpQvx" target="_blank"><img src="https://i.postimg.cc/8cXq5xvR/Zrzut-ekranu-z-2023-01-31-18-02-35.png" alt="Zrzut-ekranu-z-2023-01-31-18-02-35"/></a><br/><br/>

<a href="https://postimg.cc/PCd6KMZf" target="_blank"><img src="https://i.postimg.cc/dVyzsHVC/Zrzut-ekranu-z-2023-01-31-18-03-59.png" alt="Zrzut-ekranu-z-2023-01-31-18-03-59"/></a><br/><br/>

<a href="https://postimg.cc/hhxpBY1P" target="_blank"><img src="https://i.postimg.cc/8kX3hQFW/Zrzut-ekranu-z-2023-01-31-18-04-08.png" alt="Zrzut-ekranu-z-2023-01-31-18-04-08"/></a><br/><br/>
