import { supabase } from './supabase'

export async function createCommander({ name, portrait }) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('No authenticated user.')

  const { data, error } = await supabase
    .from('commanders')
    .insert({
      user_id: user.id,
      name,
      portrait,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getCommander() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) return null

  const { data, error } = await supabase
    .from('commanders')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error

  return data
}