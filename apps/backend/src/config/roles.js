const allRoles = {
  admin: ["currentUser", "createOrUpdateUser", "updateDoctor"],
  doctor: ["currentUser", "createOrUpdateUser", "updateDoctor"],
  patient: ["currentUser", "createOrUpdateUser"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
