'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
const TiptapEditor = dynamic(() => import('@/components/Editor/TiptapEditor'), { ssr: false });
import { Performance } from '@/types/performance';
import { performanceApi } from '@/lib/performanceApi';
import Link from 'next/link';
import { Upload } from 'lucide-react';

// JSON Content Block 타입을 HTML로 변환하는 헬퍼 함수
const convertBlocksToHtml = (contentStr: string): string => {
  if (!contentStr) return '';

  // 1. JSON check
  try {
    const blocks = JSON.parse(contentStr);
    if (Array.isArray(blocks)) {
      return blocks.map((block: any) => {
        if (block.type === 'text') {
           // 각 줄을 개별 HTML 요소로 변환 (마크다운 → HTML)
           return block.value.split('\n').map((line: string) => {
             if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
             if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
             if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
             // 볼드: **text** → <strong>text</strong>
             const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
             return `<p>${formatted}</p>`;
           }).join('');
        } else if (block.type === 'image') {
          let src = block.value;
          if (src.includes('uploads/')) {
             src = '/uploads/' + src.split('uploads/')[1];
          }
          return `<img src="${src}" alt="image" />`;
        }
        return '';
      }).join('');
    }
  } catch (e) {
    // Not JSON
  }

  // 2. 이미 HTML인 경우 경로만 보정
  if (contentStr.includes('<p>') || contentStr.includes('<img')) {
      return contentStr.replace(/src="(.*?)uploads\/(.*?)"/g, 'src="/uploads/$2"');
  }

  // 3. 마크다운 변환 로직 개선
  let html = contentStr;

  // 모든 상대 경로를 절대 경로로 보정
  html = html.replace(/(\.\.\/)+uploads\//g, '/uploads/');

  // 가로선 (Horizontal Rule)
  html = html.replace(/^\s*---\s*$/gm, '<hr />');

  // 제목 (Headings)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // 이미지 (Images) - 마크다운 문법을 HTML 태그로 변환
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

  // 줄바꿈 및 문단 처리
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return ''; // 빈 줄 무시
      // 이미 HTML 태그로 시작하는 경우(제목, 이미지, 가로선 등) 그대로 반환
      if (/^<(h[1-6]|img|hr|li|ul|ol|p|div)/i.test(trimmed)) {
          return trimmed;
      }
      // 그 외 일반 텍스트는 <p>로 감싸서 Tiptap 호환성 확보
      return `<p>${line}</p>`;
  });

  const finalHtml = processedLines.join('');
  return finalHtml;
};

// TiptapEditor HTML을 JSON ContentBlock 배열로 변환
const convertHtmlToBlocks = (html: string): { type: string; value: string }[] => {
  if (!html || !html.trim()) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: { type: string; value: string }[] = [];
  let textLines: string[] = [];

  const flushText = () => {
    if (textLines.length > 0) {
      blocks.push({ type: 'text', value: textLines.join('\n') });
      textLines = [];
    }
  };

  // 인라인 서식을 마크다운으로 변환
  const getMarkdownText = (el: Element | ChildNode): string => {
    let result = '';
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent || '';
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = (child as Element).tagName.toLowerCase();
        if (tag === 'strong' || tag === 'b') {
          result += `**${getMarkdownText(child)}**`;
        } else if (tag === 'em' || tag === 'i') {
          result += `*${getMarkdownText(child)}*`;
        } else if (tag === 'br') {
          result += '\n';
        } else if (tag === 'img') {
          // 인라인 이미지는 별도 처리
        } else {
          result += getMarkdownText(child);
        }
      }
    }
    return result;
  };

  for (const node of doc.body.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) textLines.push(text);
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    // <p> 안에 <img>만 있는 경우 → 이미지 블록
    if (tag === 'p' && el.children.length === 1 && el.children[0].tagName?.toLowerCase() === 'img') {
      flushText();
      const img = el.children[0] as HTMLImageElement;
      blocks.push({ type: 'image', value: img.getAttribute('src') || '' });
      continue;
    }

    // 독립 <img>
    if (tag === 'img') {
      flushText();
      blocks.push({ type: 'image', value: el.getAttribute('src') || '' });
      continue;
    }

    // 제목
    if (tag === 'h1') { textLines.push(`# ${getMarkdownText(el)}`); continue; }
    if (tag === 'h2') { textLines.push(`## ${getMarkdownText(el)}`); continue; }
    if (tag === 'h3') { textLines.push(`### ${getMarkdownText(el)}`); continue; }

    // 일반 문단
    if (tag === 'p') {
      const imgs = el.querySelectorAll('img');
      if (imgs.length > 0) {
        // 인라인 이미지가 있으면 텍스트/이미지 분리
        const md = getMarkdownText(el).trim();
        if (md) textLines.push(md);
        flushText();
        imgs.forEach(img => {
          blocks.push({ type: 'image', value: img.getAttribute('src') || '' });
        });
      } else {
        const md = getMarkdownText(el);
        if (md.trim()) textLines.push(md);
      }
      continue;
    }

    // 리스트
    if (tag === 'ul' || tag === 'ol') {
      el.querySelectorAll('li').forEach((li, i) => {
        const prefix = tag === 'ol' ? `${i + 1}. ` : '- ';
        textLines.push(`${prefix}${getMarkdownText(li)}`);
      });
      continue;
    }

    // 인용문
    if (tag === 'blockquote') {
      textLines.push(`> ${getMarkdownText(el)}`);
      continue;
    }

    // 수평선
    if (tag === 'hr') { textLines.push('---'); continue; }

    // 기타
    const text = getMarkdownText(el);
    if (text.trim()) textLines.push(text);
  }

  flushText();
  return blocks;
};

