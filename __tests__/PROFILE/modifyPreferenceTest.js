// Test for status code
pm.test("Response status code is 202", function () {
    pm.expect(pm.response.code).to.equal(202);
});

// Test for required field - message
pm.test("Response has the required field - message", function () {
    const responseData = pm.response.json();
    pm.expect(responseData.message).to.exist.and.to.be.a('string');
});

// Test for message content
pm.test("Response message is correct", function () {
    const responseData = pm.response.json();
    pm.expect(responseData.message).to.equal("Profile's preferences successfully modified");
});

// Test for error field, it should not exist in a successful request
pm.test("Response error field does not exist", function () {
    const responseData = pm.response.json();
    pm.expect(responseData.error).to.not.exist;
});

// Test for failure due to missing userId
pm.test("Response for missing user id", function () {
    pm.environment.set("userId", ""); // Set userId as empty
    const responseData = pm.response.json();
    pm.expect(pm.response.code).to.equal(400);
    pm.expect(responseData.error).to.exist.and.to.be.a('string');
    pm.expect(responseData.error).to.equal("Please provide the user id in the URL");
});

// Test for failure due to missing profileId
pm.test("Response for missing profile id", function () {
    pm.environment.set("profileId", ""); // Set profileId as empty
    const responseData = pm.response.json();
    pm.expect(pm.response.code).to.equal(400);
    pm.expect(responseData.error).to.exist.and.to.be.a('string');
    pm.expect(responseData.error).to.equal("Please provide the profile id in the URL");
});

// Test for failure due to non-existent user
pm.test("Response for non-existent user", function () {
    pm.environment.set("userId", "non_existent_id"); // Set userId as non-existent
    const responseData = pm.response.json();
    pm.expect(pm.response.code).to.equal(401);
    pm.expect(responseData.message).to.exist.and.to.be.a('string');
    pm.expect(responseData.message).to.equal("No profile found for this id");
});

// Test for failure due to non-existing profile
pm.test("Response for non-existent profile", function () {
    pm.environment.set("userId", "existing_user_id"); // Set userId as existing
    pm.environment.set("profileId", "non_existing_profile_id"); // Set profileId as non-existing

    const responseData = pm.response.json();

    pm.expect(pm.response.code).to.equal(401);
    pm.expect(responseData.message).to.exist.and.to.be.a('string');
    pm.expect(responseData.message).to.equal("No profile found");
});

// Test for failure due to incorrect content type
pm.test("Response for incorrect content type", function () {
    const request = pm.request;

    request.updates.headers["Content-Type"] = "application/xml"; // Set incorrect Content-Type

    const responseData = pm.response.json();

    pm.expect(pm.response.code).to.equal(406);
    pm.expect(responseData.error).to.exist.and.to.be.a('string');
    pm.expect(responseData.error).to.equal("Invalid content type");
});

// Test for case when no preferences were modified
pm.test("Response when no preferences were modified", function () {
    // Making the request body same as the existing preferences
    const requestBody = {
        content_type: "existing_content_type",
        genre: "existing_genre",
        minimum_age: "existing_minimum_age",
        viewing_classification: "existing_viewing_classification"
    }

    const responseData = pm.response.json();
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(responseData.message).to.exist.and.to.be.a('string');
    pm.expect(responseData.message).to.equal("No preferences were modified");
});