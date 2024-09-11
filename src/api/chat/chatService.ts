import llm from "@/common/llm/baseLlm";
import ConversationChain from "@/common/llm/conversationChain";
import conversationStore from "@/common/vectorStores/conversationStore";
import { logger } from "@/server";

class ChatService {
  public fileName: string;
  private convoChain: ConversationChain;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.convoChain = new ConversationChain(llm, conversationStore);
  }

  public async askQuestion(question: string) {
    const { conversationChain, conversationRetriever } =
      await this.convoChain.create(this.fileName);

    if (!conversationChain || !conversationRetriever) {
      throw new Error("ChatService Initialization Error");
    }

    try {
      return conversationChain.stream({
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
