import express from "express";
import passport from "passport";

import { wrapAsync } from "../utils/wrapAsync.js";
import { savedRedirectUrl } from "../middleware.js";

import {
  renderSignupForm,
  renderLoginForm,
  signup,
  Login,
  Logout,
} from "../controller/users.js";

const router = express.Router();

//Signup Route
router.route("/signup").get(renderSignupForm).post(wrapAsync(signup));

//Login Routes
router
  .route("/login")
  .get(renderLoginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    Login
  );

// Logout Route
router.get("/logout", Logout);

export default router;
