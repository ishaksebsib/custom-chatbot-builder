import UserRepository from "./userRepository";

class UserService {
	private _userRepo: UserRepository;

	constructor(usrRepository: UserRepository = new UserRepository()) {
		this._userRepo = usrRepository;
	}

	async getAllUsers() {
		return this._userRepo.findAll();
	}

	async getUserById(id: string) {
		return this._userRepo.findById(id);
	}

	async getUserByEmail(email: string) {
		return this._userRepo.findByEmail(email);
	}

	async updateUser(id: string, user: any) {
		return this._userRepo.update(id, user);
	}

	async deleteUser(id: string) {
		return this._userRepo.delete(id);
	}
}

export const userService = new UserService();
