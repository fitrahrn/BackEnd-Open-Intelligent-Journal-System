import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const email = req.cookies.email;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.findOne({
            where:{
                email: email
            }
        });
        if(!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user.id;
            const name = user.name;
            const email = user.email;
            const username = user.username;
            const accessToken = jwt.sign({userId, name, email,username}, "f3m8r2y7y847nrm9843n6xc94cm83x4mo437",{
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}