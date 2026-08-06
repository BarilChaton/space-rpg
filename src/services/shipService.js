import { supabase } from './supabase'

export async function getShip() {
  const { data, error } = await supabase
    .from('ships')
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateShip(values) {
  const { data, error } = await supabase
    .from('ships')
    .update(values)
    .eq('id', values.id)
    .select()
    .single()

  if (error) throw error
  return data
}