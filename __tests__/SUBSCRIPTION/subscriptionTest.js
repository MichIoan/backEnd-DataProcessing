const axios = require('axios');
const pool = require('../db_conn');
const registerURL = 'http://localhost:8081/auth/register';
const loginURL = 'http://localhost:8081/auth/login';
// const subscriptionURL = `http://localhost:8081/users/:userId/subscription/info`;

const userDetails = {
    email: "test@user.com",
    password: "Password1"
}
let subscriptionURL;
let token;
let userId;

describe('/:userId/subscription/renew', () => {
    it("Get token before tests", async () => {
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

    it('Get the profile succesfuly', async () => {

        const response = await axios.get(subscriptionURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        expect(response.status).toBe(200);
    });

    it("Delete user and all profiles after the tests", async () => {
        await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
        pool.end();
    });




















































})