const httpStatus = require("http-status");
const globalstore = require("../db/models/globalstore");
const spamRecord = require("../db/models/spamrecord");
const {
  importUserContactsSchema,
  searchByNameSchema,
  searchByPhoneNumberSchema,
  getSearchResultDetailsSchema,
} = require("../validations/globalStore.validations");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const services = require("../services");
const user = require("../db/models/user");

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
  async searchByName(req, res, next) {
    try {
      let values = await searchByNameSchema.validateAsync({ name: req.query.name });

      let searchString = values.name.toLowerCase();

      let searchContacts = await globalstore.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchString}%`, // Matches entries that contain 'contains' anywhere
          },
        },
        order: [
          [
            sequelize.literal(`CASE WHEN LOWER(name) LIKE '${searchString}%' THEN 0 ELSE 1 END`),
            "ASC",
          ],
          [sequelize.literal(`LOWER(name)`), "ASC"],
        ],
        attributes: ["name", "phoneNumber"],
        raw: true,
      });

      if (searchContacts.length > 0) {
        await services.spamRecordService.getspamReport(searchContacts);
      }

      res.status(httpStatus.OK).send(searchContacts);
    } catch (err) {
      next(err);
    }
  },

  async searchByPhoneNumber(req, res, next) {
    try {
      let values = await searchByPhoneNumberSchema.validateAsync({
        phoneNumber: req.query.phoneNumber,
      });

      let searchString = values.phoneNumber;

      let searchContacts = "";

      let contacts = await globalstore.findAll({
        where: {
          phoneNumber: {
            [Op.like]: `%${searchString}%`, // Matches entries that contain 'contains' anywhere
          },
        },
        attributes: ["name", "phoneNumber", "registeredUserId"],
        raw: true,
      });

      let registeredContacts = contacts.filter((element) => element.registeredUserId !== null);

      if (registeredContacts.length > 0) {
        searchContacts = registeredContacts;

        await services.spamRecordService.getspamReport(searchContacts);
      } else {
        console.log("in else");
        searchContacts = contacts;

        console.log(searchContacts);
        await services.spamRecordService.getspamReport(searchContacts);
      }

      res.status(httpStatus.OK).send(searchContacts);
    } catch (err) {
      next(err);
    }
  },
  async getSearchResultDetails(req, res, next) {
    try {
      let values = await getSearchResultDetailsSchema.validateAsync({
        phoneNumber: req.query.phoneNumber,
      });

      let result = {};

      let userId = req.authenticated.id;

      let details = await globalstore.findOne({
        where: { phoneNumber: values.phoneNumber },
        attributes: ["phoneNumber", "name", "registeredUserId", "importedByUserId"],
        include: [{ model: user, attributes: ["email"] }],
        raw: true,
        nest: true,
      });

      if (details !== null) {
        if (details.importedByUserId === userId) {
          result.name = details.name;
          result.phoneNumber = details.phoneNumber;
          result.email = details.user.email;
          result.registeredUserId = details.registeredUserId;
          result.importedByUserId = details.importedByUserId;
        } else {
          result.name = details.name;
          result.phoneNumber = details.phoneNumber;
          result.registeredUserId = details.registeredUserId;
          result.importedByUserId = details.importedByUserId;
        }
      } else {
        result.message = "Phone number not found";
      }

      res.status(httpStatus.OK).send(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = globalStoreController;
