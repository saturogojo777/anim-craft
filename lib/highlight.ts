export type HighlightLanguage = "css" | "html" | "js" | "text";

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeAttribute = (value: string): string => escapeHtml(value).replace(/"/g, "&quot;");

function span(className: string, content: string): string {
  return `<span class="${className}">${content}</span>`;
}

const CSS_NUMBER =
  /(\b\d+(?:\.\d+)?(?:ms|s|deg|%|ch|px|em|rem|vh|vw|fr)?\b)|(#[0-9a-fA-F]{3,8}\b)|(\b(?:infinite|linear|ease|ease-in|ease-out|ease-in-out|normal|reverse|alternate|alternate-reverse|both|forwards|backwards|none|inset|transparent)\b)/g;

function highlightCssValue(rawValue: string): string {
  const escaped = escapeHtml(rawValue);
  return escaped.replace(CSS_NUMBER, (match) => {
    if (/^#/.test(match)) return span("tok-number", match);
    return span("tok-number", match);
  });
}

function highlightCssLine(line: string): string {
  const indentMatch = line.match(/^\s*/);
  const indent = indentMatch ? indentMatch[0] : "";
  const rest = line.slice(indent.length);
  if (!rest) return escapeHtml(line);

  if (rest.startsWith("/*")) return span("tok-comment", escapeHtml(rest));

  if (rest.startsWith("@")) {
    const braceIndex = rest.indexOf("{");
    if (braceIndex === -1) return span("tok-at", escapeHtml(rest));
    return (
      span("tok-at", escapeHtml(rest.slice(0, braceIndex))) +
      escapeHtml(rest.slice(braceIndex))
    );
  }

  if (rest.includes("{")) {
    const braceIndex = rest.indexOf("{");
    return (
      span("tok-selector", escapeHtml(rest.slice(0, braceIndex))) +
      escapeHtml(rest.slice(braceIndex))
    );
  }

  if (rest.startsWith("}") || rest.startsWith(")")) return escapeHtml(rest);

  const colonIndex = rest.indexOf(":");
  if (colonIndex > 0) {
    const prop = rest.slice(0, colonIndex);
    const value = rest.slice(colonIndex + 1);
    return escapeHtml(indent) + span("tok-prop", escapeHtml(prop)) + ":" + highlightCssValue(value);
  }

  return escapeHtml(rest);
}

function highlightHtmlLine(line: string): string {
  const escaped = escapeHtml(line);
  return escaped.replace(
    /&lt;!--[\s\S]*?--&gt;|&lt;\/?[\w-]+|\s[\w-]+=|\"[^\"]*\"|'[^']*'/g,
    (match) => {
      if (match.startsWith("&lt;!--")) return span("tok-comment", match);
      if (match.startsWith("&lt;")) return span("tok-tag", match);
      if (match.trimEnd().endsWith("=")) {
        return span("tok-attr", match.slice(0, match.length - 1)) + "=";
      }
      return span("tok-string", match);
    },
  );
}

const JS_TOKEN =
  /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(const|let|var|function|return|if|else|new|export|import|default|type|of|in|for|while)\b|(\b\d+(?:\.\d+)?\b)|(\b(?:true|false|null|undefined)\b)/g;

function highlightJsLine(line: string): string {
  return escapeHtml(line).replace(JS_TOKEN, (match, comment, str) => {
    if (comment) return span("tok-comment", comment);
    if (str) return span("tok-string", str);
    if (/^(true|false|null|undefined)$/.test(match)) return span("tok-keyword", match);
    if (/^\d/.test(match)) return span("tok-number", match);
    return span("tok-keyword", match);
  });
}

export function highlightLine(line: string, language: HighlightLanguage): string {
  switch (language) {
    case "css":
      return highlightCssLine(line);
    case "html":
      return highlightHtmlLine(line);
    case "js":
      return highlightJsLine(line);
    default:
      return escapeHtml(line);
  }
}

export function highlightCode(code: string, language: HighlightLanguage): string[] {
  return code.split("\n").map((line) => highlightLine(line, language));
}

export { escapeAttribute, escapeHtml };
