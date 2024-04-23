// setelah membuat model, dilanjutkan membuat controller
// source : https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
import User from "../models/UserModel.js";

export const getUserId = async(req, res) => {
    try {
        const response = await User.findOne({
            where : {
                email: req.params.id
            }
        });
        res.status(200).json(response["user_id"]); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
