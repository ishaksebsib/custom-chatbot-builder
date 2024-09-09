import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

const conversationStore = new Chroma(new OpenAIEmbeddings(), {
  collectionName: "conversation",
});

export default conversationStore; 
