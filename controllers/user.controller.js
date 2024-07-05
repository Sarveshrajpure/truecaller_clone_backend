const httpStatus = require("http-status");
const { userRegisterSchema } = require("../validations/user.validations");
const user = require("../db/models/user");
const services = require("../services");
const userController = {
  async registerUser(req, res, next) {
    try {
      let values = await userRegisterSchema.validateAsync(req.body);

      await services.userService.checkUserExists(values.phoneNumber, values.email);

      let newUser = await user.create({
        name: values.name,
        password: values.password,
        phoneNumber: values.phoneNumber,
        email: values.email,
      });

      let createdUser = newUser.toJSON();
      let name = createdUser.name;
      let phoneNumber = createdUser.phoneNumber;
      let registeredUserId = createdUser.id;
      let importedByUserId = createdUser.id;

      let createGolabRecord = await services.globalStoreService.createGlobalStoreRecord(
        name,
        phoneNumber,
        registeredUserId,
        importedByUserId
      );

      res.status(httpStatus.OK).send({ createdUser: newUser, golabStoreRecord: createGolabRecord });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = userController;