const JOB_MAIN_OPTIONS = [
  '소나무전정',
  '꽃식재',
  '잔디깎이',
  '수목전정',
  '대형목이식',
  '수세회복',
  '고사목제거',
  '병해충방제',
  '수간주사',
];

const SITE_TYPE_OPTIONS = [
  '공공기관',
  '아파트',
  '학교',
  '공원',
  '도로',
  '기타',
];

export default function EditPerformancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<Performance>();

  const thumbnailUrl = watch('thumbnail_url');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/backend-api/performance/${id}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data: Performance = await res.json();

        // 데이터 변환 및 폼 초기화
        const htmlContent = convertBlocksToHtml(data.content);

        reset({
          ...data,
          content: htmlContent,
        });
      } catch (error) {
        console.error('Error fetching performance:', error);
        alert('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailUploading(true);
    try {
      const url = await performanceApi.uploadImage(file);
      setValue('thumbnail_url', url);
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      alert('썸네일 업로드에 실패했습니다.');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const onSubmit = async (data: Performance) => {
    try {
      // TiptapEditor HTML → JSON ContentBlock 배열로 변환하여 저장
      const contentBlocks = convertHtmlToBlocks(data.content);
      const payload = {
        ...data,
        content: JSON.stringify(contentBlocks),
      };

      const res = await fetch(`/backend-api/performance/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
            alert('로그인이 필요하거나 세션이 만료되었습니다.');
            return;
        }
        throw new Error('Update failed');
      }

      alert('수정되었습니다.');
      router.push(`/performance/${id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">시공사례 수정</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            {...register('title', { required: '제목은 필수입니다.' })}
            className="w-full p-2 border rounded"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        {/* Category & Year */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <select {...register('category')} className="w-full p-2 border rounded">
                    <option value="">선택하세요</option>
                    <option value="나무병원">나무병원</option>
                    <option value="조경식재">조경식재</option>
                </select>
            </div>
            <div>
                 <label className="block text-sm font-medium mb-1">연도</label>
                 <input type="number" {...register('year')} className="w-full p-2 border rounded" />
            </div>
        </div>

        {/* Other Metadata */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">발주처</label>
                <input {...register('client')} className="w-full p-2 border rounded" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">현장 위치</label>
                <input {...register('site_location')} className="w-full p-2 border rounded" />
            </div>
        </div>

        {/* Job Category & Sub Category */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">작업 대분류</label>
                <select {...register('job_main_category')} className="w-full p-2 border rounded">
                    <option value="">선택하세요</option>
                    {JOB_MAIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">작업 소분류</label>
                <input {...register('job_sub_category')} className="w-full p-2 border rounded" placeholder="예: 수간주사, 가지치기" />
            </div>
        </div>

        {/* Site Type & Construction Date */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">현장 유형</label>
                <select {...register('site_type')} className="w-full p-2 border rounded">
                    <option value="">선택하세요</option>
                    {SITE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">시공일</label>
                <input type="date" {...register('construction_date')} className="w-full p-2 border rounded" />
            </div>
        </div>

        {/* Thumbnail */}
        <div>
            <label className="block text-sm font-medium mb-1">썸네일</label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input {...register('thumbnail_url')} className="w-full p-2 border rounded" placeholder="이미지 URL" />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={thumbnailUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Upload size={14} />
                    {thumbnailUploading ? '업로드 중...' : '파일 업로드'}
                  </button>
                </div>
              </div>
              {thumbnailUrl && (
                <div className="w-32 h-20 rounded border overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={thumbnailUrl} alt="썸네일 미리보기" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                content={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Link href={`/performance/${id}`} className="px-4 py-2 border rounded hover:bg-gray-100">
            취소
          </Link>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
