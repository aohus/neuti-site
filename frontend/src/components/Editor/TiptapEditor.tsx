'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

const TiptapEditor = ({ content, onChange, editable = true }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 border rounded-md',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            uploadImage(file).then((url) => {
              if (url) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            });
            return true; // Handled
          }
        }
        return false;
      },
    },
  });

  // 외부에서 content가 변경될 때 (초기 로딩 등) 에디터 내용 동기화
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/backend-api/upload/image', {
        method: 'POST',
        body: formData,
        // Next.js might need this to handle the proxy correctly if not configured globally
        // assuming standard fetch works with relative paths due to proxy setup
      });

      if (!response.ok) {
        console.error('Image upload failed');
        return null;
      }

      // The API returns the URL as a plain string (based on response_model=str)
      // If it returns JSON like "/uploads/...", we might need to parse it.
      // Checking the backend implementation: return f"/uploads/{file_name}"
      // FastAPI returns a string literal if response_model=str and it's just a string returned.
      // However, FastAPI typically wraps responses in JSON unless specified otherwise or using specific Response class.
      // Let's assume it returns a JSON string: "url"
      const url = await response.json();
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  
  // 간단한 툴바 구현
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {editable && (
        <div className="flex gap-2 border-b pb-2 mb-2 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded border ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            type="button"
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded border ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            type="button"
          >
            Italic
          </button>
           <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded border ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            type="button"
          >
            H2
          </button>
          <button
            onClick={addImage}
            className="px-2 py-1 rounded border"
            type="button"
          >
            Add Image (URL)
          </button>
           <label className="px-2 py-1 rounded border cursor-pointer hover:bg-gray-100">
            Upload Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadImage(file).then((url) => {
                    if (url) {
                      editor.chain().focus().setImage({ src: url }).run();
                    }
                  });
                }
              }}
            />
          </label>
        </div>
      )}
      <EditorContent editor={editor} />
      <p className="text-xs text-gray-500 mt-1">이미지를 드래그 앤 드롭하여 추가할 수 있습니다.</p>
    </div>
  );
};

export default TiptapEditor;
