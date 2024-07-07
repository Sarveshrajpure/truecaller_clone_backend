const httpStatus = require("http-status");
const { userRegisterSchema, userLoginSchema } = require("../validations/user.validations");
const user = require("../db/models/user");
const services = require("../services");
const bcrypt = require("bcrypt");
const { ApiError } = require("../middlewares/errorHandlingMiddleware");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const userController = {
  async registerUser(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let values = await userRegisterSchema.validateAsync(req.body);

      await services.userService.checkUserExists(values.phoneNumber, values.email);

      let newUser = await user.create(
        {
          name: values.name,
          password: values.password,
          phoneNumber: values.phoneNumber,
          email: values.email.length > 1 ? values.email : null,
        },
        { transaction: t }
      );

      let createdUser = newUser.toJSON();
      delete createdUser.password;
      delete createdUser.deletedAt;

      let name = createdUser.name;
      let phoneNumber = createdUser.phoneNumber;
      let registeredUserId = createdUser.id;
      let importedByUserId = createdUser.id;

      let createGolabRecord = await services.globalStoreService.createGlobalStoreRecord(
        name,
        phoneNumber,
        registeredUserId,
        importedByUserId,
        t
      );
      await t.commit();
      res
        .status(httpStatus.OK)
        .send({ createdUser: createdUser, golabStoreRecord: createGolabRecord });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },

  async loginUser(req, res, next) {
    try {
      let values = await userLoginSchema.validateAsync(req.body);

      let userExists = await services.userService.findUserByPhoneNumber(values.phoneNumber);

      if (userExists === false || !(await bcrypt.compare(values.password, userExists.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Phone number or Password Incorrect");
      }

      const token = generateToken({ id: userExists.id });
      delete userExists.password;
      delete userExists.deletedAt;
      res.status(httpStatus.OK).send({ userExists, token });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = userController;
