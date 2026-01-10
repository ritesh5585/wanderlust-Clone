import User from "../models/user.js";

// ================= USER CONTROLLER =================
export const renderSignupForm = (req, res) => {
  res.render("users/signup");
};

export const renderLoginForm = (req, res) => {
  res.render("users/login");
};

// =================  SIGNUP LOGIC =================
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      req.flash("error", "All fields are required");
      res.redirect("/signup");
      return;
    }

    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to WanderLusr!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
// =================  LOGIN SUCCESS =================
export const Login = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.returnTo || "/listings");
};

// =================  LOGOUT =================
export const Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
