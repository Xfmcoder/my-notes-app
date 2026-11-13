import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit3, Folder, Tag, Save, Check } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('my_notes_app');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '1',
        title: 'Welcome to My Notes',
        content: 'Start writing your thoughts, ideas, or to-do lists here. Everything is saved automatically to local storage.',
        category: 'Personal',
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const [activeId, setActiveId] = useState(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem('my_notes_app', JSON.stringify(notes));
    setSavedStatus(true);
    const timer = setTimeout(() => setSavedStatus(false), 1500);
    return () => clearTimeout(timer);
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId) || notes[0];

  const categories = ['All', 'Personal', 'Work', 'Ideas', 'Code'];

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      category: selectedCategory === 'All' ? 'Personal' : selectedCategory,
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
  };

  const handleUpdateNote = (field, value) => {
    if (!activeNote) return;
    setNotes(notes.map(n => {
      if (n.id === activeNote.id) {
        return { ...n, [field]: value, updatedAt: new Date().toISOString() };
      }
      return n;
    }));
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id || null);
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-blue-400 flex items-center gap-2">
            <Edit3 className="w-5 h-5" /> My Notes
          </h1>
          <button
            onClick={handleCreateNote}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition flex items-center gap-1 text-sm font-medium shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-slate-800 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition font-medium ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No notes found</div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setActiveId(note.id)}
                className={`p-3 rounded-xl cursor-pointer transition border group relative ${
                  note.id === activeId 
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-950/50' 
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm truncate pr-6 text-slate-200">{note.title || 'Untitled Note'}</h3>
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition p-1 absolute right-2 top-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 truncate mb-2">{note.content || 'Empty note...'}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">{note.category}</span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <div className="flex items-center gap-2 w-full max-w-xl">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateNote('title', e.target.value)}
                  placeholder="Note Title..."
                  className="bg-transparent text-xl font-bold border-b border-transparent hover:border-slate-800 focus:border-blue-500 focus:outline-none w-full px-1 py-1 transition"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={activeNote.category}
                  onChange={(e) => handleUpdateNote('category', e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 text-slate-300"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Code">Code</option>
                </select>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  {savedStatus ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-slate-500" />
                      <span>Synced</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateNote('content', e.target.value)}
                placeholder="Start writing your note here..."
                className="w-full flex-1 bg-transparent resize-none focus:outline-none text-slate-200 text-base leading-relaxed placeholder-slate-600 font-normal"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a note or create a new one to start writing.
          </div>
        )}
      </div>
    </div>
  );
}
