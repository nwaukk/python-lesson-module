#!/usr/bin/env node
/**
 * Generates offline desktop application icons (build/icon.png and build/icon.ico)
 * using zero external dependencies or network requests.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = process.cwd();
const BUILD_DIR = path.join(ROOT, 'build');

fs.mkdirSync(BUILD_DIR, { recursive: true });

// CRC32 table for valid PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter None
    rgba.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function blendPixel(buf, idx, r, g, b, alpha) {
  if (alpha <= 0) return;
  const a = Math.min(1, alpha);
  const inv = 1 - a;
  buf[idx] = Math.round(r * a + buf[idx] * inv);
  buf[idx + 1] = Math.round(g * a + buf[idx + 1] * inv);
  buf[idx + 2] = Math.round(b * a + buf[idx + 2] * inv);
  buf[idx + 3] = Math.min(255, Math.round(255 * Math.max(a, buf[idx + 3] / 255)));
}

function sdRoundedBox(px, py, cx, cy, hw, hh, r) {
  const dx = Math.abs(px - cx) - (hw - r);
  const dy = Math.abs(py - cy) - (hh - r);
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(dx, dy), 0) - r;
}

function renderIconRgba(size) {
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Normalized [0, 1] coordinates
      const u = (x + 0.5) / size;
      const v = (y + 0.5) / size;
      const idx = (y * size + x) * 4;

      // Outer rounded square card
      const dOuter = sdRoundedBox(u, v, 0.5, 0.5, 0.45, 0.45, 0.19);
      const aaOuter = Math.max(0, Math.min(1, 0.5 - dOuter * size));

      if (aaOuter <= 0) continue;

      // Slate gradient background
      const grad = (u + v) * 0.5;
      buf[idx] = mix(15, 30, grad);
      buf[idx + 1] = mix(23, 41, grad);
      buf[idx + 2] = mix(42, 59, grad);
      buf[idx + 3] = Math.round(255 * aaOuter);

      // Crisp inner sky border ring
      const borderBand = Math.max(0, 1 - Math.abs(dOuter * size + 2.5) / 1.8);
      if (borderBand > 0) {
        blendPixel(buf, idx, 56, 189, 248, borderBand * 0.55 * aaOuter);
      }

      // Inner dark bezel
      const dInner = sdRoundedBox(u, v, 0.5, 0.5, 0.36, 0.36, 0.13);
      if (dInner < 0) {
        const innerA = Math.min(1, -dInner * size);
        blendPixel(buf, idx, 11, 18, 32, innerA * aaOuter);
      }

      // Upper-left Python blue glyph + horizontal connector
      const dTopCap = sdRoundedBox(u, v, 0.50, 0.31, 0.14, 0.085, 0.055);
      const dLeftArm = sdRoundedBox(u, v, 0.37, 0.44, 0.145, 0.075, 0.055);
      const dBlueBody = Math.min(dTopCap, dLeftArm);
      if (dBlueBody < 1.2 / size) {
        const alpha = Math.max(0, Math.min(1, 0.5 - dBlueBody * size));
        const r = mix(56, 79, (u + v) * 0.5);
        const g = mix(189, 70, (u + v) * 0.5);
        const b = mix(248, 229, (u + v) * 0.5);
        blendPixel(buf, idx, r, g, b, alpha * aaOuter);
      }

      // Lower-right Python amber glyph
      const dBotCap = sdRoundedBox(u, v, 0.50, 0.69, 0.14, 0.085, 0.055);
      const dRightArm = sdRoundedBox(u, v, 0.63, 0.56, 0.145, 0.075, 0.055);
      const dAmberBody = Math.min(dBotCap, dRightArm);
      if (dAmberBody < 1.2 / size) {
        const alpha = Math.max(0, Math.min(1, 0.5 - dAmberBody * size));
        const r = mix(251, 245, (u + v) * 0.5);
        const g = mix(191, 158, (u + v) * 0.5);
        const b = mix(36, 11, (u + v) * 0.5);
        blendPixel(buf, idx, r, g, b, alpha * aaOuter);
      }

      // Two clean Python eyes
      const eyeBlue = Math.hypot(u - 0.43, v - 0.285) - 0.022;
      if (eyeBlue < 1 / size) {
        const alpha = Math.max(0, Math.min(1, 0.5 - eyeBlue * size));
        blendPixel(buf, idx, 11, 18, 32, alpha * aaOuter);
      }
      const eyeAmber = Math.hypot(u - 0.57, v - 0.715) - 0.022;
      if (eyeAmber < 1 / size) {
        const alpha = Math.max(0, Math.min(1, 0.5 - eyeAmber * size));
        blendPixel(buf, idx, 11, 18, 32, alpha * aaOuter);
      }
    }
  }
  return buf;
}

function buildIcoFromPngs(frames) {
  // ICONDIR header (6 bytes) + N * ICONDIRENTRY (16 bytes each)
  const headerSize = 6 + frames.length * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = 1 (ICO)
  header.writeUInt16LE(frames.length, 4);

  let offset = headerSize;
  const chunks = [header];
  frames.forEach((frame, idx) => {
    const entryOffset = 6 + idx * 16;
    header[entryOffset] = frame.size >= 256 ? 0 : frame.size; // width (0 = 256)
    header[entryOffset + 1] = frame.size >= 256 ? 0 : frame.size; // height (0 = 256)
    header[entryOffset + 2] = 0; // color count
    header[entryOffset + 3] = 0; // reserved
    header.writeUInt16LE(1, entryOffset + 4); // planes
    header.writeUInt16LE(32, entryOffset + 6); // bpp
    header.writeUInt32LE(frame.png.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    offset += frame.png.length;
    chunks.push(frame.png);
  });

  return Buffer.concat(chunks);
}

const sizes = [16, 32, 48, 256];
const icoFrames = sizes.map((size) => ({
  size,
  png: encodePng(size, size, renderIconRgba(size)),
}));

const png512 = encodePng(512, 512, renderIconRgba(512));
fs.writeFileSync(path.join(BUILD_DIR, 'icon.png'), png512);
fs.writeFileSync(path.join(BUILD_DIR, 'icon.ico'), buildIcoFromPngs(icoFrames));

console.log('Generated build/icon.png (512x512) and build/icon.ico (16/32/48/256px).');
