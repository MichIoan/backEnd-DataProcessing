const axios = require('axios');
const pool = require('../db_conn');
const registerURL = 'http://localhost:8081/auth/register';
const loginURL = 'http://localhost:8081/auth/login';
const contentURL = `http://localhost:8081/content`;
const userDetails = {
    email: "test@user.com",
    password: "Password1"
}

describe('/', () => {
    let token;
    beforeAll(async () => {
        try {
            await axios.post(registerURL, userDetails);
            await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);
            const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
            userId = query.rows[0].user_id;
            subscriptionURL = `http://localhost:8081/users/${userId}/subscription/info`;
            const login = await axios.post(loginURL, userDetails);
            token = login.data.token;
        } catch (error) {
            console.log("ERROR:" + error);
        }
    });

    it("Get all movies, should fail due to no movies in DB", async () => {
        try {
            await axios.get(`${contentURL}/getMovies`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                },
            })
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toEqual("");
        }
    });

    it("Get movie by id, should fail due to no movies in DB", async () => {
        try {
            await axios.get(`${contentURL}/movie/5/getMovie`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                },
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({ message: "No movie found for this ID" });
        }
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
        pool.end();
    });
});