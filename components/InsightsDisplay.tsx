"use client";
import React from 'react';

export const analyzeInsights = (messages: { content: string }[]) => {
  const wordCounts: { [key: string]: number } = {};
  const links: string[] = [];

  messages.forEach(({ content }) => {
    content.split(/\s+/).forEach((word) => {
      if (word.startsWith("http")) links.push(word);
      else wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  return { wordCounts, links };
};

const InsightsDisplay: React.FC<{ messages: { content: string }[] }> = ({ messages }) => {
  const { wordCounts, links } = analyzeInsights(messages);

  return (
    <div className="p-4 border rounded">
      <h2>Links</h2>
      {links.map((link, idx) => (
        <p key={idx} className="text-blue-500">{link}</p>
      ))}

      <h2>Word Frequency</h2>
      <ul>
        {Object.entries(wordCounts).map(([word, count], idx) => (
          <li key={idx}>{word}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightsDisplay;
