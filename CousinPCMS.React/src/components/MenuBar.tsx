// MenuBar.tsx

import React, {useCallback} from 'react';
import {Editor} from '@tiptap/react';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  OrderedListOutlined,
  LinkOutlined,
  HighlightOutlined,
  ClearOutlined,
  MinusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {isActive?: boolean; title?: string}> = ({children, isActive, title, ...props}) => (
  <button type="button" title={title} className={`menu-button text-base flex items-center justify-center p-1.5 rounded ${isActive ? 'is-active bg-gray-200' : 'hover:bg-gray-100'}`} {...props}>
    {children}
  </button>
);

const MenuBar: React.FC<MenuBarProps> = ({editor}) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    setTimeout(() => {
      editor.chain().focus().extendMarkRange('link').setLink({href: previousUrl}).run();
    }, 0);
  }, [editor]);

  if (!editor) {
    return null;
  }

  const iconStyle = {fontSize: '1.10rem'};

  return (
    // Changed border to border-b for better integration with editor content area
    <div className="menu-bar-container p-1 border-b border-gray-300 bg-gray-50 flex flex-wrap items-center gap-1">
      {/* Bold */}
      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
        <BoldOutlined style={iconStyle} />
      </MenuButton>
      {/* Italic */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <ItalicOutlined style={iconStyle} />
      </MenuButton>
      {/* Underline */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <UnderlineOutlined style={iconStyle} />
      </MenuButton>
      {/* Strikethrough */}
      <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <StrikethroughOutlined style={iconStyle} />
      </MenuButton>

      {/* Block Type Select */}
      <select
        title="Block Type"
        value={editor.isActive('heading', {level: 1}) ? 'h1' : editor.isActive('heading', {level: 2}) ? 'h2' : editor.isActive('heading', {level: 3}) ? 'h3' : 'p'}
        onChange={(e) => {
          const value = e.target.value;
          const chain = editor.chain().focus();

          if (value === 'p') {
            chain.setParagraph().run();
          } else {
            const headingLevel = parseInt(value.replace('h', ''), 10) as 1 | 2 | 3;
            const isActive = editor.isActive('heading', {level: headingLevel});

            if (isActive) {
              chain.setParagraph().run(); // Unset if already active
            } else {
              chain.toggleHeading({level: headingLevel}).run();
            }
          }
        }}
        className="menu-button px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 h-[31.5px]"
      >
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <div className="h-5 w-px bg-gray-300 mx-1 self-center"></div>

      {/* Text Align Left */}
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        disabled={!editor.can().chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({textAlign: 'left'})}
        title="Align Left"
      >
        <AlignLeftOutlined style={iconStyle} />
      </MenuButton>
      {/* Text Align Center */}
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        disabled={!editor.can().chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({textAlign: 'center'})}
        title="Align Center"
      >
        <AlignCenterOutlined style={iconStyle} />
      </MenuButton>
      {/* Text Align Right */}
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        disabled={!editor.can().chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({textAlign: 'right'})}
        title="Align Right"
      >
        <AlignRightOutlined style={iconStyle} />
      </MenuButton>

      {/* Bullet List */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <UnorderedListOutlined style={iconStyle} />
      </MenuButton>
      {/* Ordered List */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <OrderedListOutlined style={iconStyle} />
      </MenuButton>

      <div className="h-5 w-px bg-gray-300 mx-1 self-center"></div>

      {/* Link */}
      <MenuButton onClick={setLink} disabled={!editor.can().setLink({href: ''})} isActive={editor.isActive('link')} title="Set Link">
        <LinkOutlined style={iconStyle} />
      </MenuButton>
      <div className="h-5 w-px bg-gray-300 mx-1 self-center"></div>

      {/* Highlight */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleHighlight({color: '#FFF3A3'}).run()}
        disabled={!editor.can().toggleHighlight()}
        isActive={editor.isActive('highlight', {color: '#FFF3A3'})}
        title="Highlight Text"
      >
        <HighlightOutlined style={iconStyle} />
      </MenuButton>
      {/* Clear Formatting */}
      <MenuButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} // .clearNodes() is optional, removes node formatting too
        disabled={!editor.can().unsetAllMarks()}
        title="Clear Formatting"
      >
        <ClearOutlined style={iconStyle} />
      </MenuButton>

      <div className="h-5 w-px bg-gray-300 mx-1 self-center"></div>
      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={!editor.can().setHorizontalRule()} title="Horizontal Rule">
        <MinusOutlined style={iconStyle} />
      </MenuButton>
    </div>
  );
};

export default MenuBar;
