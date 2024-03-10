const axios = require('axios');
const pool = require('../db_conn');
const registerURL = 'http://localhost:8081/auth/register';
const loginURL = 'http://localhost:8081/auth/login';
const userDetails = {
    email: "test@user.com",
    password: "Password1"
}

describe('/:userId/subscription/renew', () => {
    let token;
    let subscriptionURL;
    let userId;
    beforeAll(async () => {
        try {
            await axios.post(registerURL, userDetails);
            await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);
            const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
            userId = query.rows[0].user_id;
            subscriptionURL = `http://localhost:8081/users/${userId}/subscription/renew`;
            const login = await axios.post(loginURL, userDetails);
            token = login.data.token;
        } catch (error) {
            console.log("ERROR:" + error);
        }
    });

    it("Invalid parameter in the URL", async () => {
        try {
            await axios.patch(`http://localhost:8081/users/1.1/subscription/renew`, { subscriptionPlan: "AA" }
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({ error: "URL parameter is not a valid integer" });
        }
    });

    it("No subscription plan in the body", async () => {
        try {
            await axios.patch(`http://localhost:8081/users/1.1/subscription/renew`, "", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({ error: "Please specify in the body the subscription plan that you want to renew" });
        }
    });

    it("Invalid subscription type", async () => {
        try {
            await axios.patch(`http://localhost:8081/users/1.1/subscription/renew`, { subscriptionPlan: "AA" }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({ error: "URL parameter is not a valid integer" });
        }
    });

    it("Succesfully changed subscription plan", async () => {
        try {
            const response = await axios.patch(`http://localhost:8081/users/${userId}/subscription/renew`, { subscriptionPlan: "UHD" }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            expect(response.status).toBe(200);
            expect(response.data).toEqual({ message: "Subscription renewed succesfully!" });
        } catch (error) {
            console.log(error);
        }
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
        pool.end();
    });
});