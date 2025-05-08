import React, {useEffect} from 'react';
import {useEditor, EditorContent} from '@tiptap/react';
import MenuBar from './MenuBar';
import StarterKit from '@tiptap/starter-kit';

import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

interface RichTextEditorProps {
  value?: string;
  onChange?: (htmlContent: string) => void;
  maxLength?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({value = '', onChange, maxLength}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: true,
      }),
      OrderedList,
      ListItem,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Highlight.configure({multicolor: true}),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl prose-ul:list-disc prose-ol:list-decimal focus:outline-none max-w-full p-4 min-h-[150px]',
      },
    },
    onUpdate: ({editor: currentEditor}) => {
      const plainText = currentEditor.state.doc.textContent;
      if (maxLength && plainText.length > maxLength) {
        const trimmed = plainText.slice(0, maxLength);
        currentEditor.commands.setContent(trimmed);
        return;
      }
      const html = currentEditor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(value, false);
      }
    }
  }, [value, editor]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return <div className="tiptap-wrapper border border-gray-300 rounded-md shadow-sm overflow-hidden p-4">Loading Editor...</div>;
  }

  return (
    <div className="tiptap-wrapper border border-gray-300 rounded-md shadow-sm overflow-hidden">
      <MenuBar editor={editor} />
      <div className="h-[100px] overflow-y-scroll">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
