import React from 'react';

interface DateSeparatorProps {
  date: string; // ISO date string
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time for comparison
    const msgDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (msgDateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (msgDateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "December 23, 2024"
      return messageDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1.5 bg-charcoal-100 dark:bg-charcoal-800 rounded-full text-xs text-charcoal-600 dark:text-charcoal-400 font-medium shadow-sm">
        {formatDate(date)}
      </div>
    </div>
  );
};

// Helper function to group messages by date
export const groupMessagesByDate = <T extends { created_at: string }>(
  messages: T[]
): { date: string; messages: T[] }[] => {
  const groups: Map<string, T[]> = new Map();

  messages.forEach((msg) => {
    const dateKey = new Date(msg.created_at).toDateString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(msg);
  });

  return Array.from(groups.entries()).map(([date, msgs]) => ({
    date: msgs[0].created_at, // Use first message's date for the separator
    messages: msgs
  }));
};

export default DateSeparator;
