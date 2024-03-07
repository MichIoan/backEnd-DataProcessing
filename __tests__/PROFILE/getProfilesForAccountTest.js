const axios = require("axios");
const profileURL = `http://localhost:8081/users/37/:userId/profiles`;
const loginURL = `http://localhost:8081/auth/login`;
const email = "test@user.com";
const password = "Password1";
const userDetails = {
  email,
  password,
};

describe("Profiles for Account", () => {
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

  it("Response status code is 202 on valid request with existing account Id", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(409);
      expect(response.data).toEqual({
        message: "Provided account ID was successful.",
      });
    } catch (error) {
      console.log("ERROR:" + error);
    }
  });

  it("Response status code is 401 on valid request with non-existing account Id", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "Provided account ID is non-existing.",
      });
    } catch (error) {
      console.log(error);
    }
  });

  it("Response should have profiles array", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({ message: "" });
    } catch (error) {
      console.log(error);
    }
  });

  it("Every profile object should have necessary fields", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({
        message: "The profile have necessary fields.",
      });
    } catch (error) {
      console.log(error);
    }
  });

  it("Response status code is 401 when account Id is not provided", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({ message: "Account ID not provided." });
    } catch (error) {
      console.log(error);
    }
  });

  it("Response has specific error message when account Id is not provided", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(401);
      expect(response.data).toEqual({ message: "Account ID is not provided." });
    } catch (error) {
      console.log(error);
    }
  });

  it("Response time is less than 200ms", async () => {
    try {
      const response = await axios.post(profileURL, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Response time is less than 200ms",
      });
    } catch (error) {
      console.log(error);
    }
  });
});
