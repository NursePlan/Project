export const Roles = {
    ADMIN: "Admin",
    USER: "User",
    GUEST: "Guest",
  };
  
  export const Permissions = {
    AdminPage: [Roles.ADMIN],
    UserPage: [Roles.ADMIN, Roles.USER],
    GuestPage: [Roles.ADMIN, Roles.USER, Roles.GUEST],
  };