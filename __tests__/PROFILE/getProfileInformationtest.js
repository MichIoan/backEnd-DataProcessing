const url = 'http://localhost:8081/users/37/profiles/56/modify-preferences';

// Test that the status code is 200 and the response is of JSON type
pm.test("Response status code is 200 and response is json", function () {
    pm.response.to.have.status(200);
    pm.response.to.be.json;
});

// Test that the response has profile object
pm.test("Response has profile object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.profile).to.be.an('object');
});

// Test that profile in response contains required fields
pm.test("Profile object consists required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.profile).to.include.all.keys('user_id', 'name', 'photo_path', 'child_profile', 'preferences', 'date_of_birth', 'language');
});

// Test error status code is 401 for missing user id
pm.test("Status code is 401 for missing user id", function () {
    pm.response.to.have.status(401);
    pm.expect(pm.response.text()).to.include('Please provide the user id as a parameter in the URL');
});

// Test error status code is 401 for missing profileId
pm.test("Status code is 401 for missing profileId", function () {
    pm.response.to.have.status(401);
    pm.expect(pm.response.text()).to.include('Please provide the profileId as a parameter in the URL');
});

// Test error status code is 401 for non exiting user
pm.test("Status code is 401 for non exiting user", function () {
    pm.response.to.have.status(401);
    pm.expect(pm.response.text()).to.include('No user found with this id');
});

// Test error status code is 401 for non exiting profile
pm.test("Status code is 401 for non exiting profile", function () {
    pm.response.to.have.status(401);
    pm.expect(pm.response.text()).to.include('No profile found with this id');
});

// Test error status code is 500 for server error
pm.test("Status code is 500 for server error", function () {
    pm.response.to.have.status(500);
    pm.expect(pm.response.text()).to.include('Internal server error');
});

// Test if the profile object in response contains correct types of fields
pm.test("Profile object contains correct types of fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.profile.user_id).to.be.a('number');
    pm.expect(jsonData.profile.name).to.be.a('string');
    pm.expect(jsonData.profile.photo_path).to.be.a('string');
    pm.expect(jsonData.profile.child_profile).to.be.a('boolean');
    pm.expect(jsonData.profile.preferences).to.be.a('array');
    pm.expect(jsonData.profile.date_of_birth).to.be.a('string');
    pm.expect(jsonData.profile.language).to.be.a('string');
});

// Test if profile's user_id matches the requested user_id
pm.test("Profile's user_id matches requested user_id", function () {
    var jsonData = pm.response.json();
    // replace 'requested_user_id' with the actual user_id used in the request
    pm.expect(jsonData.profile.user_id).to.equal('requested_user_id');
});

// Test if profile exists for the requested profile_id
pm.test("Profile exists for requested profile_id", function () {
    var jsonData = pm.response.json();
    // replace 'requested_profile_id' with the actual profile_id used in the request
    pm.expect(jsonData.profile.profile_id).to.equal('requested_profile_id');
});

// Test if profile data is not null
pm.test("Profile data is not null", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.profile).to.not.be.null;
});

// Test if there is no extra data in response
pm.test("There is no extra data in response", function () {
    var jsonData = pm.response.json();
    pm.expect(Object.keys(jsonData).length).to.equal(1);
});