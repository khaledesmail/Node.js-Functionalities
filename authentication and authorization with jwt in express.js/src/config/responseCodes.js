const responseCode = {
    "01": {
        status: 200,
        body: {
            success: true,
            message: "You are already logged in",
            data: {}
        }
    },
    "02": {
        status: 401,
        body: {
            success: false,
            message: "Auth failed, password doesn't match",
            data: {}
        }
    },
    "03": {
        status: 200,
        body: {
            success: true,
            message: "You have been signed in successfully",
            data: {}
        }
    },
    "04": {
        status: 400,
        body: {
            success: false,
            message: "Something went wrong when you tried generate a token",
            data: {}
        }
    },
    "05": {
        status: 404,
        body: {
            success: false,
            message: 'Auth failed, email not found',
            data: {}
        }
    },
    "06": {
        status: 200,
        body: {
            success: true,
            message: "Data has been saved successfully and verfication code sent to email",
            data: {}
        }
    },
    "07": {
        status: 500,
        body: {
            success: false,
            message: 'Unexpected server error',
            data: {}
        }
    },
    "08": {
        status: 200,
        body: {
            success: true,
            message: 'Active jobs have been retrieved successfully',
            data: {}
        }
    },
    "09": {
        status: 200,
        body: {
            success: true,
            message: 'Image has been retrieved successfully',
            data: {}
        }
    },
    "10": {
        status: 500,
        body: {
            success: false,
            message: 'Something went wrong with dataBase "MongoDb"',
            data: {}
        }
    },
    "11": {
        status: 200,
        body: {
            success: true,
            message: 'User email has been verified. Please sign in.',
            data: {}
        }
    },
    "12": {
        success: true,
        message: 'Password has been rested successfully',
        data: {}
    },
    "13": {
        status: 200,
        body: {
            success: true,
            message: 'Verfication code has been sent to email to rest password',
            data: {}
        }
    },
    "14": {
        status: 200,
        body: {
            success: true,
            message: 'Token has been verified successfully',
            data: {}
        }
    },
    "15": {
        status: 200,
        body: {
            success: true,
            message: 'job is updated successfully',
            data: {}
        }
    },
    "16": {
        status: 200,
        body: {
            success: true,
            message: 'Email is confirmed successfully',
            data: {}
        }
    },
    "17": {
        status: 400,
        body: {
            success: false,
            message: 'Missed required header value',
            data: {}
        }
    },
    "18": {
        status: 404,
        body: {
            success: false,
            message: 'Token is not exists',
            data: {}
        }
    },
    "19": {
        status: 200,
        body: {
            success: true,
            message: 'Email is confirmed successfully',
            data: {}
        }
    }
};

module.exports = responseCode;