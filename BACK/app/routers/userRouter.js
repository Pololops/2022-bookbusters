const express = require('express');

const router = express.Router();

const controllerHandler = require('../middlewares/controllerWrapperAsync');
const { verifyToken } = require('../middlewares/tokenVerifier');
const userController = require('../controllers/userController');

const validate = require('../validator/validator');
const createSchema = require('../validator/schemas/userCreate');
const updateSchema = require('../validator/schemas/userUpdate');
const loginSchema = require('../validator/schemas/login');

router
    .route('/user')
    /**
     * POST /v1/user
     * @summary Add a user to database
     * @tags USER
     * @param {InputUser} request.body.required - user info
     * @return {User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .post(validate(createSchema, 'body'), controllerHandler(userController.addUser));

router
    .route('/user/:id(\\d+)')
    /**
     * GET /v1/user/{id}
     * @summary Get one user by its id
     * @tags USER
     * @security BearerAuth
     * @param {number} id.path.required - user identifier
     * @return {User} 200 - success response - application/json
     */
    .get(controllerHandler(verifyToken), controllerHandler(userController.getOneUserById))
    /**
     * DELETE /v1/user/{id}
     * @summary Delete one user
     * @tags USER
     * @security BearerAuth
     * @param {number} id.path.required - user identifier
     * @return {User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - User not found - application/json
     */
    .delete(controllerHandler(verifyToken), controllerHandler(userController.deleteOneUserById))
    /**
     * PATCH /v1/user/{id}
     * @summary Update one user
     * @tags USER
     * @security BearerAuth
     * @param {login} request.body.required - user email and password
     * @return {User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - User not found - application/json
     */
    .patch(
        controllerHandler(verifyToken),
        validate(updateSchema, 'body'),
        controllerHandler(userController.update),
    );

/**
 * POST /v1/login
 * @summary log a user in
 * @tags USER
 * @param {Login} request.body.required - user login email and password
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.post('/login', validate(loginSchema, 'body'), controllerHandler(userController.login));

module.exports = router;