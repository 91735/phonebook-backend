# Phonebook

App is configure to run in render.com

The code is stored in two repositories. First one contains all course material 
chapters and second one that contains only the phonebook backend + the 
phonebook frontend and is connected to render for cloud deployment.

You can deploy the phonebook app to cloud with command: npm run deploy:full

Link to app: https://phonebook-backend-pmys.onrender.com/

## Configuration
Frontend is in part 2 folder. See package.json deploy:full for more information.

Backend is in this part 3 directory and they are bundled together for cloud deployment.

Database is hosted in mongo atlas.

## Local testing
You can start the local express app with command: npm run dev

Then you can use your favourite http testing tool. 
I am using httpyac vscode plugin and testing.http can be used with it.
