const httpStatus = require("http-status");
const globalstore = require("../db/models/globalstore");
const { importUserContactsSchema } = require("../validations/globalStore.validations");
const sequelize = require("../config/database");

const globalStoreController = {
  async importUserContacts(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let userId = req.authenticated.id;
      let values = await importUserContactsSchema.validateAsync(req.body);

      values.contacts.forEach((element) => {
        element.importedByUserId = userId;
      });

      let contacts = values.contacts;
      let createdRecords = [];

      for (let i = 0; i < contacts.length; i++) {
        let [data, created] = await globalstore.findOrCreate({
          where: { phoneNumber: contacts[i].phoneNumber, importedByUserId: userId },
          defaults: {
            name: contacts[i].name,
            phoneNumber: contacts[i].phoneNumber,
            importedByUserId: userId,
          },
          transaction: t,
        });
        createdRecords.push({ phoneNumber: contacts[i].phoneNumber, inserted: created });
      }

      await t.commit();
      res.status(httpStatus.OK).send(createdRecords);
    } catch (err) {
      await t.rollback();
      console.log(err);
      next(err);
    }
  },
};

module.exports = globalStoreController;
