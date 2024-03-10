const axios = require('axios');
const loginURL = `http://localhost:8081/auth/login`;
const registerURL = `http://localhost:8081/auth/register`;
const email = 'test@user.com';
const password = 'Password1';
const userDetails = {
    email,
    password
};
const pool = require('../db_conn');
let profileURL;
let token;

describe('POST /profiles/create', () => {

    it("Get token before tests", async () => {
        await axios.post(registerURL, userDetails);
        await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);
        const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
        const userId = query.rows[0].user_id;
        profileURL = `http://localhost:8081/users/${userId}/profiles/create`;
        const login = await axios.post(loginURL, userDetails);
        token = login.data.token;
    });

    it('Response status code for profile creation is 201', async () => {
        userDetails.name = 'test_profile';
        const response = await axios.post(profileURL, userDetails, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        expect(response.status).toBe(201);
        expect(response.data).toEqual({
            "message": 'Profile created successfully'
        });
    });

    it('Creating a new profile with an existing name should return 400', async () => {
        userDetails.name = 'test_profile';
        try {
            await axios.post(profileURL, userDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": 'Profile with this name already exists'
            });
        }
    });

    it('Response status code for profile creation is 400 when user reaches maximum profile count of 4', async () => {
        try {
            for (let i = 0; i <= 4; i++) {
                userDetails.name = `test_profile${i}`;
                await axios.post(profileURL, userDetails, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
            }
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": "User has reached the maximum number of profiles allowed."
            });
        }
    });

    it("Delete user and all profiles after the tests", async () => {
        await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
        pool.end();
    });
});