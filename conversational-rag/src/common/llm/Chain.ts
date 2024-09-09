import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { Chroma } from "@langchain/community/vectorstores/chroma";

class Chain {
  constructor(
    private vectorStore: Chroma,
    private config: { chunkSize: number; chunkOverlap: number }   
	) {}

  // Load PDF and return documents
  async loadPdf(fileName: string) {
    const pdfPath = path.resolve(
      __dirname,
      "../../assets/pdf",
      `${fileName}.pdf`,
    );
    const loader = new PDFLoader(pdfPath, { splitPages: false });
    return loader.load();
  }

  // Split documents based on provided configuration
  async splitDocuments(docs: any) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.config.chunkSize,
      chunkOverlap: this.config.chunkOverlap,
    });
    return textSplitter.splitDocuments(docs);
  }

  // Add documents to the vector store
  async addDocument(splits: any) {
    await this.vectorStore.addDocuments(splits);
  }

  // Retrieve the vector store retriever
  retrive() {
    return this.vectorStore.asRetriever();
  }
}

export default Chain;
