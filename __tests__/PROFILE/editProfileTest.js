// Test that status code is 200
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

// Test response is JSON
pm.test("Response is of type json", () => {
    pm.response.to.be.json;
});

// Test that response has the required message field
pm.test("Response has the required message field", () => {
    const responseData = pm.response.json();
    pm.expect(responseData.message).to.exist.and.to.be.a('string');
});

// Test message is 'Profile updated successfully!'
pm.test("Message indicates success", () => {
    const responseData = pm.response.json();
    pm.expect(responseData.message).to.eql('Profile updated successfully!');
});

// Test that response has no error field
pm.test("Response should not have an error field", () => {
    const responseData = pm.response.json();
    pm.expect(responseData.error).to.not.exist;
});


// Now, let's do negative tests:


// Test that 401 is returned for unauthorized request
pm.test("Status code is 401 for unauthorized request", () => {
   pm.response.to.have.status(401);
});

// Test that 404 is returned when profile not found
pm.test("Status code is 404 for non-existent profile", () => {
   pm.response.to.have.status(404);
});

// Test invalid userId returns error
pm.test("Invalid userId returns error", () => {
    const responseData = pm.response.json();
    pm.expect(responseData.error).to.exist.and.to.eql('Please provide the user id in the URL');
});

// Test invalid profileId returns error
pm.test("Invalid profileId returns error", () => {
    const responseData = pm.response.json();
    pm.expect(responseData.error).to.exist.and.to.eql('Please provide the profile id in the URL');
});

// Test request with no parameters returns error
pm.test("Request with no parameters returns error", () => {
    const responseData = pm.response.json();
    pm.expect(responseData.error).to.exist.and.to.eql('Please provide the user id and profile id in the URL');
});