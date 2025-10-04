import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

const model = genAI.getGenerativeModel({
  model: 'models/gemini-flash-latest',
})

export async function generateMathProblem() {
  const prompt = `
  Generate a Primary 5 math word problem. 
  Return JSON ONLY with this structure:
  {
    "problem_text": "string",
    "final_answer": number
  }`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const cleanText = text
    .replace(/```json/i, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleanText)
  } catch (err) {
    console.error('Failed to parse AI response:', cleanText)
    throw new Error('AI did not return valid JSON.')
  }
}

export async function generateFeedback(
  problem: string,
  userAnswer: number,
  correctAnswer: number
) {
  const prompt = `
  The student solved the following problem:
  Problem: "${problem}"
  Their answer: ${userAnswer}
  Correct answer: ${correctAnswer}

  Please provide short, encouraging, personalized feedback for the student.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
