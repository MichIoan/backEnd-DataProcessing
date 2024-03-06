// checking for successful delete response
pm.test("Response status code is 204 on successful delete", function () {
    pm.expect(pm.response.code).to.equal(204);
});

pm.test("Response body is empty on successful delete", function () {
    pm.expect(pm.response.text()).to.eql("");
});

// checking for a case when the userId is not provided
pm.test("Response status code is 401 when userId is not provided", function () {
    pm.expect(pm.response.code).to.equal(401);
});

pm.test("Response has the correct error message when userId is not provided", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("Please provide the user id in the URL");
});

// checking for a case when the profileId is invalid
pm.test("Response status code is 401 when profileId is not valid", function () {
    pm.expect(pm.response.code).to.equal(401);
});

pm.test("Response has the correct error message when profileId is not valid", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("Please provide the profile id in the URL");
});

// checking for a case when there is no profile for the provided profileId
pm.test("Response status code is 404 when no profile is found for the given profileId", function () {
    pm.expect(pm.response.code).to.equal(404);
});

pm.test("Response has the correct error message when no profile is found for the given profileId", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("No profile found with this name");
});

// checking for internal server error 
pm.test("Response status code is 500 when internal server error occurs", function () {
    pm.expect(pm.response.code).to.equal(500);
});

pm.test("Response has the correct error message when internal server error occurs", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("Internal server error");
});

// checking for a case when a profileId is not provided
pm.test("Response status code is 401 when profileId is not provided", function () {
    pm.expect(pm.response.code).to.equal(401);
});

pm.test("Response has the correct error message when profileId is not provided", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("Please provide the profile id in the URL");
});

// checking for a case when the userId is not valid
pm.test("Response status code is 401 when userId is not valid", function () {
    pm.expect(pm.response.code).to.equal(401);
});

pm.test("Response has the correct error message when userId is not valid", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("Please provide the user id in the URL");
});

// checking for a case when there is no user for the provided userId
pm.test("Response status code is 401 when no user is found for the given userId", function () {
    pm.expect(pm.response.code).to.equal(401);
});

pm.test("Response has the correct error message when no user is found for the given userId", function () {
    const responseData = pm.response.json();

    pm.expect(responseData.error).to.eql("No user found with this id");
});

// checking response headers for successful delete
pm.test("Content-Type header is present", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.be.ok;
});

pm.test("Content-Type header is application/json", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});