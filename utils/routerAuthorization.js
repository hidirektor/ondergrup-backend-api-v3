const Roles = require('../models/roles');

module.exports = {
  user: {
    GET: {
      Authorize: [Roles.SYSOP, Roles.ENGINEER, Roles.TECHNICIAN, Roles.NORMAL]
    },
    DELETE: {
      Authorize: [Roles.SYSOP]
    },
    PUT: {
      Authorize: [Roles.SYSOP, Roles.ENGINEER]
    },
    POST: {
      Authorize: [Roles.SYSOP, Roles.ENGINEER]
    }
  }
};