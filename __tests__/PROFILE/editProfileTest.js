const axios = require("axios");
const loginURL = `http://localhost:8081/auth/login`;
const registerURL = `http://localhost:8081/auth/register`;
const email = "test2@user.com";
const password = "Password1";
const pool = require('../db_conn');
const userDetails = {
  email,
  password,
};
let token;
let userId;

describe("Modify Preference", () => {

  it("Get token before tests", async () => {
    await axios.post(registerURL, userDetails);
    await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);
    const login = await axios.post(loginURL, userDetails);
    token = login.data.token;
  });

  it("Create a profile before tests", async () => {
    const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
    userId = query.rows[0].user_id;
    await axios.post(`http://localhost:8081/users/${userId}/profiles/create`, { name: "test_profile" }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  });

  it("Get profile id with query", async () => {
    const query = await pool.query(`SELECT "profile_id" FROM "Profiles" WHERE user_id=$1`, [userId]);
    profileId = query.rows[0].profile_id;
  });

  it("Profile's preferences successfully modified", async () => {
    const response = await axios.post(`http://localhost:8081/users/${userId}/profiles/${profileId}/update-settings`, userDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: "Profile updated successfully!",
    });
  });

  it("Delete user and all profiles after the tests", async () => {
    await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
    pool.end();
  });
});
