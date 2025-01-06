"use client";

import { useState } from "react";
import { query, upsert, embed } from "@/lib/pinecone";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [chat, setChat] = useState<{role: string, content: string}[]>([]);
  const [wipMessage, setWipMessage] = useState<string | undefined>();
  const [wipNote, setWipNote] = useState<string | undefined>();
  const [notes, setNotes] = useState<string[]>([]);
  const [sources, setSources] = useState<{name: string, source: string}[]>([]);
  const [wipSource, setWipSource] = useState<string | undefined>();
  const [wipSourceName, setWipSourceName] = useState<string | undefined>();
 
  const handleSend = () => {
    if (wipMessage) {
      const updatedChat = [...chat, { role: "user", content: wipMessage }];
      setChat(updatedChat);
      setWipMessage(undefined);

      // TODO there is a bug here where a user could type multiple messages and the latter ones get ignored
      const getSources = async () => {
        // TODO: send message to db to get sources
        const { matches } = await query(wipMessage);
        setChat([...updatedChat, { role: "assistant", content: matches.map(match => match.metadata?.name ?? match.id).join(", ") }]);
      };
      getSources();
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
          <label htmlFor="source-name">New Source Name</label>
          <input
            id="source-name"
            className="w-full flex-1 p-4 border rounded-lg"
            value={wipSourceName}
            onChange={(e) => setWipSourceName(e.target.value)}
          />
          <label htmlFor="source">New Source Content</label>
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
              <div key={index} className={`${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"} mb-2 p-2 rounded-lg`}>
                <strong>{message.role}: {message.content}</strong>
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
