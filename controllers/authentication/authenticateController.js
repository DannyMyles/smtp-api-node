const helper = require('./../../helpers/helpers')
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
    if(!method){
        return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {error: "Invalid method"}, req)
    }

    if(method === "custom_email"){
        if(!helper.validateEmail){
            return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN,res, { error: "Please enter a valid Email address."}, req)
        }
        if(!email){
            return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, { error: "Email cannot be empty.", req})
        }
        if(!password){
            return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, { error: "Please enter a password.", req})
        }
        // find whether there is already a user with the provided email
        const user = await User.findOne({email})
        if(user){
            return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN, res, {error: "This email already exists."}, req)
        }

        // If the user with the provided email, we need to validate the other required fields
        if (!user) {
            // Validate other required fields for new user
            const userData = req.body;
            if (!userData.first_name) {
                return helper.sendError(HTTP_STATUS_CODES.FORBIDDEN,res,{ error: "Please enter a valid first name." },req);
            }
    
            if (!userData.last_name) {
              return helper.sendError( HTTP_STATUS_CODES.FORBIDDEN, res,{ error: "Please enter a valid last name." }, req);
            }
    
            if (!userData.dob) {
              return helper.sendError( HTTP_STATUS_CODES.FORBIDDEN,res,{ error: "Please enter date of birth." },req );
            }
    
            if (!userData.gender) {
              return helper.sendError( HTTP_STATUS_CODES.FORBIDDEN, res, { error: "Please enter gender." },req);
            }

            // Hashing the password 
            const salt = await bcrypt.genSalt(10)
            const hassPassword = await bcrypt.hash(password, salt)
    
            // create user
            const newUser = await User.create({
                ...userData,
                dob: new Date(userData.dob),
                password: hassPassword,
                rememberMe,
                role_id: 0
            })

            // assign the user token
            const token = jwt.sign(
                {user_id: newUser},
                process.env.JWT_SECRET,
                {expiresIn: "5m"}
            )

            await User.findOneAndUpdate(
              { _id: newUser._id },
              { verifyToken: token },
              { new: true, runValidators: false, useFindAndModify: false }
            );
        }

        // Send Email 
        await sendVerificationEmail(email, token);

        return helper.sendSuccess(res, "Email sent", req, "Success");
  } 
}
catch (error) {}});


module.exports = { signUp }