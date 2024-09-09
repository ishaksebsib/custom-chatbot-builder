import { Request, Response } from "express";
import ChatService from "./chatService";

class ChatController {
	public async getAnswer(req: Request, res: Response) {
		const { question: question } = req.body;

		if (!question) {
			return res.status(500).json({ error: "question required!" })
		}

		try {
			const chatService = new ChatService(
				"cbe",
			);
			const response = await chatService.askQuestion(question);
			res.status(200).json(response);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

export const chatController = new ChatController();
