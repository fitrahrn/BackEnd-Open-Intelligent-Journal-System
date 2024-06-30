import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import Article from '../models/ArticleModel';
import Reviews from '../models/ReviewsModel';


const DBConnectionMock = new SequelizeMock();

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

describe('Review Controller', () => {
    describe('GET /reviews/:id', () => {
        it("mock all model", () => {
            jest.spyOn(Reviews, "findAll").mockResolvedValue(array_reviews);
            jest.spyOn(Reviews, "findOne").mockResolvedValue(array_reviews[0]);
            jest.spyOn(Reviews, "create").mockResolvedValue(array_reviews[0]);
            jest.spyOn(Reviews, "update").mockResolvedValue(array_reviews[0]);
            jest.spyOn(Reviews, "destroy").mockResolvedValue(1);
            
        })
        it('should return reviews for a given article ID', async () => {
            Reviews.findAll.mockResolvedValue([array_reviews[0]]);

            const response = await request(app).get('/reviews/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([array_reviews[0]]);
        });

        it('should return 500 if there is an error', async () => {
            Reviews.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/reviews/1');

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /review/:id/:rounds', () => {
        it('should return a review for a given article ID and review rounds', async () => {
            Reviews.findOne.mockResolvedValue(array_reviews[0]);

            const response = await request(app).get('/review/1/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(array_reviews[0]);
        });

        it('should return 500 if there is an error', async () => {
            Reviews.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/review/1/1');

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /review', () => {
        it('should create a new review', async () => {
            Reviews.findAll.mockResolvedValue([array_reviews[0]]);
            Reviews.create.mockResolvedValue(array_reviews[2]);

            const response = await request(app)
                .post('/reviews')
                .send({
                    article_id: 1,
                    article_file_path: "http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                data:response_reviews,
                msg:"New review created successfully"
            });
        });

        it('should return 500 if there is an error', async () => {
            Reviews.create.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/reviews')
                .send({
                    article_id: 1,
                    article_file_path: "http://localhost:3001/articles/Article-d16b8a0d8435498a676f557a83e2bffd.pdf",
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('New review failed to create');
        });
    });

    describe('PATCH /review/:id', () => {
        it('should update a review', async () => {
            Reviews.findOne.mockResolvedValue(array_reviews[0]);
            Reviews.update.mockResolvedValue([array_reviews[0]]);

            const response = await request(app)
                .patch('/reviews/1')
                .send({ article_file_path: "http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf"});

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Review updated');
            expect(response.body.data.article_file_path).toBe("http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf");
        });

        it('should return 500 if there is an error', async () => {
            Reviews.update.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .patch('/reviews/1')
                .send({ article_file_path: "http://localhost:3001/articles/Article-998453110df006af30d8cabafbea09eb.pdf" });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Review failed to update');
        });
    });

    describe('DELETE /review/:id', () => {
        it('should delete a review', async () => {
            Reviews.findOne.mockResolvedValue(array_reviews[0]);
            Reviews.destroy.mockResolvedValue(1);

            const response = await request(app).delete('/reviews/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Reviews Deleted Successfully');
        });

        it('should return 500 if there is an error', async () => {
            Reviews.destroy.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).delete('/reviews/1');

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });
});
