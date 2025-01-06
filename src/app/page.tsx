"use client";

import { useEffect, useState } from "react";
import { listIndexes, upsert, embed } from "@/lib/pinecone";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [chat, setChat] = useState<string[]>([]);
  const [wipMessage, setWipMessage] = useState<string | undefined>();
  const [wipNote, setWipNote] = useState<string | undefined>();
  const [notes, setNotes] = useState<string[]>([]);
  const [sources, setSources] = useState<{name: string, source: string}[]>([]);
  const [wipSource, setWipSource] = useState<string | undefined>();
  const [wipSourceName, setWipSourceName] = useState<string | undefined>();
 
  useEffect(() => {
    const fetchSources = async () => {
      console.log(await listIndexes());
    };
    fetchSources();
  }, []);

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

  const handleSaveSource = async () => {
    if (wipSource && wipSourceName) {
      try {
        const embedding = await embed(wipSource);
        await upsert([{ id: uuidv4(), values: embedding, metadata: { name: wipSourceName } }]);
      } catch (error) {
        console.error('Error generating embeddings:', error);
      }

      setSources([...sources, { name: wipSourceName, source: wipSource }]);
      setWipSource(undefined);
      setWipSourceName(undefined);
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
                <strong>{source.name}</strong>
              </div>
            ))}
          </div>
          <input
            className="w-full flex-1 p-4 border rounded-lg"
            value={wipSourceName}
            onChange={(e) => setWipSourceName(e.target.value)}
          />
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
