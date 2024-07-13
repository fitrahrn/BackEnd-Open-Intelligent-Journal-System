import request from "supertest"
import app from "../index.js"
import { jest } from '@jest/globals'
import bcrypt from "bcrypt"
import User from "../models/UserModel.js"
import Role from "../models/RoleModel.js"
import SequelizeMock from "sequelize-mock"
const dbMock = new SequelizeMock();
const bcryptCompare = jest.fn().mockResolvedValue(true);
bcrypt.compare= bcryptCompare;
const bcrypGenSalt = jest.fn().mockResolvedValue(true);
bcrypt.genSalt= bcrypGenSalt;
const bcryptHash = jest.fn().mockResolvedValue(true);
bcrypt.hash= bcryptHash;
import jwt from 'jsonwebtoken';
const secretKey = process.env.TOKEN_SECRET; // Replace with your actual secret key
const token = jwt.sign({ username: 'johndoe' }, secretKey, { expiresIn: '1m' });
const jwtSign = jest.fn().mockResolvedValue(true);
jwt.sign= jwtSign;

describe('Auth Testing', () => {
    
    describe('POST /login', () => {

        afterEach(() => {
        jest.clearAllMocks();
        });
        it("mock findOne", () => {
            jest.spyOn(User, "findOne").mockResolvedValue({
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
            });
        })
        it('should return 400 if email or password is missing', async () => {
            const res = await request(app).post('/login').send({ email: 'test@example.com' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('msg', 'All input is required');
        });
    
        it('should return 400 if user is not found', async () => {
            User.findOne.mockResolvedValue(null)
            const res = await request(app).post('/login').send({ email: 'test@email.com', password: 'wrongpassword' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('msg', 'User not found');
        });
    
        it('should return 400 if password is incorrect', async () => {
            bcrypt.compare.mockResolvedValue(false);
            User.findOne.mockResolvedValue({
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
            })
            const res = await request(app).post('/login').send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('msg', 'Wrong Password');
        });
    
        it('should return 200 and tokens if login is successful', async () => {
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockResolvedValue('fakeToken');
            const res = await request(app).post('/login').send({ email: 'test@example.com', password: 'password123' });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.headers['set-cookie']).toEqual(
                expect.arrayContaining([
                expect.stringContaining('username'),
                expect.stringContaining('refreshToken')
                ])
            );
        });
    });
  
    describe('POST /register', () => {
    
        afterEach(() => {
        jest.clearAllMocks();
        });
        it("mock create", () => {
            jest.spyOn(User, "create").mockResolvedValue({
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
            });
            jest.spyOn(Role, "create").mockResolvedValue({
                role_id: 1,
                user_id:1,
                journal_id:1,
                administrator: false,
                lead_editor:false,
                reviewer: false,
                author:false,
                reader:true
            });
        })
        it('should return 400 if any required fields are missing', async () => {
        const res = await request(app).post('/register').send({ name: 'John Doe', username: 'johndoe', email: 'test@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'All input is required');
        });
    
        it('should return 400 if password and confirm password do not match', async () => {
        const res = await request(app).post('/register').send({ name: 'John Doe', username: 'johndoe', email: 'test@example.com', password: 'password123', confPassword: 'password321' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', "Password and Confirm Password don't match");
        });
    
        it('should return 409 if user already exists', async () => {
        User.findOne.mockResolvedValue({
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
        })
        const res = await request(app).post('/register').send({
            name: 'John Doe',
            public_name: 'John Doe',
            username: 'johndoe',
            email: 'test@example.com',
            password: 'password123',
            confPassword: 'password123',
            phone: "08123445678",
            orcid_id: "2189-9178",
            affiliation: "Universitas Gadjah Mada",
            mailing_address: "test@example.com",
            signature: "johndoe",
            country: "United States of America",
            journal_id: 1
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('msg', "User already exists");
        });
    
        it('should return 200 if registration is successful', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            dataValues:{
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
        })
        Role.create.mockResolvedValue({
            dataValues:{
                role_id: 1,
                user_id:1,
                journal_id:1,
                administrator: false,
                lead_editor:false,
                reviewer: false,
                author:false,
                reader:true
            }
        })
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedpassword');
    
        const res = await request(app).post('/register').send({
            name: 'John Doe',
            public_name: 'John Doe',
            username: 'johndoe',
            email: 'test@example.com',
            password: 'password123',
            confPassword: 'password123',
            phone: "08123445678",
            orcid_id: "2189-9178",
            affiliation: "Universitas Gadjah Mada",
            mailing_address: "test@example.com",
            signature: "johndoe",
            country: "United States of America",
            journal_id: 1
        });
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Registration Successful');
        });
    
        it('should return 500 if registration fails', async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null);
        jest.spyOn(User, "create").mockRejectedValue(new Error("Registration failed"));
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedpassword');
    
        const res = await request(app).post('/register').send({
            name: 'John Doe',
            public_name: 'John Doe',
            username: 'johndoe',
            email: 'test@example.com',
            password: 'password123',
            confPassword: 'password123',
            phone: "08123445678",
            orcid_id: "2189-9178",
            affiliation: "Universitas Gadjah Mada",
            mailing_address: "test@example.com",
            signature: "johndoe",
            country: "United States of America",
            journal_id: 1
        });
    
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('msg', 'Registration failed');
        });
    });
    describe('GET /users', () => {
    
        it('should return all users ', async () => {
            jest.spyOn(User, "findAll").mockResolvedValue([{
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
            }])
            User.findAll.mockResolvedValue([{
            name: 'John Doe',
            public_name: 'John Doe',
            username: 'johndoe',
            email: 'test@example.com',
            password: 'password123',
            confPassword: 'password123',
            phone: "08123445678",
            orcid_id: "2189-9178",
            affiliation: "Universitas Gadjah Mada",
            mailing_address: "test@example.com",
            signature: "johndoe",
            country: "United States of America",
            journal_id: 1
        }]);

            const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{
                name: 'John Doe',
                public_name: 'John Doe',
                username: 'johndoe',
                email: 'test@example.com',
                password: 'password123',
                confPassword: 'password123',
                phone: "08123445678",
                orcid_id: "2189-9178",
                affiliation: "Universitas Gadjah Mada",
                mailing_address: "test@example.com",
                signature: "johndoe",
                country: "United States of America",
                journal_id: 1
            }]);
        });
        it('should return 500 if there is an error', async () => {
            User.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    })
})
