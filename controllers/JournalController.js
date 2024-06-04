import Journal from "../models/JournalModel.js"
import path from "path"
import fs from "fs"

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
    const { title,initials, abbreviation, description,journal_path, languages,appear, publisher,issn,e_issn,reg_number} = req.body;
    if (!(title && description && journal_path && languages&& (appear !=null))) return res.status(400).json({msg: "All input is required"});
    const checkTitle = await Journal.findOne({
        where: {
            title: title
        }
    });
    if (checkTitle) return res.status(409).json({msg: "Journal already exist"});
    const checkPath = await Journal.findOne({
        where: {
            path: journal_path
        }
    });
    
    if (checkPath) return res.status(409).json({msg: "Journal path already exist, please create new path!"});
    if (req.files != null) {
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        const fileName = journal_path + extension;
        const file_path = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.jpg', '.png', '.webp'];
        
        if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid image format"});
        if(fileSize > 1500000) return res.status(422).json({msg : "Size of image must be less than 1 MB"});
        file.mv(`./public/images/${fileName}`, async (error) => {
            if (error) return res.status(500).json({ msg: error.message });
            try {
              await Journal.create({
                title: title,
                initials: initials,
                abbreviation: abbreviation,
                description: description,
                path: journal_path,
                image_path:file_path,
                languages: languages,
                appear: appear,
                publisher: publisher,
                issn: issn,
                e_issn: e_issn,
                reg_number: reg_number,
                
            });
              res.status(201).json({ msg: "Jurnal Created Successfully" });
            } catch (error) {
              res.status(500).json(error.message);
            }
        });
        return ;
    }
    try {
        await Journal.create({
            title: title,
            initials: initials,
            abbreviation: abbreviation,
            description: description,
            path: journal_path,
            image_path: "",
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
                path: journal_path,
                image_path: "",
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
    const journal = await Journal.findOne({
        where : {
            path : req.params.path
        }
    });
    if(!journal) return res.status(404).json({msg : "No Song Found"});
    let image_path = journal.image_path
    const image_path_split = image_path.split("/");
    if(image_path === ""&& req.body.image_path === "") {
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
        return ;
    }

    let fileName = ""

    if(req.files === null) {
        fileName = image_path_split[image_path_split.length - 1]
    } else {
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
        console.log(image_path_split)
        // hapus yang lama
        if(image_path_split[image_path_split.length - 1] != ''){
            const filepath = `./public/images/${image_path_split[image_path_split.length - 1]}`;
            fs.unlinkSync(filepath);
        }

        // terima jurnalnya masukkan ke public
        file.mv(`./public/images/${fileName}`, (error) => {
            if (error) return res.status(500).json({ msg: error.message });
        });
        image_path = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }
    // simpan ke database
    
    try {
        await Journal.update({
            title: req.body.title,
            initials: req.body.initials,
            abbreviation: req.body.abbreviation,
            description: req.body.description,
            path: req.body.path,
            image_path: image_path,
            languages: req.body.languages,
            appear: req.body.appear,
            publisher: req.body.publisher,
            issn: req.body.issn,
            e_issn: req.body.e_issn,
            reg_number: req.body.reg_number,
            
        }, {
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
        let image_path = getJournals.image_path
        if(image_path != ""){
            const image_path_split = image_path.split("/");
            let fileName = image_path_split[image_path_split.length - 1]
            const filepath = `./public/images/${fileName}`;
            fs.unlinkSync(filepath);
        }
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