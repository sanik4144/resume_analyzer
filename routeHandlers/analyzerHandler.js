const express = require('express');
const router = express.Router();
const { getCVText } = require('../pdfHandlers/cvStore');

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
 

router.post('/analyze', async (req, res)=>{
    try {
        const cv = getCVText();

        const cleanedBody = Object.fromEntries(
            Object.entries(req.body).map(([key, value]) => [
                key,
                typeof value === 'string'
                ? value.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
                : value // leave files or other types untouched
            ])
            );

        const prompt = `
        You are an expert career coach, ATS (Applicant Tracking System) optimizer, and technical recruiter.

        I will provide you with the following inputs:

        - CV: {${cv}}
        - Job Role: {${cleanedBody.JOB_ROLE}}
        - Job Description: {${cleanedBody.JOB_DESCRIPTION}}
        - Job Responsibilites: {${cleanedBody.JOB_RESPONSIBILITES}}
        - Application Deadline: {${cleanedBody.DEADLINE}}
        - Required Skills: {${cleanedBody.REQUIRED_SKILLS}}
        - Experience Required: {${cleanedBody.EXPERIENCE_WANTED}}
        - Special Notes: {${cleanedBody.SPECIAL_NOTES}}

        Your tasks are:

        1. CV Optimization:
        - Rewrite and tailor the CV specifically for the given job role and job description.
        - Ensure it is ATS-friendly (use proper keywords, formatting, bullet points).
        - Improve clarity, impact, and professionalism.
        - Highlight relevant experience and remove irrelevant information.
        - Quantify achievements where possible.

        2. ATS Analysis:
        - Provide an ATS compatibility score (out of 100).
        - Identify missing keywords based on the job description.
        - Suggest improvements to increase ATS ranking.

        3. Job Readiness Evaluation:
        - Evaluate how well the candidate fits the job (percentage match).
        - Explain strengths and gaps clearly.

        4. Skills Gap & Learning Plan:
        - Identify missing or weak skills required for the role.
        - Suggest a prioritized list of skills to learn.

        5. Learning Resources:
        - Provide relevant YouTube learning resources for each recommended skill.
        - Include video titles or topics (no need for exact links if unsure).

        6. Special Suggestions:
        - Provide actionable advice to improve chances of getting shortlisted.
        - Suggest portfolio, projects, or certifications if needed.
        - Consider the application deadline and prioritize urgent improvements.

        Output format:

        Return your response in the following structured JSON format:

        {
        "optimized_cv": "...",
        "ats_score": number,
        "missing_keywords": ["...", "..."],
        "job_match_percentage": number,
        "strengths": ["...", "..."],
        "gaps": ["...", "..."],
        "skills_to_learn": ["...", "..."],
        "learning_resources": [
            {
            "skill": "...",
            "resources": ["...", "..."]
            }
        ],
        "suggestions": ["...", "..."]
        }

        Important:
        - Be concise but insightful.
        - Do not include any explanations outside the JSON.
        - Ensure the CV is clean, professional, and ready to submit.`


        if(!prompt){
            return res.status(400).json({
                success: false,
                message: "Promt is required",
            })
        }
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const text = response.candidates[0].content;
        const reply = text.parts[0].text;

        res.status(200).json({
            success: true,
            reply: reply,
            //result: text,
            message: "Success"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Something Went Wrong",
        })
    }
})


module.exports = router;