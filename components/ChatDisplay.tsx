"use client";
import React from 'react';

interface Message {
  timestamp: string | null;
  content: string;
}

const ChatDisplay: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div className="p-4 border rounded">
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-2">
          {msg.timestamp && <span className="text-gray-500">{msg.timestamp}</span>}
          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatDisplay;
