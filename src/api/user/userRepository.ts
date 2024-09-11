import UserModel from "./userModel";

class UserRepository {
	private _user: typeof UserModel;

	constructor(userModel: typeof UserModel = UserModel) {
		this._user = userModel;
	}

	async findAll() {
		return this._user.find({});
	}

	async findById(id: string) {
		return this._user.findById(id);
	}

	async findByEmail(email: string) {
		return this._user.findOne({ email });
	}

	async update(id: string, user: any) {
		return this._user.findByIdAndUpdate(id, user, { new: true });
	}

	async delete(id: string) {
		return this._user.findByIdAndDelete(id);
	}
}

export default UserRepository;
