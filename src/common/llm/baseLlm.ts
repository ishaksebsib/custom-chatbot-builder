import "cheerio";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/common/utils/envConfig";

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  apiKey: env.OPENAI_API_KEY,
});

export default llm;
