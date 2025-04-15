import {  emailSandSchema, userRegisterSchema, userLoginSchema} from "../validation/index.js"



const emailSandValidate = (req, res, next) => {
    const { error, value } = emailSandSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ error: errorMessages });
    }

    req.emailSandValidate = value;
    next();
};
const userRegisterValidate = (req, res, next) => {
    const { error, value } = userRegisterSchema.validate(req.body, { abortEarly: false });
    console.log(req.body);

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ error: errorMessages });
    }

    req.userRegisterValidate = value;
    next();
}
const userLoginValidate = (req, res, next) => {
    const { error, value } = userLoginSchema.validate(req.body, { abortEarly: false });
    console.log(req.body);

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ error: errorMessages });
    }

    req.userLoginValidate = value;
    next();
}

export {  emailSandValidate, userRegisterValidate, userLoginValidate }
