import Joi from "joi"

const registerSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
const emailSandSchema = Joi.object().keys({
    email: Joi.string().email().required()
});

const userRegisterSchema = Joi.object().keys({
    otp: Joi.number()
        .integer()
        .min(100000)
        .max(999999)
        .required()
        .messages({
            'number.base': 'OTP must be a number',
            'number.integer': 'OTP must be an integer',
            'number.min': 'OTP must be at least 6 digits long',
            'number.max': 'OTP must be at most 6 digits long',
            'any.required': 'OTP is required'
        }),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required()

});
const userLoginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export { registerSchema, emailSandSchema, userRegisterSchema, userLoginSchema }