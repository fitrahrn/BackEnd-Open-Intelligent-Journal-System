import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import bcrypt from 'bcrypt';
import User from '../models/UserModel';

const dbMock = new Sequelize();

describe('User Controller', () => {

    describe('GET /user', () => {
        it('should return user details by username', async () => {
            const mockUser = User.build({ username: 'testuser' });
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

            const response = await request(app).get('/user').set('Cookie', ['username=testuser']);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe('testuser');
        });

        it('should return 500 if there is an error', async () => {
            jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/user').set('Cookie', ['username=testuser']);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /users/without', () => {
        it('should return users excluding the logged-in user', async () => {
            const mockUsers = [
                User.build({ username: 'otheruser' }),
            ];
            jest.spyOn(User, 'findAll').mockResolvedValue(mockUsers);

            const response = await request(app).get('/users/without').set('Cookie', ['username=testuser']);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].username).toBe('otheruser');
        });

        it('should return 500 if there is an error', async () => {
            jest.spyOn(User, 'findAll').mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/users/without').set('Cookie', ['username=testuser']);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /user/search', () => {
        it('should find users by name', async () => {
            const mockUsers = [
                User.build({ user_id: 1, name: 'John Doe' }),
            ];
            jest.spyOn(User, 'findAll').mockResolvedValue(mockUsers);

            const response = await request(app).post('/user/search').send({ name: 'John' });

            expect(response.status).toBe(200);
            expect(response.body).toBe(1);
        });

        it('should return 500 if there is an error', async () => {
            jest.spyOn(User, 'findAll').mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).post('/user/search').send({ name: 'John' });

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('PATCH /user/profile', () => {
        it('should update user profile', async () => {
            const mockUser = User.build({ username: 'testuser', password: 'hashedpassword' });
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('newhashedpassword');
            jest.spyOn(User, 'update').mockResolvedValue([1]);

            const response = await request(app)
                .patch('/user/profile')
                .set('Cookie', ['username=testuser'])
                .send({
                    current_password: 'currentpassword',
                    new_password: 'newpassword',
                    confirm_password: 'newpassword',
                    name: 'Updated Name',
                    public_name: 'Updated Public Name',
                    email: 'updated@example.com',
                    phone: '1234567890',
                    orcid_id: '0000-0001-2345-6789',
                    affliation: 'Updated Affliation',
                    mailing_address: 'Updated Mailing Address',
                    signature: 'Updated Signature',
                    country: 'Updated Country',
                    image_path: ''
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Name');
        });

        it('should return 500 if there is an error', async () => {
            jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .patch('/user/profile')
                .set('Cookie', ['username=testuser'])
                .send({
                    current_password: 'currentpassword',
                    new_password: 'newpassword',
                    confirm_password: 'newpassword',
                    name: 'Updated Name',
                    public_name: 'Updated Public Name',
                    email: 'updated@example.com',
                    phone: '1234567890',
                    orcid_id: '0000-0001-2345-6789',
                    affliation: 'Updated Affliation',
                    mailing_address: 'Updated Mailing Address',
                    signature: 'Updated Signature',
                    country: 'Updated Country',
                    image_path: ''
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('User failed to update');
        });
    });
});
