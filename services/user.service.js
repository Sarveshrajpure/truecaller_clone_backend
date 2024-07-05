const httpStatus = require("http-status");
const user = require("../db/models/user");
const { ApiError } = require("../middlewares/errorHandlingMiddleware");

const checkUserExists = async (phoneNumber, email) => {
  try {
    let checkUser = await user.findOne({
      where: { phoneNumber: phoneNumber },
      attributes: ["id", "phoneNumber"],
    });
    console.log(checkUser);

    if (checkUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already exists!");
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { checkUserExists };
