const LDAP = require('./ldap');

async function updatePassword(email, newPassword) {
  try {
    const ldap = new LDAP();
    const updatedUser = await ldap.update(email, 'userPassword', newPassword);
    return updatedUser;
  } catch (err) {
    throw defaultErrorHandler(err, events.GeneralError(err.message));
  }
}
async function createUser(body) {
  try {
    const ldap = new LDAP();
    await ldap.createClient();
    const uniqueUserID = await ldap.create(body.email, body.mobileNumber, body.uniqueUserID);
    await updatePassword(body.email, body.password);
    return { username: body.email, uniqueUserID };
  } catch (err) {
    throw err;
  }
}
async function readUser(username) {
  try {
    const ldap = new LDAP();
    const user = await ldap.read('cn', username);
    console.log('User', user);
    const ldapusername = user[0];
    return { username: ldapusername };
  } catch (err) {
    console.log({ errorLDAP4: err });
    throw err;
  }
}
async function updateUser(body) {
  try {
    const ldap = new LDAP();

    let updatedUser;

    if (body.newPassword) {
      updatedUser = await ldap.update(body.username, 'userPassword', body.newPassword);
    } else if (body.newUsername) {
      updatedUser = await ldap.updateUsername(body.username, body.newUsername);
    }
    return updatedUser;
  } catch (err) {
    throw err;
  }
}
async function deleteUser(username) {
  try {
    const ldap = new LDAP();
    const deleteUserRes = await ldap.deleteUser(username);
    return deleteUserRes;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUser,
  readUser,
  updateUser,
  updatePassword,
  deleteUser
};