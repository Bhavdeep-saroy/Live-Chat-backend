import jwt from 'jsonwebtoken';

const secretKey = 'verifyOTPwithJWT';


const generateJWT = (email, otp) => {
    return jwt.sign({ email, otp }, secretKey, { expiresIn: '1h' });
}


const verifyOTPwithJWT = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return null;
    }
}

export { generateJWT, verifyOTPwithJWT };
