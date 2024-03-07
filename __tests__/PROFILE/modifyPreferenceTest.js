const axios = require("axios");
const profileURL =
  "http://localhost:8081/users/37/:userId/profiles/:profileId/modify-preferences";
const loginURL = `http://localhost:8081/auth/login`;
const email = "test@user.com";
const password = "Password1";
const userDetails = {
  email,
  password,
};

describe("Modify Preference", () => {
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

  it("Please provide the user id in the URL", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: "Provide de User ID!",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Please provide the profile id in the URL", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: "Provide de Profile ID!",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("No profile found for this id", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "No profile found!",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("No preferences were modified", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "No modified preferences!",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Profile's preferences successfully modified", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(202);
      expect(response.data).toEqual({
        message: "Preferences modified successfully!",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Internal server error", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(500);
      expect(response.data).toEqual({
        message: "Server not found!",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });
});
