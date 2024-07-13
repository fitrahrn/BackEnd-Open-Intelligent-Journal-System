import request from "supertest";
import app from "../index.js";
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import Journal from "../models/JournalModel.js";
import SequelizeMock from "sequelize-mock";
import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";
import path from "path"
import fs from "fs"
// Setup Sequelize Mock for the Journal model
const DBConnectionMock = new SequelizeMock();
const secretKey = process.env.TOKEN_SECRET; // Replace with your actual secret key
const token = jwt.sign({ username: 'testuser' }, secretKey, { expiresIn: '1m' });
const array_journal=[
        {
            journal_id: 1,
            title: "Journal of ICT Research and Applications",
            initials: "jictra",
            abbreviation: "jictra",
            description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
            path: "jictra",
            image_path:"http://localhost:3001/images/jictra.png",
            languages: "Indonesia",
            appear: 0,
            publisher: "Institute for Research and Community Services, Ins",
            issn: "2337-5787",
            e_issn: "2338-5499",
            reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
        },
        {
            journal_id: 2,
            title: "Journal of ICT Research and Applications",
            initials: "jictra",
            abbreviation: "jictra",
            description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
            path: "jictra",
            image_path:"http://localhost:3001/images/jictra.png",
            languages: "Indonesia",
            appear: 0,
            publisher: "Institute for Research and Community Services, Ins",
            issn: "2337-5787",
            e_issn: "2338-5499",
            reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
            
        }
    ]
const single_journal = {
        journal_id: 1,
        title: "Journal of ICT Research and Applications",
        initials: "jictra",
        abbreviation: "jictra",
        description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
        path: "jictra",
        image_path:"http://localhost:3001/images/jictra.png",
        languages: "Indonesia",
        appear: 0,
        publisher: "Institute for Research and Community Services, Ins",
        issn: "2337-5787",
        e_issn: "2338-5499",
        reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
    }
const single_journal_without_image = {
    journal_id: 1,
    title: "Journal of ICT Research and Applications",
    initials: "jictra",
    abbreviation: "jictra",
    description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
    path: "jictra",
    image_path:"",
    languages: "Indonesia",
    appear: 0,
    publisher: "Institute for Research and Community Services, Ins",
    issn: "2337-5787",
    e_issn: "2338-5499",
    reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
}
const response_journal_without_image = {
    title: "Journal of ICT Research and Applications",
    initials: "jictra",
    abbreviation: "jictra",
    description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
    path: "jictra",
    languages: "Indonesia",
    appear: "0",
    publisher: "Institute for Research and Community Services, Ins",
    issn: "2337-5787",
    e_issn: "2338-5499",
    reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
}
const update_journal = {
    title: "Journal of Engineering and Technological Sciences",
    initials: "jictra",
    abbreviation: "jictra",
    description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
    journal_path: "jictra",
    languages: "Indonesia",
    appear: "0",
    publisher: "Institute for Research and Community Services, Ins",
    issn: "2337-5787",
    e_issn: "2338-5499",
    reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
}
const single_user = {dataValues:{
            user_id: 1,
            name: 'John Doe',
            public_name: 'John Doe',
            username: 'johndoe',
            email: 'test@example.com',
            password: '$2b$10$somethinghashed',
            phone: "08123445678",
            orcid_id: "2189-9178",
            affiliation: "Universitas Gadjah Mada",
            mailing_address: "test@example.com",
            signature: "johndoe",
            country:"United States of America",
            profile_picture: "./profile_picture.jpg"
        }
    }
