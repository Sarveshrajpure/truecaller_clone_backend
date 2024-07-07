const globalstore = require("../db/models/globalstore");

const createGlobalStoreRecord = async (
  name,
  phoneNumber,
  registeredUserId,
  importedByUserId,
  transaction
) => {
  try {
    let record = await globalstore.create(
      {
        name: name,
        phoneNumber: phoneNumber,
        registeredUserId: registeredUserId,
        importedByUserId: importedByUserId,
      },
      { transaction }
    );

    return record;
  } catch (err) {
    throw err;
  }
};

module.exports = { createGlobalStoreRecord };
