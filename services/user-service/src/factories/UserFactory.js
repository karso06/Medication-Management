class UserFactory {
  static createUser(payload) {
    const { role, fullName, email, phone } = payload;

    if (!role || !["patient", "caregiver"].includes(role)) {
      throw new Error("Invalid role. Supported roles: patient, caregiver");
    }

    return {
      role,
      fullName,
      email,
      phone: phone || "",
    };
  }
}

module.exports = UserFactory;
