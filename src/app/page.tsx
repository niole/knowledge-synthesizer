"use client";

import { useState } from "react";
import pc from "@/lib/pinecone";

export default function Home() {
  const [chat, setChat] = useState<string[]>([]);
  const [wipMessage, setWipMessage] = useState<string | undefined>();
  const [wipNote, setWipNote] = useState<string | undefined>();
  const [notes, setNotes] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [wipSource, setWipSource] = useState<string | undefined>();
  const handleSend = () => {
    if (wipMessage) {
      setChat([...chat, wipMessage]);
      setWipMessage(undefined);
    }
  };

  const handleSaveNote = () => {
    if (wipNote) {
      setNotes([...notes, wipNote]);
      setWipNote(undefined);
    }
  };

  const handleSaveSource = () => {
    if (wipSource) {
      setSources([...sources, wipSource]);
      setWipSource(undefined);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-3 gap-8 row-start-2 w-full h-full">

        <div className="flex flex-col gap-4">
          <label htmlFor="source">Sources</label>
          <div id="sources-display" className="flex-1 w-full p-4 border rounded-lg bg-gray-50 overflow-y-auto">
            {sources.map((source, index) => (
              <div key={index} className="mb-2">
                <strong>{source}</strong>
              </div>
            ))}
          </div>
          <textarea 
            id="source" 
            className="w-full flex-1 p-4 border rounded-lg"
            value={wipSource}
            onChange={(e) => setWipSource(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSaveSource}
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div id="chat-display" className="flex-1 w-full p-4 border rounded-lg bg-gray-50 overflow-y-auto">
            {chat.map((message, index) => (
              <div key={index} className="mb-2">
                <strong>{message}</strong>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text"
              id="chat-input"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type your message..."
              value={wipMessage}
              onChange={(e) => setWipMessage(e.target.value)}
            />
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="notes">Notes</label>
          <div id="notes-display" className="flex-1 w-full p-4 border rounded-lg bg-gray-50 overflow-y-auto">
            {notes.map((note, index) => (
              <div key={index} className="mb-2">
                <strong>{note}</strong>
              </div>
            ))}
          </div>
          <textarea 
            id="notes" 
            className="w-full flex-1 p-4 border rounded-lg" 
            onChange={(e) => setWipNote(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSaveNote}
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
