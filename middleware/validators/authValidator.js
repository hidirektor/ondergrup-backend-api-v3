const joi = require('joi');
const HttpStatusCode = require('http-status-codes');

class AuthValidator {
  constructor() {}

  static async login(req, res, next) {
    try {
      await joi
        .object({
          userName: joi.string().max(100).required(),
          password: joi.string().max(99).required()
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }

  static async delete(req, res, next) {
    try {
      await joi
        .object({
          password: joi.string().max(99).required()
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }

  static async update(req, res, next) {
    try {
      await joi
        .object({
          userName: joi.string().max(100).required(),
          nameSurname: joi
            .string()
            .max(100)
            .pattern(new RegExp('^[A-Za-zÇçÖöŞşÜüĞğİı ]+$'))
            .required(),
          email: joi.string().email().max(100).required(),
          phoneNumber: joi.string().min(10).max(15).required(),
          companyName: joi.string().max(100),
          password: joi.string().max(99).required(),
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }

  static async signUp(req, res, next) {
    try {
      await joi
        .object({
          userName: joi.string().max(100).required(),
          nameSurname: joi
            .string()
            .max(100)
            .pattern(new RegExp('^[A-Za-zÇçÖöŞşÜüĞğİı ]+$'))
            .required(),
          eMail: joi.string().email().max(100).required(),
          phoneNumber: joi.string().min(10).max(15).required(),
          companyName: joi.string().max(100).required(),
          password: joi.string().max(99).required(),
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const schema = joi.object({
        userName: joi.string().max(100).required(),
        oldPassword: joi.string().max(99).required(),
        newPassword: joi.string().max(99).required()
      });

      await schema.validateAsync(req.body);

      const user = await db.User.findOne({ where: { userName: req.body.userName } });
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).send('User not found');
      }

      const isSamePassword = await bcrypt.compare(req.body.newPassword, user.password);
      if (isSamePassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).send('New password cannot be the same as the old password');
      }

      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }
}

module.exports = AuthValidator;