const array_role=[
    {
        role_id: 1,
        user_id:1,
        journal_id:1,
        administrator: false,
        lead_editor:false,
        reviewer: false,
        author:true,
        reader:true
    },
    {
        role_id: 1,
        user_id:1,
        journal_id:2,
        administrator: false,
        lead_editor:false,
        reviewer: true,
        author:false,
        reader:true
    }
]
const array_role_with_journal=[
    {
        role_id: 1,
        user_id:1,
        journal_id:1,
        administrator: false,
        lead_editor:false,
        reviewer: false,
        author:true,
        reader:true,
        journal:{
            journal_id: 1,
            title: "Journal of ICT Research and Applications",
            initials: "jictra",
            abbreviation: "jictra",
            description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
            path: "jictra",
            image_path:"http://localhost:3001/images/jictra.png",
            languages: "Indonesia",
            appear: 0,
            publisher: "Institute for Research and Community Services, Ins",
            issn: "2337-5787",
            e_issn: "2338-5499",
            reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
        }
    },
    {
        role_id: 1,
        user_id:1,
        journal_id:2,
        administrator: false,
        lead_editor:false,
        reviewer: true,
        author:false,
        reader:true,
        journal:{
            journal_id: 2,
            title: "Journal of ICT Research and Applications",
            initials: "jictra",
            abbreviation: "jictra",
            description: "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",
            path: "jictra",
            image_path:"http://localhost:3001/images/jictra.png",
            languages: "Indonesia",
            appear: 0,
            publisher: "Institute for Research and Community Services, Ins",
            issn: "2337-5787",
            e_issn: "2338-5499",
            reg_number: "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.",
        }
    }
]
describe("Journal Controller", () => {
    describe("GET /journals", () => {
        it("mock all model", () => {
            jest.spyOn(Journal, "findAll").mockResolvedValue(array_journal);
            jest.spyOn(Journal, "findOne").mockResolvedValue(single_journal);
            jest.spyOn(Journal, "create").mockResolvedValue(single_journal);
            jest.spyOn(Journal, "update").mockResolvedValue(update_journal);
            jest.spyOn(Journal, "destroy").mockResolvedValue(1);
            jest.spyOn(User, "findOne").mockResolvedValue(single_user);
            jest.spyOn(Role, "findAll").mockResolvedValue(array_role);
            
        })
        it("should return all journals", async () => {
            Journal.findAll.mockResolvedValue(array_journal);
            const res = await request(app).get("/journals").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(array_journal);
        });

        it("should handle errors", async () => {
            Journal.findAll.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journals").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });


    describe("GET /journal/:path", () => {
        it("should return journal by path", async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            const res = await request(app).get("/journal/jictra").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(single_journal);
        });
        it("should return 404 if not found", async () => {
            Journal.findOne.mockRejectedValue(null);
            const res = await request(app).get("/journals/jmfs").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(404);
        });
        it("should handle errors", async () => {
            Journal.findOne.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journal/jmfs").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });

    describe("GET /journal cookies username=johndoe", () => {
        it("should return journals by user", async () => {
            User.findOne.mockResolvedValue(single_user);
            Role.findAll.mockResolvedValue(array_role_with_journal);

            const res = await request(app).get("/journal").set("Cookie", "username=johndoe").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(array_role_with_journal);
        });

        it("should handle errors", async () => {
            User.findOne.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journals").set("Cookie", "username=testuser").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });

    describe("POST /journal", () => {
        it("should create a new journal", async () => {
            Journal.findOne.mockResolvedValue(null);
            Journal.create.mockResolvedValue(single_journal);

            const res = await request(app).post("/journal").set('Authorization', `Bearer ${token}`)
            .field('title', "Journal of ICT Research and Applications")
            .field('initials', "jictra",)
            .field('abbreviation', "jictra")
            .field('description', "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",)
            .field('journal_path', "jictra")
            .field('languages', "Indonesia")
            .field('appear', 0)
            .field('publisher', "Institute for Research and Community Services, Ins")
            .field('issn', "2337-5787")
            .field('e_issn', "2338-5499")
            .field('reg_number', "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.")
            .attach('file',path.resolve('./public/images/jictra.png'));
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                msg: "Journal Created Successfully",
                data:response_journal_without_image

            });
        });

        it("should handle validation errors", async () => {
            const res = await request(app).post("/journal").set('Authorization', `Bearer ${token}`).send({});
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "All input is required"
            }));
        });

        it("should handle existing journal errors", async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            const res = await request(app).post("/journal").set('Authorization', `Bearer ${token}`)
            .field('title', "Journal of ICT Research and Applications")
            .field('initials', "jictra",)
            .field('abbreviation', "jictra")
            .field('description', "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",)
            .field('journal_path', "jictra")
            .field('languages', "Indonesia")
            .field('appear', 0)
            .field('publisher', "Institute for Research and Community Services, Ins")
            .field('issn', "2337-5787")
            .field('e_issn', "2338-5499")
            .field('reg_number', "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.")
            .attach('image',path.resolve('./public/images/jictra.png'));
            expect(res.statusCode).toEqual(409);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal already exist"
            }));
        });
        it("should handle existing database errors", async () => {
            Journal.findOne.mockResolvedValue(null);
            Journal.create.mockRejectedValue(new Error('Something went wrong'));
            const res = await request(app).post("/journal").set('Authorization', `Bearer ${token}`)
            .field('title', "Journal of ICT Research and Applications")
            .field('initials', "jictra",)
            .field('abbreviation', "jictra")
            .field('description', "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",)
            .field('journal_path', "jictra")
            .field('languages', "Indonesia")
            .field('appear', 0)
            .field('publisher', "Institute for Research and Community Services, Ins")
            .field('issn', "2337-5787")
            .field('e_issn', "2338-5499")
            .field('reg_number', "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.")
            .attach('file',path.resolve('./public/images/jictra.png'));
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal failed to create"
            }));
        });
    });

    describe("PATCH /journal/:path", () => {
        it("should update an existing journal with cover image", async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            Journal.update.mockResolvedValue(update_journal);

            const res = await request(app).patch("/journal/jictra").set('Authorization', `Bearer ${token}`)
            .field('title', "Journal of Engineering and Technological Sciences")
            .field('initials', "jictra",)
            .field('abbreviation', "jictra")
            .field('description', "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",)
            .field('journal_path', "jictra")
            .field('languages', "Indonesia")
            .field('appear', 0)
            .field('publisher', "Institute for Research and Community Services, Ins")
            .field('issn', "2337-5787")
            .field('e_issn', "2338-5499")
            .field('reg_number', "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.")
            .attach('file',path.resolve('./public/images/jictra.png'));;
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(Object({
                msg: "Journal updated",
                data: update_journal
                
            }));
        });

        it("should update an existing journal without cover image", async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            Journal.update.mockResolvedValue(update_journal);

            const res = await request(app).patch("/journal/jictra").set('Authorization', `Bearer ${token}`)
            .field('title', "Journal of Engineering and Technological Sciences")
            .field('initials', "jictra",)
            .field('abbreviation', "jictra")
            .field('description', "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",)
            .field('journal_path', "jictra")
            .field('languages', "Indonesia")
            .field('appear', 0)
            .field('publisher', "Institute for Research and Community Services, Ins")
            .field('issn', "2337-5787")
            .field('e_issn', "2338-5499")
            .field('reg_number', "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.")
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(Object({
                msg: "Journal updated",
                data: update_journal
                
            }));
        });

        it("should handle journal not found", async () => {
            Journal.findOne.mockResolvedValue(null);
            const res = await request(app).patch("/journal/jmfs").set('Authorization', `Bearer ${token}`).send({
                title: "Updated Journal",
                description: "This is an updated journal.",
                journal_path: "sample-journal",
                languages: "English",
                appear: true
            });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "No Journal Found"
            }));
        });
        it("should handle errors", async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            Journal.update.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).patch("/journal/jictra").set('Authorization', `Bearer ${token}`)
            .field('title', "Journal of Engineering and Technological Sciences")
            .field('initials', "jictra",)
            .field('abbreviation', "jictra")
            .field('description', "Journal of ICT Research and Applications welcomes full research articles in the area of Information and Communication Technology from the following subject areas: Information Theory, Signal Processing, Electronics, Computer Network, Telecommunication, Wireless & Mobile Computing, Internet Technology, Multimedia, Software Engineering, Computer Science, Information System and Knowledge Management. Abstracts and articles published on Journal of ICT Research and Applications are available online at ITB Journal and indexed by Scopus, Google Scholar, Directory of Open Access Journals, Electronic Library University of Regensburg, EBSCO Open Science Directory, International Association for Media and Communication Research (IAMCR), MIAR: Information Matrix for the Analysis of Journals Universitat de Barcelona, Cabells Directories, Zurich Open Repository and Archive Journal Database, Open Academic Journals Index, Indonesian Publication Index and ISJD-Indonesian Institute of Sciences. The journal is under reviewed by Compendex, Engineering Village.",)
            .field('journal_path', "jictra")
            .field('languages', "Indonesia")
            .field('appear', 0)
            .field('publisher', "Institute for Research and Community Services, Ins")
            .field('issn', "2337-5787")
            .field('e_issn', "2338-5499")
            .field('reg_number', "Reg. No. 691-SIC-UPPGT-SIT-1963, Accreditation No.")
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal failed to update"
            }));
        });
    });

    describe("DELETE /journal/:path", () => {
        it("should delete an existing journal", async () => {
            Journal.findOne.mockResolvedValue(single_journal_without_image);
            Journal.destroy.mockResolvedValue(1);

            const res = await request(app).delete("/journal/jictra").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal Deleted Successfully"
            }));
        });

        it("should handle not found", async () => {
            Journal.findOne.mockResolvedValue(null);
            const res = await request(app).delete("/journal/jmfs").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "No Journal Found"
            }));
        });
        it("should handle error", async () => {
            Journal.findOne.mockResolvedValue(single_journal_without_image);
            Journal.destroy.mockRejectedValue(new Error("Database Error"))
            const res = await request(app).delete("/journal/jictra").set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });
});
