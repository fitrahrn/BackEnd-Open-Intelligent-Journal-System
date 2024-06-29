import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import Journal from "../models/JournalModel.js";
import SequelizeMock from "sequelize-mock";
import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";

// Setup Sequelize Mock for the Journal model
const DBConnectionMock = new SequelizeMock();


describe("Journal Controller", () => {
    describe("getJournals", () => {
        it("mock findAll", () => {
            jest.spyOn(Journal, "findAll").mockResolvedValue([{
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
        ]);
        })
        it("should return all journals", async () => {
            Journal.findAll.mockResolvedValue([{
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
                
            }]);
            const res = await request(app).get("/journals");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([{
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
                    
                }]);
        });

        it("should handle errors", async () => {
            Journal.findAll.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journals");
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });

    describe("getJournalsById", () => {
        it("should return journal by id", async () => {
            Journal.findOne.mockResolvedValue(JournalMock.build());
            const res = await request(app).get("/journals/1");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                title: "Sample Journal"
            }));
        });

        it("should handle errors", async () => {
            Journal.findOne.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journals/1");
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });

    describe("getJournalsByPath", () => {
        it("should return journal by path", async () => {
            Journal.findOne.mockResolvedValue(JournalMock.build());
            const res = await request(app).get("/journals/path/sample-journal");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                title: "Sample Journal"
            }));
        });

        it("should handle errors", async () => {
            Journal.findOne.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journals/path/sample-journal");
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });

    describe("getJournalsByUser", () => {
        it("should return journals by user", async () => {
            User.findOne.mockResolvedValue({ dataValues: { user_id: 1 } });
            Role.findAll.mockResolvedValue([{
                journal: JournalMock.build()
            }]);

            const res = await request(app).get("/journals/user").set("Cookie", "username=testuser");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([expect.objectContaining({
                journal: expect.objectContaining({
                    title: "Sample Journal"
                })
            })]);
        });

        it("should handle errors", async () => {
            User.findOne.mockRejectedValue(new Error("Database Error"));
            const res = await request(app).get("/journals/user").set("Cookie", "username=testuser");
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual("Database Error");
        });
    });

    describe("createJournal", () => {
        it("should create a new journal", async () => {
            Journal.findOne.mockResolvedValue(null);
            Journal.create.mockResolvedValue(JournalMock.build());

            const res = await request(app).post("/journals").send({
                title: "New Journal",
                description: "This is a new journal.",
                journal_path: "new-journal",
                languages: "English",
                appear: true
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal created successfully"
            }));
        });

        it("should handle validation errors", async () => {
            const res = await request(app).post("/journals").send({});
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "All input is required"
            }));
        });

        it("should handle existing journal errors", async () => {
            Journal.findOne.mockResolvedValue(JournalMock.build());
            const res = await request(app).post("/journals").send({
                title: "Sample Journal",
                description: "This is a new journal.",
                journal_path: "new-journal",
                languages: "English",
                appear: true
            });
            expect(res.statusCode).toEqual(409);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal already exist"
            }));
        });
    });

    describe("updateJournal", () => {
        it("should update an existing journal", async () => {
            Journal.findOne.mockResolvedValue(JournalMock.build());
            Journal.update.mockResolvedValue([1]);

            const res = await request(app).put("/journals/sample-journal").send({
                title: "Updated Journal",
                description: "This is an updated journal.",
                journal_path: "sample-journal",
                languages: "English",
                appear: true
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal updated"
            }));
        });

        it("should handle errors", async () => {
            Journal.findOne.mockResolvedValue(null);
            const res = await request(app).put("/journals/nonexistent-journal").send({
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
    });

    describe("deleteJournal", () => {
        it("should delete an existing journal", async () => {
            Journal.findOne.mockResolvedValue(JournalMock.build());
            Journal.destroy.mockResolvedValue(1);

            const res = await request(app).delete("/journals/sample-journal");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "Journal Deleted Successfully"
            }));
        });

        it("should handle errors", async () => {
            Journal.findOne.mockResolvedValue(null);
            const res = await request(app).delete("/journals/nonexistent-journal");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({
                msg: "No Journal Found"
            }));
        });
    });
});
