const axios = require('axios');
const url = 'http://localhost:8081';
const email = 'test@user.com';
const password = 'Password1';
const userDetails = {
    email,
    password
};
const registerURL = `${url}/auth/register`;

describe('POST /register', () => {

    it('Invalid email format', async () => {
        userDetails.email = 'asdasd';
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": "Invalid email format!"
            });
        }
    });

    it("Register new user should return 201", async () => {
        // Add logic here to attempt registering a new user
        const uniqueId = Date.now();
        const email = `new${uniqueId}@user.com`;
        userDetails.email = email;
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(201);
            expect(error.response.data).toEqual({
                "error": "New user registered"
            });
        }
    });


    it("Register existing user should return 409", async () => {
        // Add logic here to attempt registering an existing user
        userDetails.email = 'existing@user.com';
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(409);
            expect(error.response.data).toEqual({
                "error": "User with this email already exists"
            });
        }
    });

    it("Register user with invalid email format should return 401", async () => {
        // Add logic here to attempt registering a new user with invalid email format
        userDetails.email = 'invalidformat'
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": "Invalid email format!"
            });
        }

    });

    it("Register user with invalid password should return 401", async () => {
        // Add logic here to attempt registering a new user with invalid password
        userDetails.email = 'correct@email.com'
        userDetails.password = 'jvho'
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": 'Password must contain at least 1 capital, a number and 6 characters'
            });
        }

    });

    it('Registering with empty fields should return 401', async () => {
        userDetails.email = ""

        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": 'Invalid email format!'
            });
        }
    });

    it('Registering with empty fields should return 401', async () => { 
        userDetails.email = "valid@email.com"
        userDetails.password = ""
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": 'Password must contain at least 1 capital, a number and 6 characters'
            });
        }
    });

});