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

let createdProfiles1 = [];
let userId1 = 43;
let userId;

describe('POST /profiles/create', () => {
    beforeEach(async () => {
        const login = await axios.post(loginURL, userDetails);
        token = login.data.token;
        // Object to store the ids of the created profiles
    });


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
            afterEach(async () => {
                // let profile_id;
                for (let name of createdProfiles) {
                    await pool.query(`DELETE FROM "Profiles" WHERE "Profiles"."name" = $1  AND "Profiles"."user_id" = $2`,
                        [name, userId]);
                }
            });
        });
    });

    describe('Profile creation tests for non existing user', () => {
        let loginURL = `http://localhost:8081/auth/login`;
        let profileURL = `http://localhost:8081/users/23/profiles/create`;
        const user_id = 23;
        let pool;

        beforeEach(async () => {
            const {
                Pool
            } = require('pg');
            pool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'Netflix',
                password: 'root',
                port: 5432,
            });
        });


        it('Profile creation tests for non existing user should return 404', async () => {
            try {
                userDetails.name = 'non_existing';
                userDetails.profile_image = 'example.jpg';
                userDetails.kids = false;
                userDetails.date_of_birth = Date.now();
                userDetails.language = 'english';
                const response = await axios.post(profileURL, userDetails, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                expect(response.status).toBe(404);
                expect(response.data).toEqual({
                    "message": 'User not found'
                });
            } catch (error) {
                // Handle error
            }
        });

        afterAll(async () => {
            try {
                // Clean up created profiles after all tests have finished
                for (let name of createdProfiles1) {
                    await pool.query(`DELETE FROM "Profiles" WHERE "Profiles"."name" = $1  AND "Profiles"."user_id" = $2`,
                        [name, userId1]);
                }
                // Close the PostgreSQL pool connection
            } catch (error) {
                console.error('Error during cleanup:', error);
                throw error;
            }
            pool.end();
        });
    });
});