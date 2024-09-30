const { AutoRoles } = require("#db-objects");

function deleteRoleIfNotExists(guild, roleId) {
  if (!guild.roles.cache.get(roleId)) {
    AutoRoles.destroy({
      where: { guild: guild.id, role: roleId },
    });

    return true;
  }

  return false;
}

module.exports = { deleteRoleIfNotExists };
