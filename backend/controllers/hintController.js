const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getHint = async (req, res) => {
    const { assignmentQuestion, tableSchemas, studentQuery, lastError } = req.body;

    if (!assignmentQuestion) {
        return res.status(400).json({ success: false, error: 'Question required' });
    }

    const prompt = `You are a SQL mentor. Give guidance, NEVER solutions.
Rules:
1. No final SQL or fragments.
2. No copy-paste code.
3. Concise conceptual guidance only.
Must return valid JSON with strictly these keys: "concept", "hint", "nextStep".

Assignment: ${assignmentQuestion}
Schemas: ${JSON.stringify(tableSchemas)}
Student Query: ${studentQuery || 'None'}
Error: ${lastError || 'None'}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        res.json({ success: true, hint: JSON.parse(response.text) });
    } catch (err) {
        console.error("Gemini Error:", err.message);
        res.status(500).json({ success: false, error: "LLM request failed" });
    }
};

module.exports = { getHint };
