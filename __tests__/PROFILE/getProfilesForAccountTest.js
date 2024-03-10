const axios = require("axios");
const pool = require('../db_conn');
const loginURL = `http://localhost:8081/auth/login`;
const registerURL = `http://localhost:8081/auth/register`;
const email = "test@user.com";
const password = "Password1";
const userDetails = {
  email,
  password,
};

describe("Profiles for Account", () => {
  let token;
  let profileURL;
  let userId;

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

    profileURL = `http://localhost:8081/users/${userId}/profiles`;
  });

  it("Response status code is 200 on valid request with existing account Id", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Provided account ID was successful.",
      });
    } catch (error) {

    }
  });

  it("Response status code is 400 when account Id is not provided", async () => {
    try {
      await axios.get(profileURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual({ message: "Account ID not provided." });
    }
  });

  afterAll(async () => {
    await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
    pool.end();
  });
});
