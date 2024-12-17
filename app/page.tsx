"use client";
import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import { parseChat } from "../utils/fileparser";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

export default function Home() {
  const [insights, setInsights] = useState<any>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);

  const handleFileLoad = (content: string) => {
    const result = parseChat(content);
    setInsights(result);
  };
  const handleBarClick = (data: any) => {
    const hour = data.hour;
    setSelectedHour(hour);
    setSelectedMessages(insights.hourlyMessageCount[hour] || []);
  };
  const chartData = insights
    ? Object.keys(insights.hourlyMessageCount).map((hour) => ({
        hour, // The key, e.g., "9 AM", "10 AM"
        messages: insights.hourlyMessageCount[hour].length, // Number of messages in that hour
      }))
    : [];
  console.log(insights);

  return (
    <div className="p-6 font-serif">
      <h1 className="text-2xl font-bold font-serif mb-4">
        WhatsApp Chat Analyzer🤔
      </h1>
      <h2 className="text-lg font-semibold font-serif mb-4 ">
        Analyze your WhatsApp chats and gain insights into your conversations.
      </h2>
      <FileUpload onFileLoad={handleFileLoad} />

      {insights && (
        <div className="mt-6">
          {/* General Chat Statistics */}
          <h2 className="text-lg font-semibold mb-2">
            General Chat Statistics
          </h2>
          <p className="mb-4">Total Messages: {insights.messages.length}</p>

          {/* Links */}
          <h3 className="font-semibold">Links</h3>
          {insights.links.length > 0 ? (
            insights.links.map((link: string, idx: number) => (
              <a
                key={idx}
                href={link}
                className="block text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link}
              </a>
            ))
          ) : (
            <p>No links found</p>
          )}

          {/* Quotes */}
          <h3 className="font-semibold mt-4">Quotes</h3>
          {insights.quotes?.length > 0 ? (
            insights.quotes.map((quote: string, idx: number) => (
              <p key={idx} className="italic mt-1">
                "{quote}"
              </p>
            ))
          ) : (
            <p>No quotes found</p>
          )}

          {/* Messages Per User Table */}
          <h3 className="font-semibold mt-4">Messages Per User</h3>
          <table className="table-auto border-collapse border border-gray-400 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">User</th>
                <th className="border border-gray-400 px-4 py-2">Messages</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                insights.userMessageCount as Record<string, number>
              ).map(([user, count]) => (
                <tr key={user}>
                  <td className="border border-gray-400 px-4 py-2">{user}</td>
                  <td className="border border-gray-400 px-4 py-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hourly Activity Chart */}
          <h3 className="font-semibold mt-6">Hourly Activity</h3>
          <ResponsiveContainer width="100%" height={300} className="mt-4">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              onClick={(event) => {
                if (event && event.activePayload) {
                  const clickedData = event.activePayload[0]?.payload;
                  handleBarClick(clickedData);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <Dialog open={!!selectedHour} onOpenChange={() => setSelectedHour(null)}>
        {selectedHour && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Messages in {selectedHour}</DialogTitle>
              <DialogDescription>
                {selectedMessages.length} messages found in this hour.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {selectedMessages.map((msg, idx) => (
                <div key={idx} className="mb-2 border-b pb-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">{msg.user}:</span>{" "}
                    {msg.text}
                  </p>
                  <p className="text-gray-500 text-sm">{msg.time}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
