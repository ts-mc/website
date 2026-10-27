"use client";

import { useMemo, useState } from "react";

/*
 * GitHub-dark-dimmed token palette. These hues are confined to code blocks
 * so they never compete with the brand for page-level attention.
 */
const KEYWORD = "#FF7B72";
const STRING = "#A5D6FF";
const COMMENT = "#8B949E";
const NUMBER = "#79C0FF";
const FUNCTION = "#D2A8FF";

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "class", "new", "import", "export", "from", "async", "await", "true",
  "false", "null", "undefined", "def", "public", "private", "void", "int",
  "float", "string", "bool", "and", "or", "not", "in", "is", "then", "do",
  "end", "local", "set", "give", "execute", "run", "tp", "summon",
]);

type Token = { text: string; color?: string };

function tokenize(code: string, language?: string): Token[] {
  const tokens: Token[] = [];
  const isCommentLike = language === "text" ? null : /(#|\/\/)/;
  // Single pass with a combined regex: comments, strings, numbers, words, other.
  const pattern =
    /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_]+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code)) !== null) {
    const [full, comment, str, num, word, ws] = match;
    if (comment) {
      tokens.push({ text: full, color: COMMENT });
    } else if (str) {
      tokens.push({ text: full, color: STRING });
    } else if (num) {
      tokens.push({ text: full, color: NUMBER });
    } else if (word) {
      if (KEYWORDS.has(word) && language !== "text") {
        tokens.push({ text: full, color: KEYWORD });
      } else if (
        language !== "text" &&
        code[match.index + full.length] === "("
      ) {
        tokens.push({ text: full, color: FUNCTION });
      } else {
        tokens.push({ text: full });
      }
    } else if (ws) {
      tokens.push({ text: full });
    } else {
      tokens.push({ text: full });
    }
    void isCommentLike;
  }
  return tokens;
}

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenize(code, language), [code, language]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / insecure context) — nothing to do.
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-card border border-hairline bg-[#0B0E14]">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2 bg-bg-elev/60">
        <span className="label-mono text-ink-dim">{language ?? "code"}</span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
          className="label-mono inline-flex min-h-6 min-w-6 items-center gap-1.5 rounded-control px-2 py-1 text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6">
        <code className="font-mono">
          {tokens.map((token, index) => (
            <span key={index} style={token.color ? { color: token.color } : undefined}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
