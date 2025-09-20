

import React from 'react';
import { Sprout, Droplets, Sun } from 'lucide-react';

interface CareInstructionsProps {
  text: string;
}

const icons: { [key: string]: React.ElementType } = {
    '*': Sprout,
    '-': Droplets,
    '+': Sun,
};

export default function CareInstructions({ text }: CareInstructionsProps) {
  if (!text) {
    return null;
  }

  // Regex to match lines starting with *, -, or +
  const bulletPointRegex = /^(\s*)([*+-])\s*(.*)/;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-4">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const match = line.match(bulletPointRegex);

    if (match) {
      const symbol = match[2] as keyof typeof icons;
      const content = match[3];
      const IconComponent = icons[symbol] || Sprout;

      currentListItems.push(
        <li key={index} className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-1">
            <IconComponent className="h-4 w-4 text-primary" />
          </span>
          <span className="text-muted-foreground">{content}</span>
        </li>
      );
    } else {
      flushList();
      if (line.trim()) {
        elements.push(
          <p key={index} className="text-muted-foreground my-4">
            {line}
          </p>
        );
      }
    }
  });

  flushList();

  return <div className="prose prose-sm dark:prose-invert max-w-none">{elements}</div>;
}
