const globalstore = require("../db/models/globalstore");

const createGlobalStoreRecord = async (name, phoneNumber, registeredUserId, importedByUserId) => {
  try {
    let record = await globalstore.create({
      name: name,
      phoneNumber: phoneNumber,
      registeredUserId: registeredUserId,
      importedByUserId: importedByUserId,
    });

    return record;
  } catch (err) {
    throw err;
  }
};

module.exports = { createGlobalStoreRecord };
