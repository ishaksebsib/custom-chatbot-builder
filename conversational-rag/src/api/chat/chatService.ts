import conversationChain from "@/common/llm/conversationChain";
import { logger } from "@/server";

class ChatService {
	public fileName: string;
	constructor(fileName: string) {
		this.fileName = fileName;
	}

	public async askQuestion(question: string) {
		const { ragChain, conversationRetriever } = await conversationChain(
			this.fileName,
		);

		if (!ragChain || !conversationRetriever) {
			throw new Error("ChatService Initialization Error");
		}

		try {
			return ragChain.stream({
				context: await conversationRetriever.invoke(question),
				question: question,
			});

		} catch (error) {
			logger.error(`ChatService Error: ${error as string}`);
			throw new Error(`ChatService Error: ${error as string}`);
		}
	}
}

export default ChatService;
