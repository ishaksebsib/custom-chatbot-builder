import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import Chain from "./Chain";
import { logger } from "@/server";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";

class ConversationChain {
  private chain: Chain;

  constructor(
    private llm: ChatOpenAI<ChatOpenAICallOptions>,
    private vectorStore: Chroma,
    private config: { chunkSize: number; chunkOverlap: number } = {
      chunkSize: 1000,
      chunkOverlap: 0,
    },
  ) {
    this.chain = new Chain(this.vectorStore, this.config);
  }

  // Main function to create conversation chain
  async create(fileName: string) {
    try {
      logger.info("ConversationChain Started");
      logger.info(`Processing File: ${fileName}`);

      // Load Prompt
      const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

      // Load and Split PDF Documents
      const docs = await this.chain.loadPdf(fileName);
      const splits = await this.chain.splitDocuments(docs);

      // Add Documents to Vector Store
      await this.chain.addDocument(splits);

      // Get Vector Store Retriever
      const retriever = this.chain.retrive();

      // Create Chain
      const chain = await this.createConversationChain(prompt);

      logger.info("ConversationChain Completed");

      return { conversationChain: chain, conversationRetriever: retriever };
    } catch (error: any) {
      logger.error(`ConversationChain Error: ${error.message}`, error);
      throw new Error(`ConversationChain Error: ${error.message}`);
    }
  }

  // Create the chain using LLM and prompt
  private createConversationChain(prompt: ChatPromptTemplate) {
    return createStuffDocumentsChain({
      llm: this.llm,
      prompt,
      outputParser: new StringOutputParser(),
    });
  }
}

export default ConversationChain;
