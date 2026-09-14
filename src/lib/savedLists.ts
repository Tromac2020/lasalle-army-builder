import type { ArmyState } from '../logic/engine';
import { supabase } from './supabaseClient';

export interface SavedListSummary {
  id: string;
  name: string;
  updated_at: string;
}

function requireSupabase() {
  if (!supabase) throw new Error('Save/load is not configured yet.');
  return supabase;
}

export async function listSavedLists(userId: string): Promise<SavedListSummary[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('army_lists')
    .select('id, name, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Insert a new saved list, or overwrite an existing one if existingId is given. Returns the list's id. */
export async function saveList(userId: string, name: string, army: ArmyState, existingId?: string): Promise<string> {
  const sb = requireSupabase();
  if (existingId) {
    const { error } = await sb
      .from('army_lists')
      .update({ name, data: army, updated_at: new Date().toISOString() })
      .eq('id', existingId)
      .eq('user_id', userId);
    if (error) throw error;
    return existingId;
  }
  const { data, error } = await sb
    .from('army_lists')
    .insert({ user_id: userId, name, data: army })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function loadList(id: string): Promise<ArmyState> {
  const sb = requireSupabase();
  const { data, error } = await sb.from('army_lists').select('data').eq('id', id).single();
  if (error) throw error;
  return data.data as ArmyState;
}

export async function deleteList(id: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from('army_lists').delete().eq('id', id);
  if (error) throw error;
}
