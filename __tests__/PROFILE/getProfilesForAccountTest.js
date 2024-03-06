// Testing for successful status code made by a valid request with existing account Id
pm.test("Response status code is 202 on valid request with existing account Id", function () {
    pm.expect(pm.response.code).to.equal(202);
});

// Testing for successful status code made by a valid request with non-existing account Id
pm.test("Response status code is 401 on valid request with non-existing account Id", function () {
    pm.expect(pm.response.code).to.equal(401);
});

// Check If profiles array exist in response's data
pm.test("Response should have profiles array", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.profiles).to.exist.and.be.an('array');
});

// Testing if every profile object in the array has a minimal set of required fields
pm.test("Every profile object should have necessary fields", function () {
    const responseJson = pm.response.json();
    responseJson.profiles.forEach(profile => {
        pm.expect(profile.user_id).to.exist;
        pm.expect(profile.name).to.exist;
        pm.expect(profile.photo_path).to.exist;
    });
});

// Testing for error status code when making request without account Id
pm.test("Response status code is 401 when account Id is not provided", function () {
    pm.expect(pm.response.code).to.equal(401);
});

// Testing for specific error message when making request without account Id
pm.test("Response has specific error message when account Id is not provided", function () {
    const responseData = pm.response.json();
    pm.expect(responseData.error).to.exist.and.to.equal('Please provide user id as parameter in the URL');
});

// Testing for response delay; assuming the allowed maximum delay is 200ms
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});