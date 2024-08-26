const allRoles = {
  doctor: ["currentUser", "createOrUpdateUser", "updateDoctor"],
  patient: ["currentUser", "createOrUpdateUser"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
