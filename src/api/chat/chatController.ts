import { Request, Response } from "express";
import ChatService from "./chatService";

class ChatController {
	public async getAnswer(req: Request, res: Response) {
		const { question: question } = req.body;

		if (!question) {
			return res.status(500).json({ error: "question required!" });
		}

		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
		});

		try {
			const chatService = new ChatService("cbe");

			const reponseStream = await chatService.askQuestion(question);

			for await (const response of reponseStream) {
				res.write(response);
			}

			res.end();
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

export const chatController = new ChatController();
