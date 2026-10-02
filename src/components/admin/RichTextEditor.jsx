"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { getCldImageUrl } from "next-cloudinary";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";
import { PROSE_CLASSES } from "@/components/blog/proseClasses";

/**
 * TipTap editor for post bodies. Posts are stored as Markdown, so the editor
 * loads and emits Markdown (via @tiptap/markdown) and the public site renders
 * the same Markdown it always has. Only Markdown-representable formatting is
 * offered (no underline, colours or alignment). A "Markdown" tab shows the
 * source for anything easier to type by hand.
 */
const extensions = [
  StarterKit.configure({
    underline: false, // no Markdown equivalent
    heading: { levels: [2, 3, 4] }, // the post title is the page's h1
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
  Image,
  TableKit.configure({ table: { resizable: false } }),
  Placeholder.configure({ placeholder: "Start writing your post…" }),
  Markdown,
];

const ToolbarButton = ({ onClick, active = false, disabled = false, label, children }) => (
  <button
    type="button"
    // keep focus (and the selection) in the editor when clicked with a mouse;
    // keyboard users still reach the buttons with Tab
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active}
    title={label}
    className={`min-w-8 rounded px-2 py-1 text-sm font-medium transition-colors disabled:opacity-40 ${
      active ? "bg-brand text-brand-foreground" : "hover:bg-muted"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />;

const Toolbar = ({ editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      link: e.isActive("link"),
      table: e.isActive("table"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL (leave empty to remove the link)", previous);
    if (url === null) return;
    if (!url.trim()) return chain().extendMarkRange("link").unsetLink().run();
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const insertImage = (publicId) => {
    const alt = window.prompt("Describe the image for screen readers (alt text)", "") ?? "";
    // a Cloudinary delivery URL with automatic format/quality, capped at the article width
    const src = getCldImageUrl({ src: publicId, width: 1600, crop: "limit", format: "auto", quality: "auto" });
    chain().setImage({ src, alt }).run();
  };

  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
      <ToolbarButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}><b>B</b></ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}><i>I</i></ToolbarButton>
      <ToolbarButton label="Strikethrough" active={state.strike} onClick={() => chain().toggleStrike().run()}><s>S</s></ToolbarButton>
      <ToolbarButton label="Inline code" active={state.code} onClick={() => chain().toggleCode().run()}><code>{"<>"}</code></ToolbarButton>
      <ToolbarButton label="Link" active={state.link} onClick={setLink}>Link</ToolbarButton>
      <Divider />
      <ToolbarButton label="Heading 2" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
      <ToolbarButton label="Heading 3" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
      <ToolbarButton label="Bulleted list" active={state.bulletList} onClick={() => chain().toggleBulletList().run()}>• List</ToolbarButton>
      <ToolbarButton label="Numbered list" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>1. List</ToolbarButton>
      <ToolbarButton label="Quote" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()}>“ ”</ToolbarButton>
      <ToolbarButton label="Code block" active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>{"{ }"}</ToolbarButton>
      <ToolbarButton label="Divider" onClick={() => chain().setHorizontalRule().run()}>―</ToolbarButton>
      <Divider />
      <CloudinaryUploadButton
        folder="realhive/blog/inline"
        label="Insert image"
        onUploaded={insertImage}
        onMouseDown={(e) => e.preventDefault()}
        className="min-w-8 rounded px-2 py-1 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
      >
        Image
      </CloudinaryUploadButton>
      {state.table ? (
        <>
          <ToolbarButton label="Add row below" onClick={() => chain().addRowAfter().run()}>+Row</ToolbarButton>
          <ToolbarButton label="Add column right" onClick={() => chain().addColumnAfter().run()}>+Col</ToolbarButton>
          <ToolbarButton label="Delete row" onClick={() => chain().deleteRow().run()}>−Row</ToolbarButton>
          <ToolbarButton label="Delete column" onClick={() => chain().deleteColumn().run()}>−Col</ToolbarButton>
          <ToolbarButton label="Delete table" onClick={() => chain().deleteTable().run()}>×Table</ToolbarButton>
        </>
      ) : (
        <ToolbarButton label="Insert table" onClick={() => chain().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()}>Table</ToolbarButton>
      )}
      <Divider />
      <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>↶</ToolbarButton>
      <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>↷</ToolbarButton>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, id }) => {
  const [mode, setMode] = useState("visual");
  const [source, setSource] = useState(value);

  // useEditor calls editor.setOptions() whenever an option changes identity,
  // and setOptions redraws the view, which can drop keystrokes ProseMirror
  // hasn't read from the DOM yet. So every option must be stable: the initial
  // content is passed once (the editor owns the document after that),
  // editorProps is memoised, and onChange is read through a ref.
  const [initialContent] = useState(value);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const editorProps = useMemo(() => ({
    attributes: {
      ...(id ? { id } : {}),
      class: `${PROSE_CLASSES} min-h-[28rem] px-4 py-3 focus:outline-none`,
      "aria-label": "Post content",
    },
  }), [id]);

  const editor = useEditor({
    extensions,
    content: initialContent,
    contentType: "markdown",
    immediatelyRender: false, // avoid SSR hydration mismatches in Next.js
    editorProps,
    onUpdate: ({ editor: e }) => onChangeRef.current(e.getMarkdown()),
  });

  const switchMode = (next) => {
    if (next === mode || !editor) return;
    if (next === "markdown") {
      setSource(editor.getMarkdown());
    } else {
      editor.commands.setContent(source, { contentType: "markdown", emitUpdate: false });
      onChangeRef.current(editor.getMarkdown());
    }
    setMode(next);
  };

  return (
    <div className="mt-1 overflow-hidden rounded-md ring-1 ring-border focus-within:ring-2 focus-within:ring-brand">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-2 py-1">
        <div role="tablist" aria-label="Editor mode" className="flex gap-1 text-xs">
          {[["visual", "Visual"], ["markdown", "Markdown"]].map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => switchMode(key)}
              className={`rounded px-2.5 py-1 font-medium ${mode === key ? "bg-background ring-1 ring-border" : "text-muted-foreground"}`}>
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Saved as Markdown</span>
      </div>
      {mode === "visual" && editor && <Toolbar editor={editor} />}
      {/* The content scrolls inside the box so the toolbar above stays in reach on
          long posts (position: sticky can't work here: the root <main> clips overflow). */}
      {mode === "visual" ? (
        editor ? (
          <EditorContent editor={editor} className="max-h-[70vh] overflow-y-auto" />
        ) : (
          <div className="min-h-[28rem] px-4 py-3 text-sm text-muted-foreground">Loading editor…</div>
        )
      ) : (
        <textarea
          aria-label="Post content (Markdown)"
          rows={24}
          style={{ maxHeight: "70vh" }}
          value={source}
          onChange={(e) => { setSource(e.target.value); onChange(e.target.value); }}
          className="block w-full resize-y border-0 bg-transparent px-4 py-3 font-mono text-sm text-foreground focus:ring-0"
        />
      )}
    </div>
  );
};

export default RichTextEditor;
