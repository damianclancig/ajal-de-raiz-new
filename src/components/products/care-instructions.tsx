/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



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
