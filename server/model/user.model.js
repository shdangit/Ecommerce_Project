const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt"); // Erase if already required
const crypto = require("crypto"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //   required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
    heartlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //    this.isModified("password")
  //   --> true: password have change
  //   --> false: password don't have change
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  },
  createPasswordChangeToken: function () {
    const passwordToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(passwordToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return passwordToken;
  },
};
module.exports = mongoose.model("User", userSchema);
