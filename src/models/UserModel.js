import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = { USER: "User", ADMIN: "Admin" };

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			required: false,
		},
		role: {
			type: String,
			required: true,
			enum: Object.values(ROLES),
			default: ROLES.USER,
		},
		profilePicture: {
			type: String,
			required: false,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		resetPasswordOTP: String,
		resetPasswordOTPExpiresAt: Date,
	},
	{ timestamps: true }
);

// Mongoose 9 hooks are promise-based (no next()); only hash when the password changed
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
  
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User