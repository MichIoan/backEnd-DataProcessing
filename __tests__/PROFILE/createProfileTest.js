const axios = require('axios');
const profileURL = `http://localhost:8081/users/37/profiles/create`;
const email = 'test@user.com';
const password = 'Password1';
const userDetails = {
    email,
    password
};

// it('', async () => {

//     try {
//         const response = await axios.post(profileURL, userDetails);
//     } catch (error) {
//         expect(error.response.status).toBe();
//         expect(error.response.data).toEqual({
//             "error": ''
//         });
//     }
// });

describe('POST /profiles/create', () => {

    it('Response status code for profile creation is 201', async () => {
        userDetails.name = 'david';
        userDetails.profile_image = 'example.jpg';
        userDetails.kids = false;
        userDetails.preferences = 41;
        userDetails.date_of_birth = Date.now;
        userDetails.language = 'english';
        try {
            const response = await axios.post(profileURL, userDetails);
        } catch (error) {

            expect(error.response.status).toBe(201);
            expect(error.response.data).toEqual({
                "error": 'Response status code for profile creation is 201'
            });
        }
    });
});


// // Test Response status code is 201 for successful profile creation
// it("Response status code is 201", function () {
//     expect(pm.response.code).to.equal(201);
// });

// // Test if response has the required field - message
// pm.test("Response has the required field - message", function () {
//     var jsonData = pm.response.json();
//     pm.expect(jsonData.message).to.be.a('string');
// });

// // Test if profile creation was successful
// pm.test("Profile was created successfully", function () {
//     var jsonData = pm.response.json();
//     pm.expect(jsonData.message).to.equal("Profile created successfully");
// });

// // Test if the response type is a JSON
// pm.test("Content-Type is present", function () {
//     pm.response.to.have.header("Content-Type");
// });

// // Test when a name already exists for a profile

// pm.test("Profile with this name already exists", function () {
//     if (pm.response.code === 409) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.be.a('string');
//         pm.expect(jsonData.error).to.equal("Profile with this name already exists");
//     }
// });

// // Test when a user not exists for create a profile
// pm.test("User not found", function () {
//     if (pm.response.code === 404) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.be.a('string');
//         pm.expect(jsonData.error).to.equal("User not found");
//     }
// });

// // Test if response has the required field- error
// pm.test("Response has the required field- error", function () {
//     if (pm.response.code !== 201) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.exist.and.to.be.a('string');
//     }
// });

// // Test Response status code is 500 for server error
// pm.test("Response status code is 500", function () {
//     if (pm.response.code === 500) {
//         pm.expect(pm.response.code).to.equal(500);
//     }
// });

// // Test if internal server error is returned
// pm.test("Internal server error", function () {
//     if (pm.response.code === 500) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.be.a('string');
//         pm.expect(jsonData.error).to.equal("Internal server error");
//     }
// });

// // Test if Response time is less than 200ms
// pm.test("Response time is less than 200ms", function () {
//     pm.expect(pm.response.responseTime).to.be.below(200);
// });

// // Test if the response is not empty
// pm.test("Response is not empty", function () {
//     pm.response.to.not.be.empty;
// });

// // Test when no parameter is provided in the URL
// pm.test("Please provide user id as parameter in the URL", function () {
//     if (pm.response.code === 401) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.be.a('string');
//         pm.expect(jsonData.error).to.equal("Please provide the user id as a parameter in the URL");
//     }
// });

// // Test when no profileName is provided in the request
// pm.test("Please provide profileName in the request body", function () {
//     if (pm.response.code === 400) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.be.a('string');
//         pm.expect(jsonData.error).to.equal("Please provide profileName in the request body");
//     }
// });

// // Test successful response structure
// pm.test("Response structure is correct", function () {
//     const jsonData = pm.response.json();
//     if (jsonData.statusCode === 201) {
//         pm.expect(jsonData).to.have.property('message');
//     }
// });

// // Test whether no profile exists for the provided user id
// pm.test("No profiles found for user", function () {
//     if (pm.response.code === 404) {
//         var jsonData = pm.response.json();
//         pm.expect(jsonData.error).to.eql('No profile found for this user id');
//     }
// });