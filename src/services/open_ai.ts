import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // solo pruebas locales
});

export async function askOpenAI(question: string): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content: "Eres un asistente experto en IA, datos, LLMs, RAG y desarrollo de software."
      },
      {
        role: "user",
        content: question
      }
    ]
  });

  return response.output_text ?? "Sin respuesta";
}
