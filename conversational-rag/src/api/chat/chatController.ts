import { Request, Response } from "express";
import ChatService from "./chatService";

class ChatController {
	public async getAnswer(req: Request, res: Response) {
		try {
			const chatService = new ChatService(
				"https://en.wikipedia.org/wiki/Barack_Obama",
			);
			const response = await chatService.askQuestion(req.body.question);
			res.status(200).json(response);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

export const chatController = new ChatController();
