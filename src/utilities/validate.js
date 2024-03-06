
function isEmail(email) {
    if (!email) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

function isValidPassword(password) {
    if (!password) {
        return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    return passwordRegex.test(password);
}

module.exports = { isEmail, isValidPassword }