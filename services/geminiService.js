// services/geminiService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model dùng: Gemini 2.5 Flash
const MODEL_NAME = "gemini-2.5-flash";

/* ---------------------------------------------
   1. Hàm gọi Gemini chung
--------------------------------------------- */
async function callGemini(prompt, schema) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

/* ---------------------------------------------
   2. Hàm extract CV (raw text → structured JSON)
--------------------------------------------- */
async function extractWithGemini(cvText, jdText) {
  const prompt = `
Bạn là AI đọc CV ứng viên Việt Nam.

Dưới đây là nội dung CV:
---
${cvText}
---

Nếu có JD, đây là JD:
---
${jdText || ""}
---

Yêu cầu:
- Chuẩn hoá dữ liệu về JSON theo đúng schema.
- Không được bịa thông tin không có trong CV.
- Nếu không thấy, trả null.

Trả về JSON thôi.
`;

  const schema = {
    type: "object",
    properties: {
      fullName: { type: "string", nullable: true },
      email: { type: "string", nullable: true },
      phone: { type: "string", nullable: true },
      gender: { type: "string", nullable: true },
      dob: { type: "string", nullable: true },
      address: { type: "string", nullable: true },
      city: { type: "string", nullable: true },
      education: { type: "string", nullable: true },
      salaryExpectation: { type: "number", nullable: true },
      experienceSummary: { type: "string", nullable: true },
      skills: { type: "string", nullable: true },
      aiScore: { type: "number", nullable: true },
      mustCall: { type: "boolean", nullable: true },
      priorityLevel: { type: "string", nullable: true },
      aiStrengths: { type: "string", nullable: true },
      aiWeaknesses: { type: "string", nullable: true },
      aiRedFlags: { type: "string", nullable: true },
      aiSummary: { type: "string", nullable: true },
      tags: {
        type: "array",
        items: { type: "string" },
        nullable: true
      }
    },
    required: ["fullName"]
  };

  return await callGemini(prompt, schema);
}

/* ---------------------------------------------
   3. Hàm Analyze (scoring + reasoning nâng cao)
--------------------------------------------- */
async function analyzeWithGemini(structuredCV, jdText) {
  const prompt = `
Bạn là AI chấm điểm CV theo JD trong bối cảnh tuyển dụng Việt Nam.

Dữ liệu CV đã chuẩn hoá:
${JSON.stringify(structuredCV, null, 2)}

JD:
${jdText || ""}

Yêu cầu:
- Chấm điểm AI Score (0–100)
- MUST CALL: true/false
- Priority: VERY_LOW / LOW / MEDIUM / HIGH / CRITICAL
- Strengths / Weaknesses / Red Flags
- Tạo tags
- Tạo AI Summary (100–200 từ)

Chỉ trả JSON đúng schema.
`;

  const schema = {
    type: "object",
    properties: {
      aiScore: { type: "number" },
      mustCall: { type: "boolean" },
      priorityLevel: { type: "string" },
      aiStrengths: { type: "string" },
      aiWeaknesses: { type: "string" },
      aiRedFlags: { type: "string" },
      aiSummary: { type: "string" },
      tags: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["aiScore", "priorityLevel"]
  };

  return await callGemini(prompt, schema);
}

module.exports = {
  extractWithGemini,
  analyzeWithGemini
};
