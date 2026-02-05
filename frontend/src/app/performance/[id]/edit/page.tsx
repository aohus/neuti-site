'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import TiptapEditor from '@/components/Editor/TiptapEditor';
import { Performance } from '@/types/performance';
import Link from 'next/link';

// JSON Content Block 타입을 HTML로 변환하는 헬퍼 함수
const convertBlocksToHtml = (contentStr: string): string => {
  if (!contentStr) return '';
  
  // 1. JSON check
  try {
    const blocks = JSON.parse(contentStr);
    if (Array.isArray(blocks)) {
      return blocks.map((block: any) => {
        if (block.type === 'text') {
           return `<p>${block.value.replace(/\n/g, '<br>')}</p>`;
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
  console.log('Converted HTML Result:', finalHtml);
  return finalHtml;
};

export default function EditPerformancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);

  console.log('EditPerformancePage rendering, id:', id);

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<Performance>();

  useEffect(() => {
    console.log('useEffect triggered, id:', id);
    if (!id) return;

    const fetchData = async () => {
      try {
        console.log('Fetching data for id:', id);
        const res = await fetch(`/backend-api/performance/${id}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data: Performance = await res.json();
        console.log('Fetched data content:', data.content);
        
        // 데이터 변환 및 폼 초기화
        const htmlContent = convertBlocksToHtml(data.content);
        console.log('Converted HTML:', htmlContent);
        
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

  const onSubmit = async (data: Performance) => {
    try {
      const res = await fetch(`/backend-api/performance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
            alert('로그인이 필요하거나 세션이 만료되었습니다.');
            return;
        }
        throw new Error('Update failed');
      }

      alert('수정되었습니다.');
      router.push(`/performance/${id}`); // 상세 페이지 경로는 프로젝트 구조에 따라 다를 수 있음
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

         {/* Thumbnail URL */}
        <div>
            <label className="block text-sm font-medium mb-1">썸네일 URL</label>
            <input {...register('thumbnail_url')} className="w-full p-2 border rounded" />
            <p className="text-xs text-gray-500">이미지 주소를 입력하거나, 에디터에 업로드 후 주소를 복사하세요.</p>
        </div>


        {/* Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                content={field.value}
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
