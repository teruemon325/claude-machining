import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SEED_ENTRIES } from './data/seed';
import { seedImageBlob } from './data/seedImages';
import { DEFAULT_FILTER, filterEntries, type Filter } from './search';
import {
  applySeedImagesOnce,
  createEntry,
  deleteEntry,
  exportJson,
  importJson,
  loadEntries,
  mergeEntries,
  referencedImageIds,
  saveEntries,
  toggleFavorite,
  updateEntry,
  type ImageDataMap,
} from './store';
import { blobToDataUrl, createImageStore, dataUrlToBlob, type ImageStore } from './imageStore';
import { EMPTY_INPUT, type KnowHow, type KnowHowInput } from './types';
import { EntryDetail } from './components/EntryDetail';
import { EntryForm, type NewImageBlobs } from './components/EntryForm';
import { EntryList } from './components/EntryList';
import { Header } from './components/Header';
import { ImageStoreContext } from './components/ImageStoreContext';
import { Sidebar } from './components/Sidebar';
import { StudyNav } from './components/StudyNav';

type FormState = { mode: 'new' } | { mode: 'edit'; id: string } | null;

function pickInput(entry: KnowHow): KnowHowInput {
  const { title, category, tags, summary, problem, cause, solution, notes, images } = entry;
  return { title, category, tags, summary, problem, cause, solution, notes, images };
}

/** 初期データの解説図のうち、ストアにまだ無いものを投入する */
async function ensureSeedImages(store: ImageStore, entries: readonly KnowHow[]): Promise<void> {
  const existing = new Set(await store.keys());
  const tasks: Promise<void>[] = [];
  for (const id of referencedImageIds(entries)) {
    if (existing.has(id)) continue;
    const blob = seedImageBlob(id);
    if (blob) tasks.push(store.put(id, blob));
  }
  await Promise.all(tasks);
}

/** どのノウハウからも参照されなくなった画像をストアから消す */
async function pruneOrphanImages(store: ImageStore, entries: readonly KnowHow[]): Promise<void> {
  const referenced = referencedImageIds(entries);
  const keys = await store.keys();
  await Promise.all(keys.filter((key) => !referenced.has(key)).map((key) => store.delete(key)));
}

export default function App() {
  const imageStore = useMemo(() => createImageStore(), []);
  const [entries, setEntries] = useState<KnowHow[]>(() =>
    applySeedImagesOnce(window.localStorage, loadEntries(window.localStorage, SEED_ENTRIES), SEED_ENTRIES),
  );
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveEntries(window.localStorage, entries);
  }, [entries]);

  // 起動時に一度だけ、初期データの解説図を投入し、参照されていない画像を掃除する
  useEffect(() => {
    void ensureSeedImages(imageStore, entries)
      .then(() => pruneOrphanImages(imageStore, entries))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageStore]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visible = useMemo(() => filterEntries(entries, filter), [entries, filter]);
  const selected = selectedId ? entries.find((e) => e.id === selectedId) ?? null : null;

  const closeDetail = useCallback(() => setSelectedId(null), []);
  const closeForm = useCallback(() => setForm(null), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleSubmit = async (input: KnowHowInput, newBlobs: NewImageBlobs) => {
    setBusy(true);
    try {
      await Promise.all([...newBlobs].map(([id, blob]) => imageStore.put(id, blob)));
      const keep = new Set(input.images.map((img) => img.id));
      if (form?.mode === 'edit') {
        const before = entries.find((e) => e.id === form.id);
        const removed = before ? before.images.filter((img) => !keep.has(img.id)) : [];
        setEntries((prev) => updateEntry(prev, form.id, input));
        await Promise.all(removed.map((img) => imageStore.delete(img.id)));
        setToast('ノウハウを更新しました。');
      } else {
        const entry = createEntry(input);
        setEntries((prev) => [entry, ...prev]);
        setToast('ノウハウを追加しました。');
      }
      setForm(null);
    } catch (err) {
      setToast(`保存に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    if (!window.confirm(`「${target.title}」を削除しますか？`)) return;
    setEntries((prev) => deleteEntry(prev, id));
    setSelectedId(null);
    await Promise.all(target.images.map((img) => imageStore.delete(img.id))).catch(() => undefined);
    setToast('ノウハウを削除しました。');
  };

  const handleExport = async () => {
    setBusy(true);
    try {
      const imageData: ImageDataMap = {};
      for (const id of referencedImageIds(entries)) {
        const blob = await imageStore.get(id);
        if (blob) imageData[id] = await blobToDataUrl(blob);
      }
      const blob = new Blob([exportJson(entries, imageData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `machining-knowhow-${stamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setToast(`エクスポートに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const { entries: imported, imageData } = importJson(await file.text());
      await Promise.all(Object.entries(imageData).map(([id, dataUrl]) => imageStore.put(id, dataUrlToBlob(dataUrl))));
      setEntries((prev) => mergeEntries(prev, imported));
      const imageCount = Object.keys(imageData).length;
      setToast(`${imported.length} 件を取り込みました${imageCount > 0 ? `（画像 ${imageCount} 枚）` : ''}。`);
    } catch (err) {
      setToast(`インポートに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('登録したノウハウと画像をすべて消して初期データに戻します。よろしいですか？')) return;
    setEntries([...SEED_ENTRIES]);
    setFilter(DEFAULT_FILTER);
    setSelectedId(null);
    await imageStore
      .clear()
      .then(() => ensureSeedImages(imageStore, SEED_ENTRIES))
      .catch(() => undefined);
    setToast('初期データに戻しました。');
  };

  const addTagFilter = (tag: string) => {
    setFilter((prev) => (prev.tags.includes(tag) ? prev : { ...prev, tags: [...prev.tags, tag] }));
  };

  return (
    <ImageStoreContext.Provider value={imageStore}>
      <div className="app" aria-busy={busy}>
        <StudyNav />
        <Header
          query={filter.query}
          onQueryChange={(query) => setFilter((prev) => ({ ...prev, query }))}
          onNew={() => setForm({ mode: 'new' })}
          onExport={() => void handleExport()}
          onImport={() => fileInputRef.current?.click()}
          onReset={() => void handleReset()}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            void handleImportFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <div className="layout">
          {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} />}
          <Sidebar entries={entries} filter={filter} onChange={setFilter} open={sidebarOpen} onClose={closeSidebar} />
          <EntryList
            entries={visible}
            total={entries.length}
            onSelect={setSelectedId}
            onToggleFavorite={(id) => setEntries((prev) => toggleFavorite(prev, id))}
            onTagClick={addTagFilter}
          />
        </div>

        {selected && !form && (
          <EntryDetail
            entry={selected}
            onClose={closeDetail}
            onEdit={() => setForm({ mode: 'edit', id: selected.id })}
            onDelete={() => void handleDelete(selected.id)}
            onToggleFavorite={() => setEntries((prev) => toggleFavorite(prev, selected.id))}
          />
        )}

        {form && (
          <EntryForm
            key={form.mode === 'edit' ? form.id : 'new'}
            title={form.mode === 'edit' ? 'ノウハウを編集' : 'ノウハウを追加'}
            initial={form.mode === 'edit' ? pickInput(entries.find((e) => e.id === form.id)!) : EMPTY_INPUT}
            onCancel={closeForm}
            onSubmit={(input, blobs) => void handleSubmit(input, blobs)}
          />
        )}

        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </ImageStoreContext.Provider>
  );
}
