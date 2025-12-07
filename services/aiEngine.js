// services/aiEngine.js

// Bước này CHƯA dùng Gemini.
// Chỉ mock dữ liệu để test API.

function mockExtract(cvText, jdText) {
  return {
    fullName: "Nguyễn Văn A (mock)",
    email: "mock@example.com",
    phone: "0900000000",
    gender: "Không rõ",
    dob: null,
    address: "",
    city: "",
    education: "Đại học",
    salaryExpectation: 20,
    experienceSummary: "Dữ liệu mock từ backend.",
    skills: "Sales, Excel",
    aiScore: 75,
    mustCall: true,
    priorityLevel: "HIGH",
    aiStrengths: "Mock strength.",
    aiWeaknesses: "Mock weakness.",
    aiRedFlags: "",
    aiSummary: "Đây là dữ liệu mock từ backend (chưa dùng Gemini).",
    tags: ["mock", "demo"]
  };
}

function mockAnalyze(cv, jdText) {
  return {
    aiScore: 80,
    priorityLevel: "HIGH",
    mustCall: true,
    aiStrengths: "Mock analyze strengths.",
    aiWeaknesses: "Mock analyze weaknesses.",
    aiRedFlags: "",
    aiSummary: "Kết quả analyze mock.",
    tags: ["analyze-mock"]
  };
}

module.exports = {
  mockExtract,
  mockAnalyze
};
