"use server"
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

const INDEX_NAME = "know-sources";
const EMBEDDING_MODEL = 'text-embedding-3-small';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    encoding_format: "float",
  });

  return response.data[0].embedding;
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ||"",
});

const index = pc.index(INDEX_NAME);

export const listIndexes = async () => pc.listIndexes();

export const embed = async (text: string) => {
  return getEmbedding(text);
};

type Vector = {
    id: string;
    values: number[];
    metadata?: any;
    //sparseValues?: { indices: number[]; values: number[] };
};

export const upsert = async (vectors: Vector[]) => {
    return index.upsert(vectors);
};
