import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import llm from "./baseLlm";
import { logger } from "@/server";

const conversationChain = async (url: string) => {
	try {
		logger.info("ConversationChain Started");
		logger.info(`ConversationChain URL : ${url}`);
		const loader = new CheerioWebBaseLoader(url);
		const docs = await loader.load();

		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const splits = await textSplitter.splitDocuments(docs);
		const vectorStore = await MemoryVectorStore.fromDocuments(
			splits,
			new OpenAIEmbeddings(),
		);

		const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

		const conversationRetriever = vectorStore.asRetriever();
		const ragChain = await createStuffDocumentsChain({
			llm,
			prompt,
			outputParser: new StringOutputParser(),
		});
		logger.info("ConversationChain Completed");

		return { ragChain, conversationRetriever };
	} catch (error) {
		logger.error(`ConversationChain Error : ${error}`);
		throw new Error(`ConversationChain Error: ${error}`);
	}
};

export default conversationChain;
