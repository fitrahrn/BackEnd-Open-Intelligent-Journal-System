import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import bcrypt from 'bcrypt';
import User from '../models/UserModel';

const dbMock = new SequelizeMock();
const user = {
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
    profile_picture: "./profile_picture.jpg"}
const otherUser=[
    {
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
        username: 'johndee',
        email: 'test@example.com',
        password: '$2b$10$somethinghashed',
        phone: "08123445678",
        orcid_id: "2189-9178",
        affiliation: "Universitas Gadjah Mada",
        mailing_address: "test@example.com",
        signature: "johndee",
        country:"United States of America",
        profile_picture: "./profile_picture.jpg"
    },

]
const updateUser={
    current_password: "currentpassword",
    new_password: "newpassword",
    confirm_password: "newpassword",
    name: "Updated Name",
    public_name: "Updated Public Name",
    email: "updated@example.com",
    phone: "1234567890",
    orcid_id: "0000-0001-2345-6789",
    affliation: "Updated Affliation",
    mailing_address: "Updated Mailing Address",
    signature: "Updated Signature",
    country: "Updated Country",
}
const bcryptCompare = jest.fn().mockResolvedValue(true);
bcrypt.compare= bcryptCompare;
const bcrypGenSalt = jest.fn().mockResolvedValue(true);
bcrypt.genSalt= bcrypGenSalt;
const bcryptHash = jest.fn().mockResolvedValue(true);
bcrypt.hash= bcryptHash;
describe('User Controller', () => {

    describe('GET /user/get/username', () => {
        it("mock user", () => {
            jest.spyOn(User, "findOne").mockResolvedValue(user);
            jest.spyOn(User, "findAll").mockResolvedValue(otherUser);
        })
        it('should return user details by username', async () => {
            User.findOne.mockResolvedValue(user);

            const response = await request(app).get('/user/get/username').set('Cookie', ['username=johndoe']);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(user);
        });
        
        it('should return 500 if there is an error', async () => {
            User.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/user/get/username').set('Cookie', ['username=johndoe']);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /get/contributors', () => {
        it('should return users excluding the logged-in user', async () => {
            User.findAll.mockResolvedValue([otherUser[1]]);

            const response = await request(app).get('/get/contributors').set('Cookie', ['username=johndoe']);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([otherUser[1]]);
        });

        it('should return 500 if there is an error', async () => {
            User.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/get/contributors').set('Cookie', ['username=johndoe']);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /user/search', () => {
        it('should find users by name', async () => {
            User.findAll.mockResolvedValue(otherUser);

            const response = await request(app).post('/user/search').send({ name: 'John' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(otherUser);
        });

        it('should return 500 if there is an error', async () => {
            User.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).post('/user/search').send({ name: 'John' });

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('PATCH /user/profile', () => {
        it('should update user profile', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true)
            bcrypt.hash.mockResolvedValue('hashedpassword');
            jest.spyOn(User, 'update').mockResolvedValue([1]);

            const response = await request(app)
                .patch('/user/update')
                .set('Cookie', ['username=johndoe'])
                .field('name', "Updated Name")
                .field('public_name', "Updated Public Name")
                .field('email', "updated@example.com")
                .field('current_password', "currentpassword",)
                .field('new_password', "newpassword")
                .field('confirm_password', "newpassword")
                .field('phone', "1234567890")
                .field('orcid_id',"0000-0001-2345-6789")
                .field('affliation', "Updated Affliation")
                .field('mailing_address', "Updated Mailing Address")
                .field('signature', "Updated Signature")
                .field('country', "Updated Country")

            expect(response.status).toBe(200);
            expect(response.body).toEqual({data:updateUser,msg:"User updated"});
        });
        it('should get user not found if user arent logged in', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.compare.mockResolvedValue(true)
            bcrypt.hash.mockResolvedValue('hashedpassword');
            jest.spyOn(User, 'update').mockResolvedValue([1]);

            const response = await request(app)
                .patch('/user/update')
                .field('name', "Updated Name")
                .field('public_name', "Updated Public Name")
                .field('email', "updated@example.com")
                .field('current_password', "currentpassword",)
                .field('new_password', "newpassword")
                .field('confirm_password', "newpassword")
                .field('phone', "1234567890")
                .field('orcid_id',"0000-0001-2345-6789")
                .field('affliation', "Updated Affliation")
                .field('mailing_address', "Updated Mailing Address")
                .field('signature', "Updated Signature")
                .field('country', "Updated Country")

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('No user found');
        });
        it('should current password are incorret if user put in wrong password', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false)
            bcrypt.hash.mockResolvedValue('hashedpassword');

            const response = await request(app)
                .patch('/user/update')
                .set('Cookie', ['username=johndoe'])
                .field('name', "Updated Name")
                .field('public_name', "Updated Public Name")
                .field('email', "updated@example.com")
                .field('current_password', "currentpassword",)
                .field('new_password', "newpassword")
                .field('confirm_password', "newpassword")
                .field('phone', "1234567890")
                .field('orcid_id',"0000-0001-2345-6789")
                .field('affliation', "Updated Affliation")
                .field('mailing_address', "Updated Mailing Address")
                .field('signature', "Updated Signature")
                .field('country', "Updated Country")

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe("Current Password are incorrect");
        });

        it('should return 500 if there is an error', async () => {
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true)
            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.update.mockRejectedValue(new Error('Something went wrong'));
            const response = await request(app)
                .patch('/user/update')
                .set('Cookie', ['username=johndoe'])
                .field('name', "Updated Name")
                .field('public_name', "Updated Public Name")
                .field('email', "updated@example.com")
                .field('current_password', "currentpassword",)
                .field('new_password', "newpassword")
                .field('confirm_password', "newpassword")
                .field('phone', "1234567890")
                .field('orcid_id',"0000-0001-2345-6789")
                .field('affliation', "Updated Affliation")
                .field('mailing_address', "Updated Mailing Address")
                .field('signature', "Updated Signature")
                .field('country', "Updated Country")

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('User failed to update');
        });
    });
});
