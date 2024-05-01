import Journal from "../models/JournalModel.js"


export const getJournals = async(req, res) => {
    try {
        const response = await Journal.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getJournalsById = async(req, res) => {
    try {
        const response = await Journal.findOne({
            where : {
                journal_id : req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getJournalsByPath = async(req, res) => {
    try {
        const response = await Journal.findOne({
            where : {
                path : req.params.path
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}