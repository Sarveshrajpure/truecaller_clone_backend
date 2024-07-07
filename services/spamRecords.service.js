const httpStatus = require("http-status");
const spamRecord = require("../db/models/spamrecord");

const getspamReport = async (searchContacts) => {
  try {
    for (let i = 0; i < searchContacts.length; i++) {
      let getSpamRecords = await spamRecord.findAndCountAll({
        where: { phoneNumber: searchContacts[i].phoneNumber },
        raw: true,
      });


      searchContacts[i].spamRecordsCount = getSpamRecords.count;
      if (getSpamRecords.count > process.env.FLAG_SPAM_ON_COUNT_OF) {
        searchContacts[i].spamLikeliHood = true;
      } else {
        searchContacts[i].spamLikeliHood = false;
      }

    }
  } catch (err) {
    throw err;
  }
};
module.exports = { getspamReport };
