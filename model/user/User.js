const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    designation: {
      type: String,
      // required: [true, "Designation is required"],
    },
    workPlace: {
      type: String,
      // required: [true, "Workplace is required"],
    },
    fatherName: {
      type: String,
      // required: [true, "Father's name is required"],
    },
    spouseName: {
      type: String,
      // required: [true, "Spouse's name is required"],
    },
    profession: {
      type: String,
      // required: [true, "Profession is required"],
    },
    positionHeld: {
      type: String,
      // required: [true, "Position held is required"],
    },
    specialIntrests: {
      type: String,
      // required: [true, "Special interests are required"],
    },
    phoneNo: {
      type: String,
      // required: [true, "Phone number is required"],
    },
    premanentAddress: {
      type: String,
      // required: [true, "Premanent address is required"],
    },
    communicationAddress: {
      type: String,
      // required: [true, "Communication address is required"],
    },

    password: {
      type: String,
      required: [true, "Hei buddy Password is required"],
    },

    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//virtual method to populate created post
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Verify account
userSchema.methods.createAccountVerificationToken = async function () {
  //create a token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return verificationToken;
};

//Password reset/forget

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return resetToken;
};

//Compile schema into model
const User = mongoose.model("User", userSchema);

module.exports = User;
