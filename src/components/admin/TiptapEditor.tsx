// components/admin/TiptapEditor.tsx
"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

interface Props {
  initialContent?: string;
  onChange?: (html: string) => void;
  onReady?: (editorInstance: any | null) => void;
}

function MenuBar({ editor }: { editor: any | null }) {
  if (!editor) return null;

  const btn = (fn: () => void, label: string, active = false) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fn();
      }}
      className={`px-2 py-1 rounded-md text-sm border ${
        active ? "bg-gray-200" : "bg-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {btn(() => editor.chain().focus().toggleBold().run(), "B", editor.isActive("bold"))}
      {btn(() => editor.chain().focus().toggleItalic().run(), "I", editor.isActive("italic"))}
      {btn(() => editor.chain().focus().toggleStrike().run(), "S", editor.isActive("strike"))}
      {btn(() => editor.chain().focus().toggleCode().run(), "Code", editor.isActive("code"))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), "• List", editor.isActive("bulletList"))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), "1. List", editor.isActive("orderedList"))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), "“ Quote", editor.isActive("blockquote"))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", editor.isActive("heading", { level: 2 }))} 
      {btn(() => editor.chain().focus().unsetAllMarks().run(), "Clear")}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt("Enter URL");
          if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
        className="px-2 py-1 rounded-md text-sm border bg-white"
      >
        Link
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt("Image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="px-2 py-1 rounded-md text-sm border bg-white"
      >
        Image
      </button>
    </div>
  );
}

export default function TiptapEditor({
  initialContent = "",
  onChange,
  onReady,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Image,
      Placeholder.configure({
        placeholder: "Type the question here...",
        showOnlyWhenEditable: true,
      }),
      CharacterCount.configure({ limit: 20000 }),
    ],
    content: initialContent || "", // ✅ no <p></p>
    editorProps: {
      attributes: {
        class: "prose max-w-none p-2 outline-none focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    onReady?.(editor ?? null);
    return () => onReady?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <div className="border rounded-md bg-white">
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="p-4 text-gray-500 italic">Loading editor...</div>
        )}
      </div>
    </div>
  );
}
