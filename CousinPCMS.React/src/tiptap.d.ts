
import '@tiptap/core'; // This MUST be the first import for this specific augmentation

// Import types from extensions to help TS understand their command structures
import '@tiptap/starter-kit';
import '@tiptap/extension-underline';
import '@tiptap/extension-link';
import '@tiptap/extension-text-align';
import '@tiptap/extension-image';
import '@tiptap/extension-color';
import '@tiptap/extension-text-style';
import '@tiptap/extension-highlight';
import '@tiptap/extension-table';
import { FocusPosition } from '@tiptap/core';   // For focus command

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    // Commands from StarterKit
    toggleBold: () => ReturnType;
    toggleItalic: () => ReturnType;
    toggleStrike: () => ReturnType;
    toggleCode: () => ReturnType;
    toggleCodeBlock: () => ReturnType;
    setParagraph: () => ReturnType;
    toggleHeading: (attributes: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => ReturnType;
    toggleBulletList: () => ReturnType;
    toggleOrderedList: () => ReturnType;
    toggleBlockquote: () => ReturnType;
    setHorizontalRule: () => ReturnType;

    // Underline
    toggleUnderline: () => ReturnType;

    // Link
    setLink: (attributes: { href: string; target?: string | null; rel?: string | null; class?: string | null }) => ReturnType;
    unsetLink: () => ReturnType;
    extendMarkRange: ( // Corrected signature
      typeOrName: string | MarkType,
      attributes?: Record<string, any> | undefined
    ) => ReturnType;

    // TextAlign
    setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => ReturnType;
    unsetTextAlign: () => ReturnType;

    // Image
    setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;

    // Color & TextStyle
    setColor: (color: string) => ReturnType;
    unsetColor: () => ReturnType;

    // Highlight
    toggleHighlight: (attributes?: { color?: string } | undefined) => ReturnType;
    unsetHighlight: () => ReturnType;

    // Table commands
    insertTable: (options?: { rows?: number; cols?: number; withHeaderRow?: boolean }) => ReturnType;
    addColumnBefore: () => ReturnType;
    addColumnAfter: () => ReturnType;
    deleteColumn: () => ReturnType;
    addRowBefore: () => ReturnType;
    addRowAfter: () => ReturnType;
    deleteRow: () => ReturnType;
    deleteTable: () => ReturnType;
    mergeCells: () => ReturnType;
    splitCell: () => ReturnType;
    toggleHeaderColumn: () => ReturnType;
    toggleHeaderRow: () => ReturnType;
    toggleHeaderCell: () => ReturnType;
    mergeOrSplit: () => ReturnType;
    setCellAttribute: (name: string, value: any) => ReturnType;
    goToNextCell: () => ReturnType;
    goToPreviousCell: () => ReturnType;
    fixTables: () => ReturnType;

    // Core/General commands
    focus: (
      position?: FocusPosition | string | number | boolean | null,
      options?: { scrollIntoView?: boolean }
    ) => ReturnType;
    unsetAllMarks: () => ReturnType;
    clearNodes: () => ReturnType; // If you use it
  }
}