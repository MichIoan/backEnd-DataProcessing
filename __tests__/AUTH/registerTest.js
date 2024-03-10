const axios = require('axios');
const pool = require('../db_conn');
const userDetails = {
    email: "test@user.com",
    password: "Password1"
};
const registerURL = `http://localhost:8081/auth/register`;

describe('POST /register', () => {

    it('Register user with invalid email format should return 400', async () => {
        userDetails.email = 'asdasd';
        try {
            await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": "Invalid email format!"
            });
        }
    });

    it("Register new user should return 201", async () => {
        const email = `existing@user.com`;
        userDetails.email = email;
        usersToDelete = email;
        const response = await axios.post(registerURL, userDetails);
        expect(response.status).toBe(201);
        expect(response.data).toEqual({
            "message": "User registered successfully. Activate account from email!"
        });
    });

    it("Register existing user should return 400", async () => {
        userDetails.email = 'existing@user.com';
        try {
            await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": "User with this email already exists"
            });
        }
    });

    it("Register user with invalid password should return 400", async () => {
        // Add logic here to attempt registering a new user with invalid password
        userDetails.email = 'correct@email.com'
        userDetails.password = 'jvho'
        try {
            await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": 'Password must contain at least 1 capital, a number and 6 characters'
            });
        }
    });

    it('Registering with empty fields should return 400', async () => {
        userDetails.email = "valid@email.com"
        userDetails.password = ""
        try {
            await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": 'Password must contain at least 1 capital, a number and 6 characters'
            });
        }
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM "Users" WHERE "Users"."email"=$1`, ["existing@user.com"]);
        pool.end();
    });
});