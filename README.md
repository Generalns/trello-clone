# trello-clone
## Description

This project is a trello clone where you can create sections and task cards to follow your progress in a job. It has been developed in just 1 day using node.js and express on the backend, mongodb as a database, next.js and tailwind on the front-end. It also has a login and registration page which you can use with your credentials. Since the project is developed in just one day, it is quite possible that there are some bugs. 

## Launch

In order to launch the project first you must download both frontend and backend folders. Than you should run the command below for the both projects to install the required packages:

```
npm install
```

Than you should have a mongodb account it is free to create. After creating or logging in your mongodb account you should get your connection string.

You should than create a ".env" file at the root of the backend project folder. Than you should paste the line below to that file and save it:

```
MONGODB_CONNECTION_STRING= <your connection string here>
```

You should replace your connection string with <...> part of the line.

Than you should run the command below  in backend folder:

```
node server.js
```

And the command below in frontend folder:

```
npm run dev
```

That is it. If you have done all these steps successfully the program must be running on http://localhost:3000/ adress.

## Note

This project is not a complete clone of trello. There are still lots of features to add but I have build this project as a one day challenge. So I won't be improving it anymore but always feel free to contribute if you wish.