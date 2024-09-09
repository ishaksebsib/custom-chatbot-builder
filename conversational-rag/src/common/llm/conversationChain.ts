import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import llm from "./baseLlm";
import { logger } from "@/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

const conversationChain = async (file_name: string) => {
	try {
		logger.info("ConversationChain Started");
		logger.info(`ConversationChain File Name : ${file_name}`);

		const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
		const pdf_path = path.resolve(
			__dirname,
			"../../assets/pdf",
			`${file_name}.pdf`,
		);
		const loader = new PDFLoader(pdf_path, { splitPages: false });
		const docs = await loader.load();

		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const splits = await textSplitter.splitDocuments(docs);

		const vectorStore = new Chroma(new OpenAIEmbeddings(), {
			collectionName: "conversation",
		});

		await vectorStore.addDocuments(splits);

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
