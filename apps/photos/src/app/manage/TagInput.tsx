'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Tab' || e.key === 'Enter') && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded min-h-[42px] cursor-text focus-within:ring-2 focus-within:ring-gray-400"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1 bg-gray-800 text-white px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onChange(tags.filter((_, j) => j !== i));
            }}
            className="hover:text-gray-300 leading-none ml-0.5"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        className="flex-1 outline-none min-w-[120px] bg-transparent text-sm py-0.5"
        placeholder={tags.length === 0 ? 'Type a tag, press Tab to add...' : ''}
      />
    </div>
  );
}
