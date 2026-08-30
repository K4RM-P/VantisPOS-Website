import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F7F8F7"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1D9E75"/>
      <stop offset="100%" stop-color="#085041"/>
    </linearGradient>
  </defs>
  <rect x="460" y="330" width="40" height="80" rx="14" fill="url(#g)"/>
  <rect x="520" y="270" width="40" height="140" rx="14" fill="url(#g)"/>
  <rect x="580" y="190" width="40" height="220" rx="14" fill="url(#g)"/>
  <text x="600" y="470" font-family="Helvetica, Arial, sans-serif" font-size="56" font-weight="600" fill="#1A1F1D" text-anchor="middle">Vantis</text>
  <text x="600" y="510" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#4E564F" text-anchor="middle">Pharmacy point of sale, built for the register</text>
</svg>
`

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
console.log('OG image written to public/og-image.png')
