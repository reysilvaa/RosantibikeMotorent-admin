"use client";

import React, { useEffect, useRef } from "react";
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
  Redo,
  Link2Off,
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
  const isInitialMount = useRef(true);
  const isUpdatingFromExternalValue = useRef(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Paragraph,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-6',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-6',
        },
      }),
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
      Code,
      CodeBlock,
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-neutral-300 dark:border-neutral-700 pl-4 italic',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      if (!isInitialMount.current && !isUpdatingFromExternalValue.current) {
        onChange(editor.getHTML());
      }
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
      isUpdatingFromExternalValue.current = true;
      editor.commands.setContent(value);
      setTimeout(() => {
        isUpdatingFromExternalValue.current = false;
      }, 0);
    }
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL tautan', previousUrl);
    
    if (url === null) {
      return;
    }
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    if (!isValidUrl(url)) {
      alert('URL tidak valid. Pastikan dimulai dengan http:// atau https://');
      return;
    }
    
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent({
        type: 'text',
        text: url,
        marks: [
          {
            type: 'link',
            attrs: {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
        ],
      }).run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
        .run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('URL gambar');
    
    if (url === null) {
      return;
    }
    
    if (url && !isValidUrl(url)) {
      alert('URL gambar tidak valid. Pastikan dimulai dengan http:// atau https://');
      return;
    }
    
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: 'Gambar' }).run();
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
          title="Bold (Ctrl+B)"
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
          title="Italic (Ctrl+I)"
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
          title="Underline (Ctrl+U)"
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
          title="Strikethrough"
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
          title="Heading 1"
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
          title="Heading 2"
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
          title="Bullet List"
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
          title="Ordered List"
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
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={removeLink}
          disabled={!editor.isActive('link') || disabled}
          title="Remove Link"
        >
          <Link2Off className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          disabled={disabled}
          title="Add Image"
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
          title="Inline Code"
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
          title="Blockquote"
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
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
} 