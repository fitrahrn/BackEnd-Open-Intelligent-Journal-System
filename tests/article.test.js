import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import Article from '../models/ArticleModel';
import Journal from '../models/JournalModel';
import Issue from '../models/IssueModel';
import User from '../models/UserModel';
import Contributors from '../models/ContributorsModel';
import path from "path"
import jwt from 'jsonwebtoken';
import ArticleFile from "../models/ArticleFileModel.js";
const DBConnectionMock = new SequelizeMock();
const secretKey = process.env.TOKEN_SECRET; // Replace with your actual secret key
const token = jwt.sign({ username: 'johndoe' }, secretKey, { expiresIn: '1m' });
const single_article = {
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

}
const single_article_issue = {
    article_id: 1,
    journal_id: 1,
    issue_id:1,
    prefix:"improving",
    title: "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing",
    subtitle: "Data Preprocessing",
    abstract:"Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",
    article_path:"http://localhost:3001/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf",
    authors:[
           "John Doe, ",
           "John Dee",],
    comment:"",
    issue:1,
    keywords:"Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech",
    volume: 1,
    workflow_phase:"published",
    status:"accepted",
    year: 2007

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
const single_issue={
    issue_id:1,
    journal_id:1,
    volume:1,
    number:1,
    year:2007,
    date_published:Date("2013-09-13"),
    url_path:"/jictra/issue/1",
    appear:1

}
const second_issue={
    issue_id:2,
    journal_id:1,
    volume:1,
    number:1,
    year:2007,
    date_published:Date("2013-09-13"),
    url_path:"/jictra/issue/1",
    appear:1

}
const single_article_with_journal = {
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
    status:"accepted",
    journal:{
        title:single_journal.title
    }
}


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
        status:"accepted",
        cite:0,
        date_published:Date(2024,6,30),
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
const user={
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
const users=[{
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
const contributors= [{
        contributors_id:1,
        article_id:1,
        user_id:1
    },
    {
        contributors_id:2,
        article_id:2,
        user_id:2
    }
]
const contributors_with_user=[{
        contributors_id:1,
        article_id:1,
        user_id:1,
        user:users[0]

    },
    {
        contributors_id:2,
        article_id:2,
        user_id:1,
        user:users[1]
    }
]
const contributors_with_article=[{
        contributors_id:1,
        article_id:1,
        user_id:1,
        article:array_article[0]

    },
    {
        contributors_id:2,
        article_id:2,
        user_id:2,
        article:array_article[1]
    }
]

const response_create_article={
    article_id: 1,
    journal_id: 1,
    issue_id:1,
    prefix:"improving",
    title: "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing",
    subtitle: "Data Preprocessing",
    abstract:"Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",
    comment:"",
    keywords:"Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech",
    workflow_phase:"submitted",
    status:"not reviewed",
    cite:0,
}
const response_update={
    prefix:"improving",
    title: "Effect of Shot Peening Parameters on PLA Parts Manufactured with Fused Deposition Modeling",
    subtitle: "Data Preprocessing",
    abstract:"Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",
    keywords:"Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech",
}
const response_single_article={
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
    status:"accepted",
    journal:{
        title:single_journal.title
    },
    authors : [users[0],users[1]],
    journal_title:single_journal.title,
    year: single_issue.year,
    volume:single_issue.volume,
    issue:single_issue.number,
}
const response_array_article=[
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
        status:"accepted",
        authors : ['John Doe, ' ,'John Dee'],
        year: single_issue.year,
        volume:single_issue.volume,
        issue:single_issue.number,
        cite:0,
        date_published:Date(2024,6,30),
    },{    
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
        status:"reviewers assigned",
        authors : ['John Doe, ' ,'John Dee'],
        year: single_issue.year,
        volume:single_issue.volume,
        issue:single_issue.number,
    }
]
const contributors_response=[{
        contributors_id:1,
        article_id:1,
        user_id:1,
        article:array_article[0],
        journal_title: single_journal.title

    },
    {
        contributors_id:2,
        article_id:2,
        user_id:2,
        article:array_article[1],
        journal_title: single_journal.title
    }
]
const article_file_response={
    article_file_id:1,
    article_id:1,
    article_path:"http://localhost:3001/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf",
    phase:"submitted"
}
const dbMock = new SequelizeMock();

describe('Article Controller', () => {

    describe('GET /article/:id', () => {
        it("mock all model", () => {
            jest.spyOn(Article, "findAll").mockResolvedValue(array_article);
            jest.spyOn(Article, "findOne").mockResolvedValue(single_article);
            jest.spyOn(Article, "create").mockResolvedValue(single_article);
            jest.spyOn(Article, "update").mockResolvedValue(single_article);
            jest.spyOn(Article, "destroy").mockResolvedValue(1);
            jest.spyOn(Journal, "findOne").mockResolvedValue(single_journal);
            jest.spyOn(Contributors, "findAll").mockResolvedValue(contributors);
            jest.spyOn(Contributors, "create").mockResolvedValue(contributors[0]);
            jest.spyOn(User, "findAll").mockResolvedValue(users);
            jest.spyOn(User, "findOne").mockResolvedValue(user);
            jest.spyOn(Issue, "findOne").mockResolvedValue(single_issue);
            jest.spyOn(ArticleFile, "create").mockResolvedValue(article_file_response);
            
        })
        it('should return article by id', async () => {
            Article.findOne.mockResolvedValue(single_article_with_journal);
            Contributors.findAll.mockResolvedValue(contributors_with_user)
            Issue.findOne.mockResolvedValue(single_issue);
            
            const response = await request(app).get('/article/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(response_single_article);
        });

        it('should return 500 if there is an error', async () => {
            Article.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/article/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /articles/submission', () => {
        it('should return articles by user', async () => {
            User.findOne.mockResolvedValue(user)
            Contributors.findAll.mockResolvedValue(contributors_with_article)
            Journal.findOne.mockResolvedValue(single_journal)

            const response = await request(app).get('/articles/submission').set('Cookie', 'username=testuser').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(contributors_response);
        });

        it('should return 500 if there is an error', async () => {
            User.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/articles/submission').set('Cookie', 'username=testuser').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /article/search', () => {
        it('should return articles by title', async () => {
            Article.findAll.mockResolvedValue(array_article)
            const response = await request(app)
                .post('/article/search').set('Authorization', `Bearer ${token}`)
                .send({ title: 'Improving' });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(array_article);
        });

        it('should return 500 if there is an error', async () => {
            Article.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .get('/article/search').set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test' });

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /articles/:journal/:volume/:number', () => {
        it('should return articles by issue', async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            Issue.findOne.mockResolvedValue(single_issue);
            Article.findAll.mockResolvedValue([single_article_issue]);
            Contributors.findAll.mockResolvedValue(contributors_with_user);
            const response = await request(app).get('/articles/jictra/1/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([single_article_issue]);
        });
        it('should return journal not found', async () => {
            Journal.findOne.mockResolvedValue(null);
            Issue.findOne.mockResolvedValue(single_issue);
            Article.findAll.mockResolvedValue([single_article]);

            const response = await request(app).get('/articles/jmfs/1/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe('Journal not found');
        });
        it('should return issue not found', async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            Issue.findOne.mockResolvedValue(null);
            Article.findAll.mockResolvedValue([single_article]);

            const response = await request(app).get('/articles/jictra/1/5').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe('Issue not found');
        });

        it('should return 500 if there is an error', async () => {
            Journal.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/articles/jictra/1/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /articles/:journal', () => {
        it('should return articles by journal', async () => {
            Journal.findOne.mockResolvedValue(single_journal);
            Article.findAll.mockResolvedValue(array_article);
            Contributors.findAll.mockResolvedValue(contributors_with_user);
            Issue.findOne.mockResolvedValue(single_issue);
            Issue.findOne.mockResolvedValue(second_issue);

            const response = await request(app).get('/articles/jictra').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(response_array_article);
        });
        it('should return journal not found', async () => {
            Journal.findOne.mockResolvedValue(null);
            Issue.findOne.mockResolvedValue(single_issue);
            Article.findAll.mockResolvedValue([single_article]);

            const response = await request(app).get('/articles/jmfs/1/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe('Journal not found');
        });
        it('should return 500 if there is an error', async () => {
            Journal.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/articles/jictra').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /article/:journal', () => {
        it('should create a new article', async () => {

            Article.findOne.mockResolvedValue(null);
            Journal.findOne.mockResolvedValue(single_journal);
            User.findOne.mockResolvedValue(user);
            Article.findAll.mockResolvedValue(null);
            Issue.findOne.mockResolvedValue(single_issue);
            Article.create.mockResolvedValue(response_create_article);
            Contributors.create.mockResolvedValue(contributors[0]);
            Contributors.create.mockResolvedValue(contributors[1]);
            ArticleFile.create.mockResolvedValue(article_file_response);
            const response = await request(app)
                .post('/article/jictra')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    data:response_create_article,
                    msg:"Article created successfully"
                });
        });
        it('should return 409 if Article already exist', async () => {
            Article.findOne.mockResolvedValue(single_article);
            Journal.findOne.mockResolvedValue(single_journal);
            User.findOne.mockResolvedValue(user);
            Article.findAll.mockResolvedValue(null);
            Issue.findOne.mockResolvedValue(single_issue);
            Article.create.mockResolvedValue(response_array_article[0]);
            Contributors.create.mockResolvedValue(contributors[0]);
            Contributors.create.mockResolvedValue(contributors[1]);

            const response = await request(app)
                .post('/article/jictra')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe('Article already exist');
        });
        it('should return 409 if Issue not found', async () => {
            Article.findOne.mockResolvedValue(null);
            Journal.findOne.mockResolvedValue(single_journal);
            User.findOne.mockResolvedValue(user);
            Article.findAll.mockResolvedValue(null);
            Issue.findOne.mockResolvedValue(null);
            Article.create.mockResolvedValue(response_array_article[0]);
            Contributors.create.mockResolvedValue(contributors[0]);
            Contributors.create.mockResolvedValue(contributors[1]);

            const response = await request(app)
                .post('/article/jictra')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe("No unpublished issue found");
        });
        it('should return 500 if there is an error', async () => {
            Article.findOne.mockResolvedValue(null);
            Journal.findOne.mockResolvedValue(single_journal);
            User.findOne.mockResolvedValue(user);
            Article.findAll.mockResolvedValue(null);
            Issue.findOne.mockResolvedValue(single_issue);
            Article.create.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/article/jictra')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Improving the Performance of Low-resourced Speaker Identification with Data Preprocessing")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Article failed to create');
            expect(response.body.error).toBe('Something went wrong');
        });
    });

    describe('PATCH /article/:id', () => {
        it('should update an article', async () => {
            Article.findOne.mockResolvedValue(single_article);
            Article.update.mockResolvedValue(single_article);

            const response = await request(app)
                .patch('/article/1')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Effect of Shot Peening Parameters on PLA Parts Manufactured with Fused Deposition Modeling")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                .attach('file',path.resolve('./public/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf'));

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                data:response_update,
                msg:"Article updated"
            });
        });
        it('should return 404 if article not found', async () => {
            Article.findOne.mockResolvedValue(null);

            const response = await request(app)
                .patch('/article/2')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Effect of Shot Peening Parameters on PLA Parts Manufactured with Fused Deposition Modeling")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("No Article Found");
        });
        it('should return 500 if there is an error', async () => {
            Article.findOne.mockResolvedValue(single_article);
            Article.update.mockRejectedValue(new Error("Database Error"));

            const response = await request(app)
                .patch('/article/1')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', 'username=testuser')
                .field('prefix', "improving",)
                .field('title', "Effect of Shot Peening Parameters on PLA Parts Manufactured with Fused Deposition Modeling")
                .field('subtitle', "Data Preprocessing")
                .field('abstract', "Automatic speaker identification is done to tackle daily security problems. Speech data collection is an essential but very challenging task for under-resourced languages like Burmese. The speech quality is crucial to accurately recognize the speaker?s identity. This work attempted to find the optimal speech quality appropriate for Burmese tone to enhance identification compared with other more richy resourced languages on Mel-frequency cepstral coefficients (MFCCs). A Burmese speech dataset was created as part of our work because no appropriate dataset available for use. In order to achieve better performance, we preprocessed the foremost recording quality proper for not only Burmese tone but also for nine other Asian languages to achieve multilingual speaker identification. The performance of the preprocessed data was evaluated by comparing with the original data, using a time delay neural network (TDNN) together with a subsampling technique that can reduce time complexity in model training. The experiments were investigated and analyzed on speech datasets of ten Asian languages to reveal the effectiveness of the data preprocessing. The dataset outperformed the original dataset with improvements in terms of equal error rate (EER). The evaluation pointed out that the performance of the system with the preprocessed dataset improved that of the original dataset.",)
                .field('keywords', "Burmese speech dataset, data scrutiny, Mel-frequency cepstral coefficients (MFCCs), multilingual speech")
                .field('contributors', 2)
                

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Article failed to update');
            expect(response.body.error).toBe('Database Error');
        });
    });

    describe('DELETE /article/:id', () => {
        it('should delete an article', async () => {

            Article.findOne.mockResolvedValue(single_article);
            Article.destroy.mockResolvedValue(1);

            const response = await request(app).delete('/article/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Article Deleted Successfully');
        });
        it('should return 404 if article not found', async () => {
            Article.findOne.mockResolvedValue(null);

            const response = await request(app).delete('/article/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("No Article Found");
        });
        it('should return 500 if there is an error', async () => {
            Article.findOne.mockResolvedValue(single_article);
            Article.destroy.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).delete('/article/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });
});
