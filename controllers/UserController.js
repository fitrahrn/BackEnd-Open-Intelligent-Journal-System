// setelah membuat model, dilanjutkan membuat controller
// source : https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import Contributors from "../models/ContributorsModel.js";
import Article from "../models/ArticleModel.js";
import Journal from "../models/JournalModel.js";
import db from "../config/database.js";
import Role from "../models/RoleModel.js";
export const getUserByUsername = async(req, res) => {
    const username = req.cookies.username;
    try {
        const response = await User.findOne({
            where : {
                username: username
            }
        });
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getUserJournalCount = async(req, res) => {
    try {
        let response = await Journal.findAll({
            include:[{
                model:Article,
                required: true,
                attributes:['article_id','journal_id',],
                include:[{
                    model:Contributors,
                    required: true,
                    attributes:['user_id','article_id'],
                    include:[{
                        model:User,
                        required: true,
                        where : {
                            username: req.params.username
                        },
                        attributes:['name','user_id'],
                    }],
                }],
            }],
            attributes:['journal_id','title']
        });
        response =  JSON.parse(JSON.stringify(response))
        for(let i=0;i<response.length;i++){
           response[i].publishCount = response[i].articles.length
        }
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getUserArticleYearCount = async(req, res) => {
    try {
        let response = await Article.findAll({
            where:{
                workflow_phase:"published"
            },
            include:[{
                model:Contributors,
                required: true,
                attributes:['user_id','article_id'],
                include:[{
                    model:User,
                    required: true,
                    where : {
                        username: req.params.username
                    },
                    attributes:['name','user_id'],
                }],
            }],
            attributes:[[ db.fn('YEAR', db.col('date_published')), 'year'],[db.fn('COUNT', 'Article.year'), 'yearCount'],[db.fn('sum', db.col('cite')), 'citationCount']],
            group: ['year'],

        });
        response =  JSON.parse(JSON.stringify(response))
        if(!response) return res.status(404).json({msg:"User not found"});
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getUserData = async(req, res) => {
    try {
        const response = await User.findOne({
            where : {
                username: req.params.username
            }
        });
        if(!response) return res.status(404).json({msg:"User not found"});
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getUserWithoutItself = async(req, res) => {
    const username = req.cookies.username;
    try {
        const response = await User.findAll({
            where : {
                username :{ [Op.ne]: username } 
            },
            include:[{
                model:Role,
                required: true,
                where : {
                    author: true
                },
            }],
        });
        res.status(200).json(response); 
        
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const findUserByName = async(req, res) => {
    const { name} = req.body;
    try {
        const response = await User.findAll({
            where : {
                name : {
                    [Op.like] : `%${name}%`
                }
            }
        });
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const updateProfile = async (req, res) => {
    const password = req.body.new_password
    const confPassword = req.body.confirm_password
    const username = req.cookies.username;
    const user = await User.findOne({
        where : {
            username : username
        }
    });
    if(!user) return res.status(400).json({msg : "No user found"});
    let hashPassword = user.password; 
    const match = await bcrypt.compare(req.body.current_password, user.password);
    if(password!="" && password ===confPassword){
        if(!match) return res.status(409).json({msg: "Current Password are incorrect"});
        const salt = await bcrypt.genSalt();
        hashPassword = await bcrypt.hash(password, salt);
    }
    let image_path = user.profile_picture
    let fileName = ""
    if(image_path === null&& req.body.image_path === "") {
        try {
            await User.update(req.body, {
                where : {
                    path : req.params.path
                }
            });
            res.status(200).json({msg: "User updated",
                data: req.body
            });
        } catch (error) {
            res.status(500).json({msg: "User failed to update"});
        }
        return ;
    }

    

    else if(req.files === null) {
        const image_path_split = image_path.split("/");
        fileName = image_path_split[image_path_split.length - 1]
    } else {
        const image_path_split = image_path.split("/");
        // user mengupload song baru
        // buat nama file (md5) baru juga
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        const fileName = req.params.path + extension;
        const allowedType = ['.jpg', '.png', '.webp'];
        
        // validasi
        if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid image format"});
        if(fileSize > 1500000) return res.status(422).json({msg : "Size of image must be less than 1 MB"});
        // hapus yang lama
        if(image_path_split[image_path_split.length - 1] != ''){
            const filepath = `./public/profiles/${image_path_split[image_path_split.length - 1]}`;
            fs.unlinkSync(filepath);
        }

        // terima Usernya masukkan ke public
        file.mv(`./public/profiles/${fileName}`, (error) => {
            if (error) return res.status(500).json({ msg: error.message });
        });
        image_path = `${req.protocol}://${req.get("host")}/profiles/${fileName}`;
    }
    // simpan ke database
    
    try {
        await User.update({
            name: req.body.name,
            public_name: req.body.public_name,
            username: user.username,
            email: req.body.email,
            password: hashPassword,
            phone: req.body.phone,
            orcid_id: req.body.orcid_id,
            affliation: req.body.affliation,
            mailing_address: req.body.mailing_address,
            signature: req.body.signature,
            country: req.body.country,
            profile_picture: image_path,

        }, {
            where : {
                path : req.params.path
            }
        });
        res.status(200).json({msg: "User updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "User failed to update"});
    }
}

