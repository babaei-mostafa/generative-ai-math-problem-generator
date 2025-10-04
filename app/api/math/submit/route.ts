import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateFeedback } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { session_id, user_answer } = await req.json()

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (sessionError) throw sessionError

    const is_correct = Number(user_answer) === session.final_answer

    const feedback_text = await generateFeedback(
      session.problem_text,
      Number(user_answer),
      session.correct_answer
    )

    const { data, error } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id,
        user_answer: Number(user_answer),
        is_correct,
        feedback_text,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
