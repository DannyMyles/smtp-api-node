const helper = require('../../helpers/helpers')
const User = require('../../models/userModel')
const bcrypt = require('bcryptjs')
const asyncWrapper = require('../../middleware/asyncWrapper')
const HTTP_STATUS_CODES = require('../../utils/statusCodes')
const jwt = require('jsonwebtoken')
const { sendVerificationEmail } = require('../../utils/sendEmail')


// Signup User
const signUp = asyncWrapper(async (req, res) => {
  try {
    const { method, email, password, rememberMe } = req.body;
    if (!method) {
      return helper.sendError(
        HTTP_STATUS_CODES.FORBIDDEN,
        res,
        { error: "Invalid method" },
        req
      );
    }

    if (method === "custom_email") {
      if (!helper.validateEmail) {
        return helper.sendError(
          HTTP_STATUS_CODES.FORBIDDEN,
          res,
          { error: "Please enter a valid Email address." },
          req
        );
      }
      if (!email) {
        return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {
          error: "Email cannot be empty.",
          req,
        });
      }
      if (!password) {
        return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {
          error: "Please enter a password.",
          req,
        });
      }
      // find whether there is already a user with the provided email
      const user = await User.findOne({ email });
      if (user) {
        return helper.sendError(
          HTTP_STATUS_CODES.FORBIDDEN,
          res,
          { error: "This email already exists." },
          req
        );
      }

      // If the user with the provided email, we need to validate the other required fields
      if (!user) {
        // Validate other required fields for new user
        const userData = req.body;
        if (!userData.first_name) {
          return helper.sendError(
            HTTP_STATUS_CODES.FORBIDDEN,
            res,
            { error: "Please enter a valid first name." },
            req
          );
        }

        if (!userData.last_name) {
          return helper.sendError(
            HTTP_STATUS_CODES.FORBIDDEN,
            res,
            { error: "Please enter a valid last name." },
            req
          );
        }

        if (!userData.dob) {
          return helper.sendError(
            HTTP_STATUS_CODES.FORBIDDEN,
            res,
            { error: "Please enter date of birth." },
            req
          );
        }

        if (!userData.gender) {
          return helper.sendError(
            HTTP_STATUS_CODES.FORBIDDEN,
            res,
            { error: "Please enter gender." },
            req
          );
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({
          ...userData,
          dob: new Date(userData.dob),
          password: hassPassword,
          rememberMe,
          role_id: 0,
        });

        // assign the user token
        const token = jwt.sign({ user_id: newUser }, process.env.JWT_SECRET, {
          expiresIn: "5m",
        });

        await User.findOneAndUpdate(
          { _id: newUser._id },
          { verifyToken: token },
          { new: true, runValidators: false, useFindAndModify: false }
        );
      }

      // Send Email
      // await sendVerificationEmail(email, token);

      return helper.sendSuccess(res, "Email sent", req, "Success");
    } else if (method === "custom_phone") {
      const userData = req.body;
      if (!userData.mobile) {
        return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {
          error: "Please enter a valid phone number.",
        });
      }
      if (!helper.validatePhone) {
        return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {
          error: "Please enter a valid phone number.",
        });
      }

      // find whether there is an existing user with the provided phone no.'
      const user = await User.findOne({ mobile: userData.mobile });
      if (user) {
        return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {
          error: "This phone number already exists.",
        });
      }
      // If the user with the provided phone no., we need to validate the other required fields and then create a new user account for them.
      if (!user) {
        if (!userData.password) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid password." },
            req
          );
        }

        if (!userData.first_name) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid first name." },
            req
          );
        }

        if (!userData.last_name) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid last name." },
            req
          );
        }

        if (!userData.dob) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter date of birth." },
            req
          );
        }

        if (!userData.gender) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter gender" },
            req
          );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        // const response = await sendOTP(userData.mobile, "Your OTO is: ")
        if (response.success) {
          const new_user = await User.create({
            ...userData,
            dob: new Date(userData.dob),
            password: hashedPassword,
            rememberMe,
            role_id: 0,
          });

          const token = jwt.sign(
            { user_id: new_user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "3m",
            }
          );

          await User.findOneAndUpdate(
            { _id: new_user._id },
            { verifyToken: token },
            { new: true, runValidators: false, useFindAndModify: false }
          );

          return helper.sendSuccess(res, "OTP sent", req, "Success");
        } else {
          console.log("AUTH CONTROLLER ->", response);

          return helper.sendError(
            400,
            res,
            { error: "Failed to send OTP" },
            req
          );
        }
      } else {
        return helper.sendError(400, res, { error: "Invalid method" }, req);
      }
    }
  } catch (error) {
    console.error(error);
    return helper.sendError(500, res, { error: "An error occurred" }, req);
  }
});

const login = asyncWrapper(async (req, res) => {
  const { email, password, method, mobile, rememberMe } = req.body;
  if (!method) {
    return helper.sendError(
      HTTP_STATUS_CODES.FORBIDDEN,
      res,
      { error: "Invalid method" },
      req
    );
  }
  if (method === "custom_email") {
    if (!helper.validateEmail(email)) {
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid email address." },
        req
      );
    }

    if (!email)
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid email address." },
        req
      );
    else if (!password)
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid password." },
        req
      );
    const user = await User.findOne({ email: email }).select("+password");
    if (!user)
      return helper.sendError(403, res, { error: "User not exists" }, req);

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return helper.sendError(403, res, { error: "Invalid Credentials" }, req);

    if (!user.emailVerified) {
      return helper.sendError(
        403,
        res,
        { error: "Please verify your email" },
        req
      );
    }

    await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        rememberMe: rememberMe,
      },
      {
        new: true,
      }
    );

    createSession(user, req, res, rememberMe);
  } })

  // const logout = catchAsyncFunc(async (req, res, next) => {
  //   const authHeader = req.get("Authorization");
  //   if (!authHeader)
  //     return helper.sendError(
  //       403,
  //       res,
  
  //       { error: "Not authenticated" },
  //       req
  //     );
  //   const token = authHeader.split(" ")[1];
  //   let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //   const result = await Session.findOneAndDelete({ user: decodedToken.user_id });
  
  //   return helper.sendSuccess(res, result, req, "Success");
  // });
module.exports = { signUp, login }