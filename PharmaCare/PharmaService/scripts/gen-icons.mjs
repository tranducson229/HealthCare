import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(resolve(__dirname, 'pwa-icon.svg'))
const pub = resolve(__dirname, '..', 'public')

const jobs = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180, bg: '#0ca678' }, // iOS wants opaque
  { file: 'favicon-32x32.png', size: 32 },
]

for (const { file, size, bg } of jobs) {
  let img = sharp(svg).resize(size, size)
  if (bg) img = img.flatten({ background: bg })
  await img.png().toFile(resolve(pub, file))
  console.log('wrote', file)
}

// maskable: add safe padding so the cross is not clipped by mask shapes
const safe = 512
const pad = Math.round(safe * 0.14)
const inner = safe - pad * 2
const innerBuf = await sharp(svg).resize(inner, inner).png().toBuffer()
await sharp({
  create: { width: safe, height: safe, channels: 4, background: '#0ca678' },
})
  .composite([{ input: innerBuf, top: pad, left: pad }])
  .png()
  .toFile(resolve(pub, 'maskable-512x512.png'))
console.log('wrote maskable-512x512.png')
