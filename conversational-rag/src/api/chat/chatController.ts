import { Request, Response } from "express";
import ChatService from "./chatService";

class ChatController {
	public async getAnswer(req: Request, res: Response) {
		const { quesstion: question } = req.body;

		if (!question) {
			return res.status(500).json({ error: "quesstion required!" })
		}

		try {
			const chatService = new ChatService(
				"https://www.britannica.com/biography/Abiy-Ahmed",
			);
			const response = await chatService.askQuestion(question);
			res.status(200).json(response);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

export const chatController = new ChatController();
