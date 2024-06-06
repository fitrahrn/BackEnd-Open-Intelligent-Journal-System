import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name,public_name, username, email, password, confPassword,phone, orcid_id, affiliation, mailing_address,signature,country } = req.body;
    if (!(name && username && email && password && confPassword)) return res.status(400).json({msg: "All input is required"});
    if (password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password don't match"});

    const oldUser = await User.findOne({
        where: {
            email: email
        }
    });
    if (oldUser) return res.status(409).json({msg: "User already exists"});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            name: name,
            public_name: public_name,
            username: username,
            email: email,
            password: hashPassword,
            phone: phone,
            orcid_id: orcid_id,
            affiliation: affiliation,
            mailing_address: mailing_address,
            signature:signature,
            country:country,
        });
        res.status(200).json({msg: "Registration Successful"});
    } catch (error) {
        res.status(500).json({msg: "Registration failed"});
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const user_id = user.user_id;
        const name = user.name;
        const email = user.email;
        const username= user.username;
        const accessToken = jwt.sign({user_id, name, email, username}, process.env.TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({user_id, name, email, username}, process.env.REFRESH_TOKEN,{
            expiresIn: '1d'
        });
        res.cookie('username', username,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(404).json({msg: "Login failed"});
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const username = req.cookies.username;
    if(!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({
        where:{
            username: username
        }
    });
    if(!user) return res.sendStatus(204);

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const getUsers = async(req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}