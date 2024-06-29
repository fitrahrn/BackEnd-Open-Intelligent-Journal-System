import request from "supertest"
import app from "../index.js"
import db from "../config/database.js"
import { jest } from '@jest/globals'
let server;

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await db.close()
  })
 

describe("POST /login", () => {

    describe("when passed a email and password", () => {
      test("should respond with a 200 status code", async () => {
        const response = await request(app).post("/login").send({ 
          email: "fitnug30@gmail.com", 
          password: "12345678" 
        })
        expect(response.statusCode).toBe(200)
      })
    })
    test("should return a 400 status code", async () => {
      const bodies = [
        { email: "fitnug30@gmail.com" },
        { password: "12345678" }
      ]
      for (const body of bodies) {
        const response = await request(app).post("/login").send(body)
        expect(response.statusCode).toBe(400)
      }
    })
})