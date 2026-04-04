import jwt from "jsonwebtoken";

const generateTokenAndSetcookie = (userId, res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks
        secure: true, // required for SameSite=None in modern browsers
        sameSite: "none", // allow cross-site cookie sharing between localhost ports
    });
    return token;
};

export default generateTokenAndSetcookie;