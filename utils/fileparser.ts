interface Message {
    date: string;
    time: string;
    user: string;
    text: string;
  }
  
  export const parseChat = (content: string) => {
    const messages: Message[] = [];
    const links: string[] = [];
    const quotes: string[] = [];
    const journalEntries: Message[] = [];
    const readingLists: { [user: string]: string[] } = {};
    const userMessageCount: { [user: string]: number } = {};
    const hourlyMessageCount: { [hour: string]: Message[] } = {};
  
    const lines = content.split("\n");
    let currentMessage: Partial<Message> | null = null;
  
    lines.forEach((line) => {
      const messageRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}), (\d{1,2}:\d{2}:\d{2} (AM|PM))\] (.*?): (.+)$/;
      const match = line.match(messageRegex);
  
      if (match) {
        // Finalize previous message
        if (currentMessage) {
          messages.push(currentMessage as Message);
        }
  
        const [, date, time, , user, text] = match;
        currentMessage = { date, time, user, text };
  
        // Update message counts
        userMessageCount[user] = (userMessageCount[user] || 0) + 1;
  
        // Track hourly activity
        const hour = time.split(":")[0] + (time.includes("PM") ? " PM" : " AM");
        hourlyMessageCount[hour] = hourlyMessageCount[hour] || [];
        hourlyMessageCount[hour].push(currentMessage as Message);
  
        // Extract links and reading lists
        if (text.includes("http")) {
          const foundLinks = text.match(/https?:\/\/[^\s]+/g) || [];
          links.push(...foundLinks);
          if (text.toLowerCase().includes("must read later")) {
            readingLists[user] = readingLists[user] || [];
            readingLists[user].push(...foundLinks);
          }
        }
         // Extract quotes
      if (text.startsWith('"')) {
        quotes.push(text);
      }

  
        // Track journal entries
        if (text.toLowerCase().includes("journal entry")) {
          journalEntries.push({ date, time, user, text });
        }
      } else if (currentMessage) {
        // Append multi-line messages
        currentMessage.text += ` ${line.trim()}`;
      }
    });
  
    // Commit the last message
    if (currentMessage) messages.push(currentMessage as Message);
  
    return {
      messages,
      links,
      quotes,
      journalEntries,
      readingLists,
      userMessageCount,
      hourlyMessageCount,
    };
  };
  