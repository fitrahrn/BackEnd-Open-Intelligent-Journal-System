import request from "supertest";
import app from "../index.js";
import { jest } from '@jest/globals';
import SequelizeMock from "sequelize-mock";
import Role from '../models/RoleModel';
import User from '../models/UserModel';
import Journal from '../models/JournalModel';
import { Op } from 'sequelize';

// Mock the database connection
const DBConnectionMock = new SequelizeMock();

const array_roles = [
    {
        role_id: 1,
        journal_id: 1,
        user_id: 1,
        administrator: false,
        lead_editor: false,
        editor: false,
        reviewer: false,
        author: true,
        reader: true,
        request: null
    },
    // add more mock roles as needed
];


const array_users = [
    {
        user_id: 1,
        name: "John Doe"
    },
    {
        user_id: 2,
        name: "John Dee"
    },
    // add more mock users as needed
];
const array_roles_user = [
    {
        role_id: 1,
        journal_id: 1,
        user_id: 1,
        administrator: false,
        lead_editor: false,
        editor: false,
        reviewer: false,
        author: false,
        reader: true,
        request: null,
        user:array_users[0]
    },
    // add more mock roles as needed
];
const array_journals = [
    {
        journal_id: 1,
        title: "Test Journal",
        path: "test-path"
    },
    // add more mock journals as needed
];
const request_roles = [
    {
        role_id: 1,
        journal_id: 1,
        user_id: 1,
        administrator: false,
        lead_editor: false,
        editor: false,
        reviewer: false,
        author: false,
        reader: true,
        request: "reviewer",
        user:array_users[0],
        journal_title: array_journals[0].title
    },
    {
        role_id: 2,
        journal_id: 1,
        user_id: 2,
        administrator: false,
        lead_editor: false,
        editor: false,
        reviewer: false,
        author: false,
        reader: true,
        request: "author",
        user:array_users[1],
        journal_title: array_journals[0].title
    },
    // add more mock roles as needed
];
const request_answer={role_id: 1,
    journal_id: 1,
    user_id: 1,
    administrator: false,
    lead_editor: false,
    editor: false,
    reviewer: false,
    author: false,
    reader: true,
    request: "reviewer",}


