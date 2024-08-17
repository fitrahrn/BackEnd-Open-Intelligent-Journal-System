import request from "supertest";
import jwt from 'jsonwebtoken';
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import Article from '../models/ArticleModel';
import Reviews from '../models/ReviewsModel';
import ReviewersFile from "../models/ReviewersFileModel.js";


const DBConnectionMock = new SequelizeMock();
const reviewers_file={
    reviewers_id:1,
    reviewers_file:"http://localhost:3001/articles/Article-34b5ffed24252709897ed965e2ee9516.pdf"
}
const array_reviews_reviewers=[
    {
        reviews_id:1,
        article_id:1,
        review_rounds:1,
        article_file_path:"http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
        reviewers:[{
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
        },]
    },
    {
        reviews_id:1,
        article_id:1,
        review_rounds:2,
        article_file_path:"http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
        reviewers:[]

    },
    
]
const array_reviews=[
    {
        reviews_id:1,
        article_id:1,
        review_rounds:1,
        article_file_path:"http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf"

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
const response_reviews={
    article_id:1,
    review_rounds:2,
    article_file_path:"http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf"

}
const secretKey = process.env.TOKEN_SECRET; // Replace with your actual secret key
const token = jwt.sign({ username: 'testuser' }, secretKey, { expiresIn: '1m' });
describe('Review Controller', () => {
    describe('GET /reviews/:id', () => {
        it("mock all model", () => {
            jest.spyOn(Reviews, "findAll").mockResolvedValue(array_reviews);
            jest.spyOn(Reviews, "findOne").mockResolvedValue(array_reviews[0]);
            jest.spyOn(Reviews, "create").mockResolvedValue(array_reviews[0]);
            jest.spyOn(Reviews, "update").mockResolvedValue(array_reviews[0]);
            jest.spyOn(Reviews, "destroy").mockResolvedValue(1);
            jest.spyOn(ReviewersFile, "findOne").mockResolvedValue(array_reviews[0]);
        });

        it('should return reviews for a given article ID', async () => {
            Reviews.findAll.mockResolvedValue([array_reviews_reviewers[0]]);

            const response = await request(app)
                .get('/reviews/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([array_reviews_reviewers[0]]);
        });

        it('should return 500 if there is an error', async () => {
            Reviews.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .get('/reviews/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /review/:id/:rounds', () => {
        it('should return a review for a given article ID and review rounds', async () => {
            Reviews.findOne.mockResolvedValue(array_reviews[0]);

            const response = await request(app)
                .get('/review/1/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(array_reviews[0]);
        });

        it('should return 500 if there is an error', async () => {
            Reviews.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .get('/review/1/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /reviews', () => {
        it('should create a new review', async () => {
            Reviews.findAll.mockResolvedValue([array_reviews[0]]);
            Reviews.create.mockResolvedValue(array_reviews[2]);

            const response = await request(app)
                .post('/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    article_id: 1,
                    article_file_path: "http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                data: response_reviews,
                msg: "New review created successfully"
            });
        });

        it('should return 500 if there is an error', async () => {
            Reviews.create.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    article_id: 1,
                    article_file_path: "http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('New review failed to create');
        });
    });

    describe('PATCH /reviews/:id', () => {
        it('should update a review', async () => {
            Reviews.findOne.mockResolvedValue(array_reviews[0]);
            Reviews.update.mockResolvedValue([array_reviews[0]]);

            const response = await request(app)
                .patch('/reviews/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ article_file_path: "http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf" });

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Review updated');
            expect(response.body.data.article_file_path).toBe("http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf");
        });

        it('should return 500 if there is an error', async () => {
            Reviews.update.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .patch('/reviews/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ article_file_path: "http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf" });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Review failed to update');
        });
    });

    describe('DELETE /reviews/:id', () => {
        it('should delete a review', async () => {
            Reviews.findOne.mockResolvedValue(array_reviews[0]);
            Reviews.destroy.mockResolvedValue(1);

            const response = await request(app)
                .delete('/reviews/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Reviews Deleted Successfully');
        });

        it('should return 500 if there is an error', async () => {
            Reviews.destroy.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .delete('/reviews/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });
});