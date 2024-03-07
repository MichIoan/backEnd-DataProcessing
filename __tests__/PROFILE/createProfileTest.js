const axios = require('axios');
const profileURL = `http://localhost:8081/users/43/profiles/create`;
const loginURL = `http://localhost:8081/auth/login`;
const email = 'test@user.com';
const password = 'Password1';
const userDetails = {
    email,
    password
};

const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Netflix',
    password: 'root',
    port: 5432,
});

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
let userId;
describe('POST /profiles/create', () => {
    beforeEach(async () => {
        const login = await axios.post(loginURL, userDetails);
        token = login.data.token;
        // Object to store the ids of the created profiles
    });

    let createdProfiles1 = [];
    let userId1 = 43;

    it('Response status code for profile creation is 201', async () => {
        try {
            userDetails.name = 'test_profile';
        createdProfiles1.push(userDetails.name);
        userDetails.profile_image = 'example.jpg';
        userDetails.kids = false;
        userDetails.preferences = 41;
        userDetails.date_of_birth = Date.now;
        userDetails.language = 'english';
        const response = await axios.post(profileURL, userDetails, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        expect(response.status).toBe(201);
        expect(response.data).toEqual({
            "message": 'Profile created successfully'
        });
        } catch (error) {
            console.log(error);
        }
    });

    it('Creating a new profile with an existing name should return 409', async () => {
        userDetails.name = 'anofgther_profile';
        createdProfiles1.push(userDetails.name);
        userDetails.profile_image = 'example.jpg';
        userDetails.kids = false;
        userDetails.preferences = 41;
        userDetails.date_of_birth = Date.now;
        userDetails.language = 'english';
        try {
            const response = await axios.post(profileURL, userDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                "error": 'A profile with this name already exists'
            });
        }
    });

    afterEach(async () => {
        // Clean up created profiles after each test
        for (let name of createdProfiles1) {
            await pool.query(`DELETE FROM "Profiles" WHERE "Profiles"."name" = $1  AND "Profiles"."user_id" = $2`,
                [name, userId1]);
        }
    });

    describe('Profile creation tests', () => {
        let loginURL = `http://localhost:8081/auth/login`;
        let profileURL = `http://localhost:8081/users/43/profiles/create`;
        const user_id = 43;

        beforeEach(async () => {
            const login = await axios.post(loginURL, userDetails);
            token = login.data.token;
        });

        it('Response status code for profile creation is 201 when user has less than 4 profiles', async () => {
            try {
                userDetails.name = 'test_profile';
                userDetails.profile_image = 'example.jpg';
                userDetails.kids = false;
                // userDetails.preferences = "";
                userDetails.date_of_birth = Date.now();
                userDetails.language = 'english';
                const response = await axios.post(profileURL, userDetails, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                expect(response.status).toBe(201);
                expect(response.data).toEqual({
                    "message": 'Profile created successfully'
                });
            } catch (error) {

            }
        });

        // it('Response status code for profile creation is 400 when user reaches maximum profile count of 4', async () => {
        //     // Create 4 profiles
        //     let loginURL = `http://localhost:8081/auth/login`;
        //     let profileURL = `http://localhost:8081/users/40/profiles/create`;
        //     let response;

        //     for (let i = 0; i < 4; i++) {
        //         const userDetailsWithIndex = Object.assign({}, userDetails);
        //         userDetailsWithIndex.name = `test_profile_${i}`;
        //         response = await axios.post(profileURL, userDetailsWithIndex, {
        //             headers: {
        //                 Authorization: `Bearer ${token}`
        //             },
        //         });
        //     }

        describe('Profile creation tests', () => {
            const profileURL = 'http://localhost:8081/users/40/profiles/create';
            const userId = 40;

            // Object to store the ids of the created profiles
            let createdProfiles = [];

            beforeEach(async () => {
                // Perform login and obtain token
                // This part might be necessary for each test case if token is required for every request
            });

            it('Response status code for profile creation is 400 when user reaches maximum profile count of 4', async () => {
                // Create 4 profiles
                try {
                    for (let i = 0; i < 4; i++) {
                        const userDetailsWithIndex = {
                            name: `test_profile_${i}`
                        };
                        createdProfiles.push(`test_profile_${i}`);
                        const response = await axios.post(profileURL, userDetailsWithIndex, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                        });
                        expect(response.status).toBe(201);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            // Post-test cleanup: delete created profiles
            afterAll(async () => {
                // let profile_id;
                for (let name of createdProfiles) {
                    await pool.query(`DELETE FROM "Profiles" WHERE "Profiles"."name" = $1  AND "Profiles"."user_id" = $2`,
                        [name, userId]);
                }

                pool.end();
            });
        });
    });


    // // Attempt to create one more profile
    // const response = await axios.post(profileURL, userDetails, {
    //     headers: {
    //         Authorization: `Bearer ${token}`
    //     },
    // });
    // expect(response.status).toBe(400);
    // expect(response.data).toEqual({
    //     "error": 'Maximum profile count reached'
    // });
});
// });


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