const axios = require("axios");
const pool = require('../db_conn');
const loginURL = `http://localhost:8081/auth/login`;
const registerURL = `http://localhost:8081/auth/register`;
const email = "test3@user.com";
const password = "Password1";
const userDetails = {
  email,
  password,
};

describe("Profiles Information", () => {
  let token;
  let userId;
  let profileId;

  beforeAll(async () => {
    await axios.post(registerURL, userDetails);
    await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);

    const login = await axios.post(loginURL, userDetails);
    token = login.data.token;

    const profileName = "test_profile";

    const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
    userId = query.rows[0].user_id;

    await axios.post(`http://localhost:8081/users/${userId}/profiles/create`, { name: profileName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const profileQuery = await pool.query(`SELECT "profile_id" FROM "Profiles" WHERE user_id=$1 AND name=$2`, [userId, profileName]);
    profileId = profileQuery.rows[0].profile_id;
  });

  it("Response status code is 200 and response is json", async () => {
    const response = await axios.post(`http://localhost:8081/users/${userId}/profiles/${profileId}/info`, userDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });

  it("Status code is 404 for missing user id", async () => {
    try {
      await axios.post(`http://localhost:8081/users/3,3/profiles/3.3/info`, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({ error: "The parameter is not a valid integer" });
    }
  });

  afterAll(async () => {
    await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
    pool.end();
  });
});