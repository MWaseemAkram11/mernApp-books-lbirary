const User = require("../models/users.model");

/**
 * Register user
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    console.log(`call is connected-----`)
    let { name, type, email, password } = req.body;
    if (name && email && password && type) {
      email = email.toLowerCase();
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(200)
          .send({ status: false, message: "User already exists" });
      }
      let payload = {
        name,
        type,
        email,
        password,
      };
      user = await User.create(payload);
      return res.status(200).send({
        status: true,
        message: "User registered successfully",
        data: payload,
      });
    } else
      return res
        .status(200)
        .send({ status: false, message: "Required fields are missing" });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns jwt token if valid address and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    let { email, password} = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email }).lean();
    if (!user)
      return res
        .status(200)
        .send({ success: false, message: "Incorrect email or password" });
    else if(user && password === user.password)
      return res
        .status(200)
        .send({ success: false, message: "User loggedIn successfully" });
    else{
      return res
        .status(200)
        .send({ success: false, message: "Something wrong" });
    }
  } catch (error) {
    return next(error);
  }
};

