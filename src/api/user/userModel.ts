import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	createAt?: Date;
	updateAt?: Date;
}

const userSchema = new Schema<IUser>({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
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

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
