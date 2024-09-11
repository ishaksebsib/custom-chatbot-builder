import { Request, Response } from "express";
import { userService } from "./userService";

class UserController {
	public async getUsers(_req: Request, res: Response) {
		const serviceResponse = await userService.getAllUsers();
		res.status(200).json(serviceResponse);
	}

	public async getUserById(req: Request, res: Response) {
		const { id } = req.params;
		const serviceResponse = await userService.getUserById(id);
		res.status(200).json(serviceResponse);
	}

	public async updateUser(req: Request, res: Response) {
		const { id } = req.params;
		const serviceResponse = await userService.updateUser(id, req.body);
		res.status(200).json(serviceResponse);
	}

	public async deleteUser(req: Request, res: Response) {
		const { id } = req.params;
		const serviceResponse = await userService.deleteUser(id);
		res.status(200).json(serviceResponse);
	}
}

export const userController = new UserController();
