import ReactMarkdown from "react-markdown";

export function MarkdownView({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2 prose-p:leading-relaxed prose-li:my-0.5">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}