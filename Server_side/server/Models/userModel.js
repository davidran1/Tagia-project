const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a name is required"],
    },
    email: {
      type: String,
      required: [true, "an email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "a password is required"],
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      required: [true, "confirm password is required"],
      minlength: 8,
      //This only works in save
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords are not the same",
    },
    major: {
      type: String,
      required: true,
      enum: [
        "מדעי המחשב",
        "מתמטיקה שימושית",
        "הנדסת חשמל",
        "עיצוב",
        "הנדסת תעשיה וניהול",
      ],
    },
    year: {
      type: Number,
      required: [true, "a year is required"],
      enum: [1, 2, 3, 4],
    },
    role: {
      type: String,
      enum: ["User", "Admin", "EventOrganizer"],
      default: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    blocked: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    collection: "Users",
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compareSync(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
