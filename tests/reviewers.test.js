import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import path from 'path';
import fs from 'fs';
import Reviewers from '../models/ReviewersModel';
import User from '../models/UserModel';
import Reviews from '../models/ReviewsModel';
import Article from '../models/ArticleModel';
import Journal from '../models/JournalModel';
import ReviewersFile from '../models/ReviewersFileModel';
import jwt from 'jsonwebtoken';

const array_user=[{
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
    },
    {
        user_id: 2,
        name: 'John Dee',
        public_name: 'John Dee',
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
]
const array_article= [
    {
        article_id: 1,
        journal_id: 1,
        issue_id:1,
        prefix:"improving",
        title: "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing",
        subtitle: "Data Preprocessing",
        abstract:"Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",
        article_path:"http://localhost:3001/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf",
        comment:"",
        keywords:"Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech",
        workflow_phase:"published",
        status:"accepted"
    
    },
    {
        article_id: 2,
        journal_id: 1,
        issue_id:2,
        prefix:"improving",
        title: "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing",
        subtitle: "Data Preprocessing",
        abstract:"Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",
        article_path:"http://localhost:3001/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf",
        comment:"",
        keywords:"Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech",
        workflow_phase:"reviewing",
        status:"reviewers assigned"
    
    }
]
const array_reviews=[
    {
        reviewers_id:1,
        article_id:1,
        review_rounds:1,
        article_file_path:"http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
        article:array_article[0],
    },
    {
        reviews_id:1,
        article_id:1,
        review_rounds:1,
        article_file_path:"http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf"
        
    },
    {
        reviews_id:1,
        article_id:1,
        review_rounds:2,
        article_file_path:"http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf"

    },
    
]
const array_reviewers=[{
    reviewers_id:1,
    reviews_id:1,
    user_id:1,
    editor_review:null,
    author_review:null,
    recommendation:null,
    date_assigned:Date(2024,6,17),
    date_completed:null,
    date_due:Date(2024,6,30),
    review:array_reviews[0],
},
{   
    reviewers_id:2,
    reviews_id:1,
    user_id:2,
    editor_review:"Check for spelling error",
    author_review:"Need revisions but its already good",
    recommendation:"revisions required",
    date_assigned:Date(2024,6,17),
    date_completed:Date(2024,6,19),
    date_due:Date(2024,6,30),
    user:array_user[0]
},
{
    reviews_id:1,
    user_id:1,
    editor_review:null,
    author_review:null,
    recommendation:null,
    date_assigned:Date(2024,6,17),
    date_completed:null,
    date_due:Date(2024,6,30),
},
{
    reviewers_id:1,
    reviews_id:1,
    user_id:1,
    editor_review:null,
    author_review:null,
    recommendation:null,
    date_assigned:Date(2024,6,17),
    date_completed:null,
    date_due:Date(2024,6,30),
},
]
const update_reviewers={   
    reviewers_id:"1",
    editor_review:"Check for spelling error",
    author_review:"Need revisions but its already good",
    recommendation:"revisions required",
    date_completed: Date(2024,6,19),
}
const single_journal={
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

const response_reviewers=[{
    reviewers_id:1,
    reviews_id:1,
    user_id:1,
    editor_review:null,
    author_review:null,
    recommendation:null,
    date_assigned:Date(2024,6,17),
    date_completed:null,
    date_due:Date(2024,6,30),
    review:array_reviews[0],
    journal_title:single_journal.title
}]
const reviewers_file={
    reviewers_id:1,
    reviewers_file:"http://localhost:3001/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf"
}
const DBConnectionMock = new SequelizeMock();
const secretKey = process.env.TOKEN_SECRET; // Replace with your actual secret key
const token = jwt.sign({ username: 'johndoe' }, secretKey, { expiresIn: '1m' });
describe('Reviewers Controller', () => {

    describe('GET /reviewers/review', () => {
        it("mock all model", () => {
            jest.spyOn(Reviewers, "findAll").mockResolvedValue(array_reviewers);
            jest.spyOn(Reviewers, "findOne").mockResolvedValue(array_reviewers[0]);
            jest.spyOn(Reviewers, "create").mockResolvedValue(array_reviewers[0]);
            jest.spyOn(Reviewers, "update").mockResolvedValue(array_reviewers[0]);
            jest.spyOn(Reviewers, "destroy").mockResolvedValue(1);
            jest.spyOn(Article, "findAll").mockResolvedValue(array_article);
            jest.spyOn(Article, "findOne").mockResolvedValue(array_article[0]);
            jest.spyOn(Journal, "findOne").mockResolvedValue(single_journal);
            jest.spyOn(User, "findAll").mockResolvedValue(array_user);
            jest.spyOn(User, "findOne").mockResolvedValue(array_user[0]);
            jest.spyOn(ReviewersFile, "create").mockResolvedValue(reviewers_file);
            
        })
        it('should return all reviews for the reviewers', async () => {
            User.findOne.mockResolvedValue(array_user[0]);
            Reviewers.findAll.mockResolvedValue([array_reviewers[0]]);
            Journal.findOne.mockResolvedValue(single_journal);

            const response = await request(app).get('/reviewers/review').set('Cookie', ['username=johndoe']).set('Authorization', `Bearer ${token}`);;

            expect(response.status).toBe(200);
            expect(response.body).toEqual(response_reviewers);
        });

        it('should return 500 if there is an error', async () => {
            Reviewers.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/reviewers/review').set('Cookie', ['username=johndoe']).set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /reviewers/:id', () => {
        it('should return reviewers for a given review ID', async () => {
            Reviewers.findAll.mockResolvedValue([array_reviewers]);

            const response = await request(app).get('/reviewers/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([array_reviewers]);
        });

        it('should return 500 if there is an error', async () => {
            Reviewers.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/reviewers/1').set('Authorization', `Bearer ${token}`);;

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /reviewers/user/:id', () => {
        it('should return a reviewer for a given review ID and logged-in user', async () => {
            User.findOne.mockResolvedValue(array_user[0]);
            Reviewers.findOne.mockResolvedValue(array_reviewers[2]);

            const response = await request(app).get('/reviewers/user/1').set('Cookie', ['username=johndoe']).set('Authorization', `Bearer ${token}`);;

            expect(response.status).toBe(200);
            expect(response.body).toEqual(array_reviewers[2]);
        });

        it('should return 500 if there is an error', async () => {
            User.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/reviewers/user/1').set('Cookie', ['username=johndoe']).set('Authorization', `Bearer ${token}`);;

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /reviewers', () => {
        it('should add a new reviewer', async () => {
            Reviewers.create.mockResolvedValue(array_reviewers[2]);

            const response = await request(app)
                .post('/reviewers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    reviews_id: 1,
                    user_id: 1,
                    date_assigned: Date(2024,6,17),
                    date_due: Date(2024,6,24),
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                msg:"New reviewers added successfully",
                data:array_reviewers[2]});
        });

        it('should return 500 if there is an error', async () => {
            Reviewers.create.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/reviewers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    reviews_id: 1,
                    user_id: 1,
                    date_assigned: Date(2024,6,17),
                    date_due: Date(2024,6,24),
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Reviewers failed to add');
        });
    });

    describe('PATCH /reviewers/:id', () => {
        it('should update a reviewer with a file', async () => {
            Reviewers.findOne.mockResolvedValue(array_reviewers[2]);
            Reviewers.update.mockResolvedValue(update_reviewers);
            ReviewersFile.create.mockResolvedValue(reviewers_file);
            const response = await request(app)
                .patch('/reviewers')
                .set('Authorization', `Bearer ${token}`)
                .field('reviewers_id', 1)
                .field('editor_review', "Check for spelling error")
                .field('author_review', "Need revisions but its already good")
                .field('recommendation', "revisions required")
                .field('date_completed', Date(2024,6,19))
                .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                msg:"Reviewers updated",
                data:update_reviewers});
        });
        it('should update a reviewer without a file', async () => {
            Reviewers.findOne.mockResolvedValue(array_reviewers[2]);
            Reviewers.update.mockResolvedValue(update_reviewers);
            const response = await request(app)
                .patch('/reviewers')
                .set('Authorization', `Bearer ${token}`)
                .field('reviewers_id', 1)
                .field('editor_review', "Check for spelling error")
                .field('author_review', "Need revisions but its already good")
                .field('recommendation', "revisions required")
                .field('date_completed', Date(2024,6,19))

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                msg:"Reviewers updated",
                data:update_reviewers});
        });


        it('should return 404 if reviewers not found', async () => {
            Reviewers.findOne.mockResolvedValue(null);
            Reviewers.update.mockResolvedValue(update_reviewers);

            const response = await request(app)
            .patch('/reviewers')
            .set('Authorization', `Bearer ${token}`)
            .field('reviewers_id', 1)
            .field('editor_review', "Check for spelling error")
            .field('author_review', "Need revisions but its already good")
            .field('recommendation', "revisions required")
            .field('date_completed', Date(2024,6,19))

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("No Reviewers Found");
        });
        it('should return 500 if there is an error', async () => {
            Reviewers.findOne.mockResolvedValue(array_reviewers[2]);
            Reviewers.update.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
            .patch('/reviewers')
            .set('Authorization', `Bearer ${token}`)
            .field('reviewers_id', 1)
            .field('editor_review', "Check for spelling error")
            .field('author_review', "Need revisions but its already good")
            .field('recommendation', "revisions required")
            .field('date_completed', Date(2024,6,19))
            .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Reviewers failed to update');
        });
    });

    describe('DELETE /reviewers/:id', () => {
        it('should delete a reviewer', async () => {
            Reviewers.findOne.mockResolvedValue(array_reviewers[2]);
            Reviewers.destroy.mockResolvedValue(1);

            const response = await request(app).delete('/reviewers/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Reviewers Deleted Successfully');
        });

        it('should return 500 if there is an error', async () => {
            Reviewers.destroy.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).delete('/reviewers/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });
});
