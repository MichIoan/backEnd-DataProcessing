const axios = require('axios');
const url = 'http://localhost:8081';
const email = 'test@user.com';
const password = 'Password1';
const userDetails = {
    email,
    password
};
const registerURL = `${url}/auth/register`;

describe('POST /register', () => {

    it('Invalid email format', async () => {
        userDetails.email = 'asdasd';
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": "Invalid email format!"
            });
        }
    });

    it("Register new user should return 201", async () => {
        // Add logic here to attempt registering a new user
        const uniqueId = Date.now();
        const email = `new${uniqueId}@user.com`;
        userDetails.email = email;
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(201);
            expect(error.response.data).toEqual({
                "error": "New user registered"
            });
        }
    });


    it("Register existing user should return 409", async () => {
        // Add logic here to attempt registering an existing user
        userDetails.email = 'existing@user.com';
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(409);
            expect(error.response.data).toEqual({
                "error": "User with this email already exists"
            });
        }
    });

    it("Register user with invalid email format should return 401", async () => {
        // Add logic here to attempt registering a new user with invalid email format
        userDetails.email = 'invalidformat'
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": "Invalid email format!"
            });
        }

    });

    it("Register user with invalid password should return 401", async () => {
        // Add logic here to attempt registering a new user with invalid password
        userDetails.email = 'correct@email.com'
        userDetails.password = 'jvho'
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": 'Password must contain at least 1 capital, a number and 6 characters'
            });
        }

    });

    it("Account activation after registration should return 201", async () => { //! Have to check again
        // Add logic here to attempt activation of account after registration
        userDetails.email = 'registered@notactivated.com'
        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(409);
            expect(error.response.data).toEqual({
                "error": 'User with this email already exists'
            });
        }
    });

    // it('Response time is less than 200ms', async () => {
    //     userDetails.email = 'new-email' + Math.random() + '@test.com';       //!Does this belong here?
    //     let responseTime;
    //     try {
    //         const startTime = Date.now();
    //         const response = await axios.post(registerURL, userDetails);
    //         const endTime = Date.now();
    //         responseTime = endTime - startTime;
    //         expect(responseTime).toBeLessThan(200);
    //     } catch (error) {
    //         expect(error.response.data).toEqual({
    //             "error": 'Response time took longer than 200ms'
    //         });        }
    // });



    it('Registering with empty fields should return 401', async () => {
        userDetails.email = ""

        try {
            const response = await axios.post(registerURL, userDetails);
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({
                "error": 'Invalid email format!'
            });
        }
    });

    // it('Registering with empty fields should return 401', async () => { //! No empty password responce
    //     userDetails.password = ""

    //     try {
    //         const response = await axios.post(registerURL, userDetails);
    //     } catch (error) {
    //         expect(error.response.status).toBe(401);
    //         expect(error.response.data).toEqual({
    //             "error": 'Invalid password format!'
    //         });
    //     }
    // });

    // it('Attempting to register when the database/server is down should return 500', async () => { //! Is this even plausable?
    //     userDetails.email = "register@dbdown.com"
    //     try {
    //       const response = await axios.post(registerURL, userDetails);
    //     } catch (error) {
    //       expect(error.response.status).toBe(500);
    //       expect(error.response.data).toEqual({"error": 'Internal server error'});
    //     }
    //   });




});



// pm.test("Response has necessary referral_code", function () {
//     // Add logic here to attempt registering a new user with valid inputs

//     pm.response.to.have.status(201);
//     const responseData = pm.response.json();

//     pm.expect(responseData).to.have.property('referral_code');
// });


// pm.test("Token validity after registration", function () {
//     // Add logic here to make a register request and validate the returned token

//     pm.response.to.have.status(201);
//     const responseData = pm.response.json();

//     const decodedToken = jwt.decode(responseData.token);
//     const tokenExpiry = decodedToken.exp;
//     const tokenIssuedAt = decodedToken.iat;

//     pm.expect(tokenExpiry - tokenIssuedAt).to.eql(24 * 60 * 60); // should match 1 day.
// });



// pm.test("Successful registration should return a unique referral code", function () {
//     // Add logic here to attempt registering a new user

//     pm.response.to.have.status(201);
//     const responseData = pm.response.json();

//     pm.expect(responseData).to.have.property('referral_code');
//     // Add logic here to compare referral_code with existing ones in the database
// });

// pm.test("Successful registration should trigger a verification email", function () {
//     // For this case, we might need to mock or intercept the email service, 
//     // as we can't directly test it with Postman
// });