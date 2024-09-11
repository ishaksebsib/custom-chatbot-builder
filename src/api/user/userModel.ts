import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
	updateAt: {
		type: Date,
		default: Date.now,
	},
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
