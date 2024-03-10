const axios = require('axios');
const pool = require('../db_conn');
const registerURL = 'http://localhost:8081/auth/register';
const loginURL = 'http://localhost:8081/auth/login';
const userDetails = {
    email: "test1@user.com",
    password: "Password1"
}

    describe('Change subscription tests', () => {
        let userId;
        let token;
        beforeAll(async () => {
                await axios.post(registerURL, userDetails);
                await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);
                const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
                userId = query.rows[0].user_id;
                const login = await axios.post(loginURL, userDetails);
                token = login.data.token;
        });
        
        it("Invalid parameter in the URL", async () => {
            try {
                await axios.patch(`http://localhost:8081/users/1.1/subscription/change-plan`, { subscriptionPlan: "UHD" }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({ error: "URL parameter is not a valid integer" });
            }
        });
        
        it("Invalid subscription type", async () => {
            try {
                await axios.patch(`http://localhost:8081/users/${userId}/subscription/change-plan`, { subscriptionPlan: "AA" }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({ error: "Invalid subscription plan. Choose between SD, HD, UHD!" });
            }
        });
        
        it("Subscription plan changed succesfully", async () => {
                const response = await axios.patch(`http://localhost:8081/users/${userId}/subscription/change-plan`, { subscriptionPlan: "UHD" }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                expect(response.status).toBe(200);
                expect(response.data).toEqual({ message: "Subscription updated succesfully!" });
        });
        
        afterAll(async () => {
            await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
            pool.end();
        });
        });
        
        
        



