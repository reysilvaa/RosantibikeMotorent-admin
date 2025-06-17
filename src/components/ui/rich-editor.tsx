"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  Strikethrough as StrikeIcon, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  Quote as QuoteIcon,
  Undo,
  Redo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  editorClassName?: string;
  disabled?: boolean;
}

export function RichEditor({
  value,
  onChange,
  className,
  editorClassName,
  disabled = false,
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Code,
      CodeBlock,
      Blockquote,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4",
          editorClassName
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const addImage = () => {
    const url = window.prompt("URL gambar");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={cn("border rounded-md overflow-hidden border-neutral-200 dark:border-neutral-800", className)}>
      <div className="flex flex-wrap gap-1 border-b bg-neutral-50 dark:bg-neutral-900 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive("underline") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(editor.isActive("strike") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <StrikeIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(editor.isActive("heading", { level: 1 }) ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive("heading", { level: 2 }) ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive("bulletList") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive("orderedList") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn(editor.isActive("link") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          disabled={disabled}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(editor.isActive("code") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <CodeIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive("blockquote") ? "bg-neutral-200 dark:bg-neutral-800" : "")}
          disabled={disabled}
        >
          <QuoteIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || disabled}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
} 