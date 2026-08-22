'use client'

import type { UseFormRegisterReturn } from 'react-hook-form'

interface HoneypotFieldProps {
  /** react-hook-form 의 register('website') 결과 */
  registration: UseFormRegisterReturn
}

// 사람에게는 보이지 않고 봇에게만 보이는 미끼 필드.
// display:none 은 일부 봇이 감지해 건너뛰므로, 화면 밖으로 밀어내는 방식을 쓴다.
// 스크린리더에는 aria-hidden 으로 숨기고, 키보드 이동은 tabIndex={-1} 로 막는다.
export default function HoneypotField({ registration }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
    >
      <label htmlFor="website">이 항목은 비워두세요</label>
      <input
        {...registration}
        id="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}
