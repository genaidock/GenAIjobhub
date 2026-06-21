const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash works:", result.response.text());
  } catch (e) {
    console.error("1.5-flash error:", e.message);
  }

  try {
    const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result2 = await model2.generateContent("Hello");
    console.log("gemini-1.5-pro works:", result2.response.text());
  } catch (e) {
    console.error("1.5-pro error:", e.message);
  }

  try {
    const model3 = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result3 = await model3.generateContent("Hello");
    console.log("gemini-pro works:", result3.response.text());
  } catch (e) {
    console.error("gemini-pro error:", e.message);
  }
}

run();

