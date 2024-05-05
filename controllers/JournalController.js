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

export const createJournal = async (req, res) => {
    const { title,initials, abbreviation, description,path, image_path, languages,appear, publisher,issn,e_issn,reg_number} = req.body;
    if (!(title && description && path && languages&& (appear !=null))) return res.status(400).json({msg: "All input is required"});

    const checkTitle = await Journal.findOne({
        where: {
            title: title
        }
    });
    if (checkTitle) return res.status(409).json({msg: "Journal already exist"});

    const checkPath = await Journal.findOne({
        where: {
            path: path
        }
    });
    if (checkPath) return res.status(409).json({msg: "Journal path already exist, please create new path!"});
    
    try {
        await Journal.create({
            title: title,
            initials: initials,
            abbreviation: abbreviation,
            description: description,
            path: path,
            image_path: image_path,
            languages: languages,
            appear: appear,
            publisher: publisher,
            issn: issn,
            e_issn: e_issn,
            reg_number: reg_number,
            
        });
        res.status(200).json({msg: "Jurnal created successfully",
            data: {
                title: title,
                initials: initials,
                abbreviation: abbreviation,
                description: description,
                path: path,
                image_path: image_path,
                languages: languages,
                appear: appear,
                publisher: publisher,
                issn: issn,
                e_issn: e_issn,
                reg_number: reg_number,
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Jurnal failed to create"});
    }
}

export const updateJournal = async (req, res) => {
    try {
        await Journal.update(req.body, {
            where : {
                path : req.params.path
            }
        });
        res.status(200).json({msg: "Jurnal updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Jurnal failed to update"});
    }
}

export const deleteJournal = async(req, res) => {
    const journal = await Journal.findOne({
        where : {
            path: req.params.path
        }
    });
    if(!journal) return res.status(404).json({msg : "No Journal Found"});
    try {
        await Journal.destroy({
            where : {
                path : req.params.path
            }
        });
        res.status(200).json({msg : "Journal Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
}