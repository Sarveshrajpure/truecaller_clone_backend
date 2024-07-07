const httpStatus = require("http-status");
const spamRecord = require("../db/models/spamrecord");
const sequelize = require("../config/database");
const { addSpamRecordSchema } = require("../validations/spamRecord.validations");
const globalstore = require("../db/models/globalstore");

const spamRecordController = {
  async addSpamRecord(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let userId = req.authenticated.id;

      let values = await addSpamRecordSchema.validateAsync(req.body);

      let spamRecordToBeAdded = {};

      let contactExists = await globalstore.findOne({
        where: { phoneNumber: values.phoneNumber },
        attributes: ["name", "phoneNumber", "registeredUserId"],
      });

      if (contactExists !== null) {
        let contact = contactExists.toJSON();

        spamRecordToBeAdded.name = contact.name;
        spamRecordToBeAdded.phoneNumber = contact.phoneNumber;
        spamRecordToBeAdded.reportedByUserId = userId;
        spamRecordToBeAdded.registeredUserId = contact.registeredUserId
          ? contact.registeredUserId
          : null;
      } else {
        spamRecordToBeAdded.phoneNumber = values.phoneNumber;
        spamRecordToBeAdded.reportedByUserId = userId;
      }
      let result = {};
      let [data, created] = "";
      // Added check to ensure a registered user does not report himself as spam
      if (spamRecordToBeAdded.registeredUserId !== userId) {
        [data, created] = await spamRecord.findOrCreate({
          where: {
            phoneNumber: spamRecordToBeAdded.phoneNumber,
            reportedByUserId: spamRecordToBeAdded.reportedByUserId,
          },
          defaults: spamRecordToBeAdded,
          transaction: t,
        });
      }
      // adding number to global store if it does not exist
      if (contactExists === null) {
        let [data, created] = await globalstore.findOrCreate({
          where: {
            phoneNumber: spamRecordToBeAdded.phoneNumber,
            importedByUserId: spamRecordToBeAdded.reportedByUserId,
          },
          defaults: {
            phoneNumber: spamRecordToBeAdded.phoneNumber,
            importedByUserId: spamRecordToBeAdded.reportedByUserId,
          },
          transaction: t,
        });
        result.recordAdedInGlobalStore = data;
      }

      (result.record = data ? data : { phoneNumber: values.phoneNumber }),
        (result.recordAdded = created ? created : false),
        await t.commit();

      res.status(httpStatus.OK).send(result);
    } catch (err) {
      console.log(err);
      await t.rollback();
      next(err);
    }
  },
};

module.exports = spamRecordController;
