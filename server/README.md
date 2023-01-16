## Project Setup

1. First, open your VSCODE
2. open two terminal inside on it,
3. Change directory based on folder name (client/server) in each terminal

- **Server**

  - after you `cd server`
    **Install depedency modules**

BEFORE USE SEQUELIZE-CLI : MAKE SURE THAT YOUR USERNAME AND PASSWORD IN `server/config/config.json` ARE MATCHING WITH YOUR DATABASE USERNAME AND PASSSWORD. IF NOT, PLEASE EDIT THE CONFIG USERNAME AND PASSWORD IN `development, test` KEYS SECTION.

```
npm install
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

**Make sure to run your Redis in local too before run the express server app**

BEFORE RUNNING : MAKE SURE THAT YOUR CONFIG OF PORT/HOST/PASSWORD IN `server/config/connectRedis` ARE MATCHING WITH YOUR DATABASE USERNAME AND PASSSWORD. IF NOT, PLEASE EDIT THE CONFIG IN `server/config/connectRedis`.

**Run server**

```
npm run dev
```

currently username & password :

1. username : messi | password : messi
2. username : ronaldo | password : ronaldo

Please refer to `API_DOC` for API Documentations.

I also included postman collection if you want to use postman for better REST API manipulation procedures, you can just import the json file of `tes_klink.postman_collection`
