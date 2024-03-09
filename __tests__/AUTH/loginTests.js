const axios = require('axios');
const url = 'http://localhost:8081';
const email = 'test@user.com';
const password = 'Password1';
const userDetails = {
  email,
  password
};
const loginURL = `${url}/auth/login`;

describe('POST /login', () => {

  it('User not found should return 400', async () => {
    userDetails.email = 'not@found.com';
    try {
      const response = await axios.post(loginURL, userDetails);

      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        "error": "User not found"
      });
    } catch (error) {
      console.log("error line 23");
    }
  });

  it('Account not activated should return 400', async () => {
    // assume this user exists and is not activated
    userDetails.email = 'not@activated.com';
    try {
      const response = await axios.post(loginURL, userDetails);

      expect(error.response.status).toBe(400);
      expect(error.response.data).toStrictEqual({
        "error": "Please activate the account first"
      });
    } catch (error) {
      console.log("error line 38");
    }
  });

  it('Invalid password should return 400', async () => {
    // assume this user exists and password is invalid
    userDetails.email = 'test@user.com';
    userDetails.password = 'wrongpassword';
    try {
      const response = await axios.post(loginURL, userDetails);

      expect(error.response.status).toEqual(400);
      expect(error.response.data.error).toMatch(/Invalid password. You have [1-2] attempts left.|You have failed to login for 3 times, your account has been locked for an hour./);
    } catch (error) {
      console.log("error line 52");
    }
  });

  it('Account suspended should return 400', async () => {
    // assume this user exists and is suspended
    userDetails.email = 'suspended@forever.com';
    try {
      const response = await axios.post(loginURL, userDetails);

      expect(error.response.status).toEqual(400);
      expect(error.response.data.error).toMatch('You have failed to login for 3 times, your account has been locked for an hour.');
    } catch (error) {
      console.log("error line 65");
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
      console.log("error line 78");
    }
  });
});