describe('Role Controller', () => {
    describe('GET /role/request', () => {
        it("mock all model", () => {
            jest.spyOn(Role, "findAll").mockResolvedValue(array_roles);
            jest.spyOn(Role, "findOne").mockResolvedValue(array_roles[0]);
            jest.spyOn(Role, "create").mockResolvedValue(array_roles[0]);
            jest.spyOn(Role, "update").mockResolvedValue(array_roles[0]);
            jest.spyOn(Role, "destroy").mockResolvedValue(1);
            jest.spyOn(Journal,"findOne").mockResolvedValue(array_journals[0])
            jest.spyOn(User,"findOne").mockResolvedValue(array_users[0])
        })
        it('should return roles with requests', async () => {
            Role.findAll.mockResolvedValue(request_roles);

            const response = await request(app).get('/role/request');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(request_roles);
        });

        it('should return 500 if there is an error', async () => {
            Role.findAll.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/role/request');

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });


    describe('GET /role/reviewers/:path', () => {
        it('should return reviewers for a given journal path', async () => {
            Journal.findOne.mockResolvedValue(array_journals[0]);
            Role.findAll.mockResolvedValue(array_roles_user);

            const response = await request(app).get('/role/reviewers/test-path');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(array_roles_user);
        });

        it('should return 500 if there is an error', async () => {
            Journal.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/role/reviewers/test-path');

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('GET /role/user', () => {
        it('should return roles for a given user', async () => {
            User.findOne.mockResolvedValue(array_users[0]);
            Role.findAll.mockResolvedValue([array_roles[0]]);

            const response = await request(app).get('/role/user').set('Cookie', ['username=testuser']);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([array_roles[0]]);
        });

        it('should return 500 if there is an error', async () => {
            User.findOne.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).get('/role/user').set('Cookie', ['username=testuser']);

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });

    describe('POST /roles', () => {
        it('should create a new role', async () => {
            User.findOne.mockResolvedValue(array_users[0]);
            Role.create.mockResolvedValue(array_roles[0]);

            const response = await request(app)
                .post('/role')
                .set('Cookie', ['username=testuser'])
                .send({
                    journal_id: 1
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                msg: "New Role added successfully",
                data: {
                    user_id: array_users[0].user_id,
                    journal_id: 1,
                    administrator: false,
                    lead_editor: false,
                    reviewer: false,
                    author: false,
                    reader: true
                }
            });
        });

        it('should return 500 if there is an error', async () => {
            Role.create.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/role')
                .set('Cookie', ['username=testuser'])
                .send({
                    journal_id: 1
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Role failed to add');
        });
    });

    describe('PATCH /roles/:path', () => {
        it('should update a role', async () => {
            User.findOne.mockResolvedValue(array_users[0]);
            Journal.findOne.mockResolvedValue(array_journals[0]);
            Role.update.mockResolvedValue([array_roles[0]]);

            const response = await request(app)
                .patch('/role/test-path')
                .set('Cookie', ['username=testuser'])
                .send({
                    administrator: true,
                    lead_editor: false,
                    editor: false,
                    reviewer: false,
                    author: false,
                    reader: true
                });

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Role updated');
            expect(response.body.data.administrator).toBe(true);
        });

        it('should return 500 if there is an error', async () => {
            Role.update.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .patch('/role/1')
                .set('Cookie', ['username=testuser'])
                .send({
                    administrator: true,
                    lead_editor: false,
                    editor: false,
                    reviewer: false,
                    author: false,
                    reader: true
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Role failed to update');
        });
    });

    describe('POST /role/request', () => {
        it('should request a role', async () => {
            User.findOne.mockResolvedValue(array_users[0]);
            Role.findOne.mockResolvedValue(array_roles[0]);
            Role.update.mockResolvedValue([array_roles[0]]);

            const response = await request(app)
                .post('/role/request')
                .set('Cookie', ['username=testuser'])
                .send({
                    journal_id: 1,
                    request: 'editor'
                });

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Role updated');
            expect(response.body.data.request).toBe('editor');
        });

        it('should return 409 if user already have the role', async () => {
            User.findOne.mockResolvedValue(array_users[0]);
            Role.findOne.mockResolvedValue(array_roles[0]);
            Role.update.mockResolvedValue([array_roles[0]]);
            const response = await request(app)
                .post('/role/request')
                .set('Cookie', ['username=testuser'])
                .send({
                    journal_id: 1,
                    request: 'author'
                });

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe("User already have the role");
        });
        it('should return 500 if there is an error', async () => {
            Role.update.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/role/request')
                .set('Cookie', ['username=testuser'])
                .send({
                    journal_id: 1,
                    request: 'editor'
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Role request failed to update');
        });
    });

    describe('POST /role/request/answer', () => {
        it('should answer a role request', async () => {
            Role.findOne.mockResolvedValue(request_answer);
            Role.update.mockResolvedValue(array_roles[0]);

            const response = await request(app)
                .post('/role/request/answer')
                .send({
                    role_id: 1,
                    accept: true
                });

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Role updated');
            expect(response.body.data.request).toBe(null);
        });
        it('should return error if user dont have role request', async () => {
            Role.findOne.mockResolvedValue(array_roles[0]);
            Role.update.mockResolvedValue(array_roles[0]);

            const response = await request(app)
                .post('/role/request/answer')
                .send({
                    role_id: 1,
                    accept: true
                });

            expect(response.status).toBe(409);
            expect(response.body.msg).toBe("User don't have role request");
        });

        it('should return 500 if there is an error', async () => {
            Role.findOne.mockResolvedValue(request_answer);
            Role.update.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app)
                .post('/role/request/answer')
                .send({
                    role_id: 1,
                    accept: true
                });

            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Role request failed to update');
        });
    });

    describe('DELETE /roles/:id', () => {
        it('should delete a role', async () => {
            Role.findOne.mockResolvedValue(array_roles[0]);
            Role.destroy.mockResolvedValue(1);

            const response = await request(app).delete('/role/1');

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Role Deleted Successfully');
        });

        it('should return 500 if there is an error', async () => {
            Role.destroy.mockRejectedValue(new Error('Something went wrong'));

            const response = await request(app).delete('/role/1');

            expect(response.status).toBe(500);
            expect(response.body).toBe('Something went wrong');
        });
    });
});
