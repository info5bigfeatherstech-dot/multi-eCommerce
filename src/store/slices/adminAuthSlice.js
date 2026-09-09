import { createSlice } from "@reduxjs/toolkit";

const getInitialAuthState = () => {
  try {
    const saved = localStorage.getItem("apexmart_admin_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.isAuthenticated) {
        return {
          isAuthenticated: true,
          adminUser: parsed.adminUser || {
            name: "Super Administrator",
            email: "admin@apexmart.com",
            role: "Master Admin",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          },
        };
      }
    }
  } catch (e) {
    console.error("Failed to parse admin auth:", e);
  }
  return {
    isAuthenticated: false,
    adminUser: null,
  };
};

const initialState = getInitialAuthState();

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogin: (state, action) => {
      const { email, name, role } = action.payload || {};
      state.isAuthenticated = true;
      state.adminUser = {
        name: name || "Super Administrator",
        email: email || "admin@apexmart.com",
        role: role || "Master Admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
      try {
        localStorage.setItem(
          "apexmart_admin_auth",
          JSON.stringify({
            isAuthenticated: true,
            adminUser: state.adminUser,
          })
        );
      } catch (e) {
        console.error("Failed to save admin auth to localStorage:", e);
      }
    },
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.adminUser = null;
      try {
        localStorage.removeItem("apexmart_admin_auth");
      } catch (e) {
        console.error("Failed to remove admin auth:", e);
      }
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
