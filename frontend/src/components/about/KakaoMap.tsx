'use client'

import React, { useEffect } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoMap() {
  useEffect(() => {
    const script = document.createElement('script')
    // 발급받으신 카카오 API 키가 있다면 여기에 넣으시면 됩니다.
    // 지금은 데모용 키를 사용하거나 스크립트 로드 구조만 잡습니다.
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7662c5c938367a7470f1a2386161405e&autoload=false`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map')
        const options = {
          center: new window.kakao.maps.LatLng(37.4526, 127.146), // 본점 위치 (수정구 공원로)
          level: 4
        }
        const map = new window.kakao.maps.Map(container, options)

        // 본점 마커
        const mainMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(37.4526, 127.146),
          map: map,
          title: '느티나무병원 협동조합 본점'
        })

        // 분당지점 마커 (분당구 성남대로)
        const branchMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(37.3827, 127.1124),
          map: map,
          title: '느티나무병원 협동조합 분당지점'
        })
      })
    }
  }, [])

  return <div id="map" className="h-full w-full" />
}
