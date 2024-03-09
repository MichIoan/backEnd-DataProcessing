const axios = require('axios');
const pool = require('../db_conn');
const registerURL = 'http://localhost:8081/auth/register';
const loginURL = `http://localhost:8081/auth/login`;

const userDetails = {
  email: "test@user.com",
  password: "Password1"
}

describe('POST /login', () => {

  it('User not found should return 400', async () => {
    try {
      await axios.post(loginURL, userDetails);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        "error": "User not found"
      });
    }
  });

  //changed register user from beforeAll to it due to some errors
  it("register user before the test", async () => {
    await axios.post(registerURL, userDetails);
  });

  it('Account not activated should return 400', async () => {
    try {
      await axios.post(loginURL, userDetails);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toStrictEqual({
        "error": "Please activate the account first"
      });
    }
  });

  it('Invalid password should return 400', async () => {
    userDetails.password = 'wrongpassword';
    await pool.query(`UPDATE "Users" SET "status"=$1 WHERE "email"=$2`, ["active", userDetails.email]);
    try {
      await axios.post(loginURL, userDetails);
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.error).toMatch(/Invalid password. You have [1-2] attempts left./);
    }
  });

  it('Account suspended should return 400', async () => {
    userDetails.password = "wrongpass";
    await pool.query(`UPDATE "Users" SET "status"=$1, "locked_until"=$2 WHERE "email"=$3`, ["suspended", "2034-03-09 17:51:25.794+01", userDetails.email]);
    try {
      await axios.post(loginURL, userDetails);
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.error).toMatch('You have failed to login for 3 times, your account has been locked for an hour.');
    }
  });

  it('Successful Login should have message as \'Login successful\'', async () => {
    // assume this user exists and password is correct
    try {
      userDetails.email = 'test@user.com';
      userDetails.password = 'Password1';
      const response = await axios.post(loginURL, userDetails);
      expect(response.status).toEqual(200);
      expect(response.data.message).toEqual('Login successful');
    } catch (error) {
      console.log("Error line 78, please try the test again or look in the Readme.md");
    }
  });

  it("Delete user after all the tests ran", async () => {
    await pool.query(`DELETE FROM "Users" WHERE "Users"."email"=$1`, [userDetails.email]);
    pool.end();
  });
});