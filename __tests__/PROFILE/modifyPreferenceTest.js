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

describe("Modify Preference", () => {
  let profileURL;
  let token;
  let userId;
  let profileId;


  beforeAll(async () => {
    await axios.post(registerURL, userDetails);
    await pool.query(`UPDATE "Users" SET status=$1 WHERE email=$2`, ["active", userDetails.email]);

    const login = await axios.post(loginURL, userDetails);
    token = login.data.token;

    const query = await pool.query(`SELECT "user_id" FROM "Users" WHERE email=$1`, [userDetails.email]);
    userId = query.rows[0].user_id;

    const profileName = "test_profile";

    await axios.post(`http://localhost:8081/users/${userId}/profiles/create`, {
      name: profileName
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const profileQuery = await pool.query(`SELECT "profile_id" FROM "Profiles" WHERE user_id=$1 AND name=$2`, [userId, profileName]);
    profileId = profileQuery.rows[0].profile_id;


    profileURL = `http://localhost:8081/users/${userId}/profiles/${profileId}/modify-preferences`;
  });

  it("Invalid integer in URL", async () => {
    try {
      const response = await axios.patch(`http://localhost:8081/users/1.1/profiles/${profileId}/modify-preferences`
        , userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        message: "URL Parameter is not a valid integer",
      });
    }
  });

  it("No preferences were modified", async () => {
    try {
      const response = await axios.patch(profileURL, "", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "No preferences were modified",
      });
    } catch (error) {
      console.log(error);
    }
  });

  it("Profile's preferences successfully modified", async () => {
    try {
      const preferences = { minimum_age: "18" };
      const response = await axios.patch(profileURL, preferences, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Profile preferences successfully modified",
      });
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await pool.query(`DELETE FROM "Users" WHERE email=$1`, [userDetails.email]);
    pool.end();
  });
});
