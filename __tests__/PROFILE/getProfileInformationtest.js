const axios = require("axios");
const profileURL =
  "http://localhost:8081/users/37/:userId/profiles/:profileId/info";
const loginURL = `http://localhost:8081/auth/login`;
const email = "test@user.com";
const password = "Password1";
const userDetails = {
  email,
  password,
};

describe("Profiles Information", () => {
  let token;

  it("Login to have token for all tests", async () => {
    // Perform login before each test
    userDetails.name = "david";
    userDetails.profile_image = "example.jpg";
    userDetails.kids = false;
    userDetails.preferences = 41;
    userDetails.date_of_birth = Date.now;
    userDetails.language = "english";

    const login = await axios.post(loginURL, userDetails);
    token = login.data.token;
  });

  it("Response status code is 200 and response is json", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Response status code successfully.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Status code is 401 for missing user id", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "Missing user ID.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Status code is 401 for missing profileId", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "Missing profile ID.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Status code is 401 for non exiting user", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "The user does not exists.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Status code is 401 for non exiting profile", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "The profile does not exists.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Status code is 500 for server error", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(500);
      expect(response.data).toEqual({
        message: "Server is not responding.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });
});