#2811ICT Assignment - Part 3

## Comments

So, as per Ryouma's instructions (which I presume would be for sanity's sake), 
I've dumbed down the project to only specifically what is asked of the task 
sheet. Anything coming over from Assignment 1 has been scrapped (so that means 
no multi-channel or user groups).

## Getting Started

1. Start your MongoDB server; run `mongod`. Ensure it is at `localhost:27017`.
2. In the context of the `angular` folder, run `ng build`.
3. In the context of the `node` folder, run `node app.js`.

Simples. I hope.

## Feature Checklist

 [x] Uses MongoDB  
 [x] Login uses a username and password.  
 [x] Deny access if username is wrong.  
 [x] Chat _actually_ works, and uses sockets.  
 [x] You can upload a file to be your avatar.  
 [x] Uses Angular frontend and Node backend.  
 [x] Looks professional.  
 [x] Documentation is in Markdown for no good reason at all.   
 [x] Git.   
 [x] Error Checking: Valid username and user already existing...  
 [ ] End-to-end Testing  
 [x] Completely breaks all conventions, but _still_ works.  
 
You can ask Jolon why the last dot point exists.

## Documentation

#### Angular Components

There are two Angular components:

  * `login`, which is the login page, and:
  * `chat`, which is the main chat interface.
  
##### LoginComponent

The login component has the following fields:

  * `login_username` - The username field value of the login form. (Any ➞ String)
  * `login_password` - The password field value of the login form. (Any ➞ String)
  * `login_remember` - The remember checkbox value of the login form. (Any ➞ Boolean)
  * `register_username` - The username field value of the registration form. (Any ➞ String)
  * `register_password` and `register_password2` - The password fields' values of the registration form. (Any ➞ String)
  * `register_agree` - The "I agree to nothing" checkbox. (Any ➞ Boolean)
  
It has the following functions:

  * `ngOnInit()` - Hides all dialog messages.
  * `show(dialog)` - Shows the `login` or `register` screen in the component.
  * `login()` - Reads the login form data and performs the login operation.
  * `register()` - Reads the registration form data and performs the registration operation.
  
##### ChatComponent

The chat component is where the meat of the app works. It uses the following two components:

  * `SocketsService` - For sockets, and:
  * `UploadService` - For uploading files.
  
It also has the following fields:

  * `socketConnection` - An observer that activates on receiving sockets data from the server.
  * `message_input` - The string input of the input field.
  * `messages` - A primitive object array of message objects.
  * `new_avatar` - The file object of the file input form in the settings menu for setting a new avatar.
  * `new_password` and `new_password2` - The fields of the password input value in the settings menu for changing passwords.
  * `selectedFile` - The file path of `new_avatar`. This is set in `update_settings()`.
  
It has the following functions:

  * `ngOnInit()` - Sets the window up, and connects sockets.
  * `logout()` - Does what it says on the tin and returns to the login page.
  * `show_settings()` - Dims the screen and displays the settings window.
  * `hide_settings()` - Does the opposite of `show_settings()`.
  * `connectSockets()` - Called in `ngInit()`, it connects the sockets.
  * `disconnectSockets()` - Does the opposite of `connectSockets()`.
  * `send()` - Sends a message via socket to the server.
  * `refreshMessages()` - Clears the HTML message buffer and regenerates it from the stored `Message` array. Messages are generated without avatars because I can't figure out how to use `Promise.All()`.
  * `addMessage()` - Adds the message to the HTML and `Message` buffer. This is the only function that generates with avatars.
  * `update_settings()` - Triggered by a button in the settings menu, it reads the new password/avatar file and updates it server-side.
  * `onFileSelect()` - Callback from the file input element, and stores the path of the file to memory so that it can be used by `update_settings()`.
  
#### Node.JS Routes

So, `/uploads` pretty much accesses the `/node/uploads` folder. It is a static route,
and `/` pretty much accesses the `/angular/dist/angular/` folder. It is a static route.

In the project folder,

  * `api.js` houses all the routes involving APIs. But has been moved to the `routes.js` file. (This file is empty)
  * `app.js` initializes everything.
  * `routes.js` houses all code handling `POST` and `GET` routes and APIs.
  * `sockets.js` houses all the code regarding handling sockets.

##### API Routes

The following are the API requirements. They don't start with `/api/...` because why not.  
It is intended for these to have no error checking (outside of fatal errors) as error checking and validation is done in the Angular side.  
This acts as like a driver for Angular to use to access the MongoDB database.

_To be honest though, I could've just abstracted the whole thing..._

###### /get_user

Request: `{ username }`  
Response: ` [{ id, username, password, avatar }]`

Returns the information of the specified user. If `username` is blank, it returns _everyone_.

###### /add_user

Request: `{ username, password, avatar }`  
Response: `success`

Creates a new user in the database. Does not do any error checking. This is done in the angular app.  
Should always return `true` (even on duplicate entries) unless some fatal server error happens, like the MongoDB server crashing.

###### /set_user

Request: `{ username, password, avatar }`  
Response: `{ success }`

Updates an existing user. Should always return `true` unless something fatal happens. No error checking as this is done in the Angular app.

###### /get_messages

Request: `{ limit }`  
Response: `[{ username, message, timestamp }]
`

Returns an array of all messages if no `limit` is set. Otherwise, it returns an array of the last `limit` (a number) messages.

###### /upload

Request: `FormidableFormResponse`  
Response: `{ success, size, url }`

This endpoint accepts a formidable file upload request and saves the file to `/uploads`.
It then returns the status, size and URL.

Doesn't check for anything.

#### Sockets

The following are the sockets.

###### add_message

Sent from the client to the server, it adds a message to the message list and broadcasts it to other users.

Payload: `{ username, message }`

###### on_message

This is the event listened to by the client. It is emitted to all when a new message is sent.

Payload: `{ username, message, timestamp }`

Note that the timestamp is when the server received the message.

#### MongoDB

There's no point in describing the data structures as they are the same as the API routes' inputs and outputs.

It uses the database `2811ict-chatapp` and the collections `users` and `messages`.

Also, unless you're retarded, the names are self-explanatory. I hope you aren't so.

By default, connects to `mongodb://localhost:27017`.

## Git

I kinda forgot to version control the third one because I did it all in one shot; it's a repository with one commit.

The first two attempts are tracked by git properly though.