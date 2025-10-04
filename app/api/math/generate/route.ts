import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateMathProblem } from '@/lib/ai'

export async function POST() {
  try {
    const problem = await generateMathProblem()

    console.log(problem)

    const { data, error } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problem.problem_text,
        final_answer: problem.final_answer,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
