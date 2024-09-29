import { Request, Response } from "express";
import UserService from "./userService";

class UserController {
	private _userService: UserService;

	constructor(userService: UserService) {
		this._userService = userService;
	}

	public async getUsers(_req: Request, res: Response) {
		const serviceResponse = await this._userService.getAllUsers();
		res.status(200).json(serviceResponse);
	}

	public async getUserById(req: Request, res: Response) {
		const { id } = req.params;
		const serviceResponse = await this._userService.getUserById(id);
		res.status(200).json(serviceResponse);
	}

	public async updateUser(req: Request, res: Response) {
		const { id } = req.params;
		const serviceResponse = await this._userService.updateUser(id, req.body);
		res.status(200).json(serviceResponse);
	}

	public async deleteUser(req: Request, res: Response) {
		const { id } = req.params;
		const serviceResponse = await this._userService.deleteUser(id);
		res.status(200).json(serviceResponse);
	}
}

export default UserController;
