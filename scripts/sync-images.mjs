#!/usr/bin/env node
//
// sync-images.mjs
//
// Can be run from either:
//   - project root:  node scripts/sync-images.mjs    (ROOT = project root)
//   - frontend dir:  node scripts/sync-images.mjs    (ROOT = frontend/)
//
// Scans assets/images/technology/ subdirectories and:
// 1. Copies files to public/images/technology/ (Korean to English filenames)
// 2. Generates src/data/technology-images.json (image arrays per category)
//
// If assets dir is missing (e.g. Docker), exits gracefully.
//

import { readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, existsSync } from 'fs'
import { join, extname, basename, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const FRONTEND_DIR = resolve(__dirname, '..')

// Try to find assets: either ../assets (from frontend/) or assets/ (from root)
const ASSETS_CANDIDATES = [
  join(FRONTEND_DIR, '..', 'assets', 'images', 'technology'),
  join(FRONTEND_DIR, 'assets', 'images', 'technology'),
]
const ASSETS_DIR = ASSETS_CANDIDATES.find(d => existsSync(d))

const PUBLIC_DIR = join(FRONTEND_DIR, 'public', 'images', 'technology')
const JSON_OUT   = join(FRONTEND_DIR, 'src', 'data', 'technology-images.json')

// Korean filename to English mapping
const KO_TO_EN = {
  '제초': 'weeding',
  '예초': 'mowing',
  '크레인_전정': 'crane_pruning',
  '정부과천청사_식재': 'government_building_planting',
  '한국도로공사_식재': 'highway_corp_planting',
  '방제1': 'control_work_1',
  '방제2': 'control_work_2',
  '방제작업1': 'control_work_3',
  '과천정부청사_위험목': 'government_building_risk_tree',
  '위험목제거': 'risk_tree_removal',
  '거리화분': 'street_planter',
  '걸이화분': 'hanging_planter',
  '대형화분': 'large_planter',
  '대형화분가을': 'planter_autumn',
  '디자인': 'design',
  '팬지': 'pansy',
  '진단': 'diagnosis',
  '치료': 'treatment',
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

// macOS uses NFD (decomposed) Unicode for filenames; normalize to NFC for mapping
function nfc(str) { return str.normalize('NFC') }

function toTag(filename) {
  const name = nfc(basename(filename, extname(filename)))
  if (name.toLowerCase() === 'before') return '전'
  if (name.toLowerCase() === 'after') return '후'
  return name.replace(/_/g, ' ')
}

function toEnglishFilename(koreanName) {
  const ext = extname(koreanName)
  const name = nfc(basename(koreanName, ext))

  // Already English
  if (/^[a-zA-Z0-9_\-]+$/.test(name)) return koreanName

  const mapped = KO_TO_EN[name]
  if (mapped) return `${mapped}${ext}`

  // Fallback: keep original
  console.warn(`  [warn] No English mapping for: ${koreanName}`)
  return koreanName
}

function syncCategory(categoryDir, categoryName) {
  const srcDir = join(ASSETS_DIR, categoryDir)
  const destDir = join(PUBLIC_DIR, categoryName)

  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })

  const files = readdirSync(srcDir).filter(f => {
    const ext = extname(f).toLowerCase()
    return IMAGE_EXTS.has(ext) && !f.startsWith('.')
  })

  const images = []

  for (const file of files) {
    const englishFile = toEnglishFilename(file)
    const srcPath = join(srcDir, file)
    const destPath = join(destDir, englishFile)

    copyFileSync(srcPath, destPath)

    const tag = toTag(file)
    const webPath = `/images/technology/${categoryName}/${englishFile}`

    images.push({
      src: webPath,
      tag,
      alt: tag,
    })
  }

  return images
}

function main() {
  console.log('sync-images: scanning for assets ...')

  if (!ASSETS_DIR) {
    console.log('sync-images: assets/images/technology/ not found, skipping.')
    return
  }

  console.log(`sync-images: found assets at ${ASSETS_DIR}`)

  const categories = readdirSync(ASSETS_DIR).filter(d => {
    const full = join(ASSETS_DIR, d)
    try {
      return statSync(full).isDirectory()
    } catch {
      return false
    }
  })

  const result = {}

  for (const cat of categories) {
    console.log(`  syncing: ${cat}`)
    result[cat] = syncCategory(cat, cat)
  }

  mkdirSync(join(FRONTEND_DIR, 'src', 'data'), { recursive: true })
  writeFileSync(JSON_OUT, JSON.stringify(result, null, 2) + '\n')

  console.log(`sync-images: wrote ${JSON_OUT}`)
  console.log('sync-images: done.')
}

main()
