import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateToken = (id: string | mongoose.Types.ObjectId) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export default generateToken;
