import { useEffect, useState } from 'react';
import type { ArmyState } from '../logic/engine';
import { supabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../lib/useAuth';
import { deleteList, listSavedLists, loadList, saveList, type SavedListSummary } from '../lib/savedLists';

export default function AccountPanel({
  army,
  onLoadArmy,
}: {
  army: ArmyState;
  onLoadArmy: (army: ArmyState) => void;
}) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [lists, setLists] = useState<SavedListSummary[]>([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [activeListName, setActiveListName] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function refreshLists(userId: string) {
    setListsLoading(true);
    try {
      setLists(await listSavedLists(userId));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not load your saved lists.');
    } finally {
      setListsLoading(false);
    }
  }

  useEffect(() => {
    if (user) refreshLists(user.id);
    else {
      setLists([]);
      setActiveListId(null);
      setActiveListName('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!supabaseConfigured) return null;

  async function handleSaveNew() {
    if (!user || !newName.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      const id = await saveList(user.id, newName.trim(), army);
      setActiveListId(id);
      setActiveListName(newName.trim());
      setNewName('');
      await refreshLists(user.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not save this list.');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateActive() {
    if (!user || !activeListId) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      await saveList(user.id, activeListName, army, activeListId);
      await refreshLists(user.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update this list.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLoad(id: string, name: string) {
    setBusy(true);
    setErrorMsg(null);
    try {
      const loaded = await loadList(id);
      onLoadArmy(loaded);
      setActiveListId(id);
      setActiveListName(name);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not load that list.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      await deleteList(id);
      if (activeListId === id) {
        setActiveListId(null);
        setActiveListName('');
      }
      await refreshLists(user.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not delete that list.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white rounded-lg border border-stone-300 p-4 no-print mb-4">
      <h2 className="font-bold mb-2">Account</h2>

      {loading ? (
        <p className="text-xs text-stone-500">Checking sign-in status…</p>
      ) : !user ? (
        <div>
          <p className="text-xs text-stone-500 mb-2">Sign in to save your army lists and load them later.</p>
          <button
            className="border border-stone-400 rounded px-3 py-1.5 text-sm font-medium hover:bg-stone-50 flex items-center gap-2"
            onClick={signInWithGoogle}
          >
            <GoogleIcon /> Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-700 truncate">{user.email}</span>
            <button className="text-xs underline text-stone-500 hover:text-stone-800" onClick={signOut}>
              Sign out
            </button>
          </div>

          <div className="mb-3">
            <div className="text-xs font-semibold text-stone-600 mb-1">Save this list</div>
            <div className="flex gap-1.5">
              <input
                type="text"
                className="border border-stone-400 rounded px-2 py-1 text-sm flex-1 min-w-0"
                placeholder="List name…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={busy || !army.nationId}
              />
              <button
                className="border border-stone-400 rounded px-2 py-1 text-sm font-medium hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                onClick={handleSaveNew}
                disabled={busy || !army.nationId || !newName.trim()}
              >
                Save as new
              </button>
            </div>
            {activeListId && (
              <button
                className="text-xs underline text-stone-500 hover:text-stone-800 mt-1.5 disabled:opacity-40"
                onClick={handleUpdateActive}
                disabled={busy}
              >
                Update "{activeListName}" with current changes
              </button>
            )}
            {!army.nationId && <p className="text-[11px] text-stone-400 mt-1">Pick a nation and build an army first.</p>}
          </div>

          <div>
            <div className="text-xs font-semibold text-stone-600 mb-1">My saved lists</div>
            {listsLoading ? (
              <p className="text-xs text-stone-400">Loading…</p>
            ) : lists.length === 0 ? (
              <p className="text-xs text-stone-400">No saved lists yet.</p>
            ) : (
              <ul className="space-y-1">
                {lists.map((l) => (
                  <li
                    key={l.id}
                    className={`flex items-center justify-between gap-2 text-sm rounded px-2 py-1 ${
                      activeListId === l.id ? 'bg-amber-50 border border-amber-200' : 'border border-transparent'
                    }`}
                  >
                    <span className="truncate">{l.name}</span>
                    <span className="flex gap-2 shrink-0">
                      <button
                        className="text-xs underline text-stone-500 hover:text-stone-800 disabled:opacity-40"
                        onClick={() => handleLoad(l.id, l.name)}
                        disabled={busy}
                      >
                        Load
                      </button>
                      <button
                        className="text-xs underline text-red-500 hover:text-red-700 disabled:opacity-40"
                        onClick={() => handleDelete(l.id)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {errorMsg && <p className="text-xs text-red-600 mt-2">{errorMsg}</p>}
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.6 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.4 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}
