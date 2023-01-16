const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt-password');
const { createToken } = require('../helpers/json-web-token');
// const { sequelize, Sequelize } = require('../models');

class UserController {
    static async registerMethod(req, res, next) {
        //! REGISTER
        try {
            let bodyToCreate = {
                username: req.body.username,
                password: req.body.password,
            };


            // Check if uname is already taken
            const isUnameAlreadyExisted = await User.findOne({
                where: {
                    username: bodyToCreate.username
                },
            });
            if (isUnameAlreadyExisted) {
                throw { name: "username must be unique" };
            };



            let createUser = await User.create(
                bodyToCreate
            );

            res.status(201).json({ message: `user with username ${createUser.username} has been created` });

        } catch (error) {
            //console.log(error)
            next(error);
        }
    }

    static async loginMethod(req, res, next) {
        try {
            // dapatkan data dari body
            let bodyLogin = {
                username: req.body.username,
                password: req.body.password
            };

            if (!bodyLogin.username || !bodyLogin.password) {
                throw {
                    name: `invalid username/password`
                };
            }

            // cari by username
            let findUser = await User.findOne({ where: { username: bodyLogin.username } });
            // //console.log(findUser, `<<<< masuk`)
            // kalo gaada
            if (!findUser) {
                throw {
                    name: `invalid username/password`
                };
            }
            // compare password
            const passwordValidation = comparePassword(bodyLogin.password, findUser.password);
            if (!passwordValidation) {
                throw {
                    name: `invalid username/password`
                };
            }
            // bikin token nya
            let usernameFind = findUser.username;
            const payload = {
                id: findUser.id,
                username: usernameFind,
            };
            const access_token = createToken(payload);
            res.status(200).json({ access_token });
        } catch (error) {
            //console.log(error)
            next(error);
        }
    }

}

module.exports = UserController;