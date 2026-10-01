// Reads intrinsic dimensions from an MP4 by walking the moov > trak > tkhd box.
// Avoids depending on ffprobe, which isn't available on this machine.
// Usage: node scripts/mp4-dims.mjs <file...>

import { readFileSync, openSync, readSync, closeSync, statSync } from "node:fs";

function readBoxes(fd, start, end, path = "") {
  const boxes = [];
  let offset = start;
  while (offset + 8 <= end) {
    const header = Buffer.alloc(16);
    readSync(fd, header, 0, 16, offset);
    let size = header.readUInt32BE(0);
    const type = header.toString("latin1", 4, 8);
    let headerSize = 8;
    if (size === 1) {
      // 64-bit extended size
      size = Number(header.readBigUInt64BE(8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    if (size < headerSize) break;
    boxes.push({ type, start: offset, size, headerSize, path: path + "/" + type });
    offset += size;
  }
  return boxes;
}

function findDuration(fd, top) {
  const moov = top.find((b) => b.type === "moov");
  if (!moov) return null;
  // mvhd is the first child of moov, so skip moov's header *and* mvhd's own
  // 8-byte header before reading the payload.
  const child = readBoxes(fd, moov.start + moov.headerSize, moov.start + moov.size);
  const mvhd = child.find((b) => b.type === "mvhd");
  if (!mvhd) return null;
  const p = mvhd.start + mvhd.headerSize;
  const head = Buffer.alloc(4);
  readSync(fd, head, 0, 4, p);
  const version = head[0];
  const buf = Buffer.alloc(32);
  readSync(fd, buf, 0, 32, p);
  if (version === 1) {
    const timescale = buf.readUInt32BE(20);
    const dur = Number(buf.readBigUInt64BE(24));
    return timescale ? dur / timescale : null;
  }
  const timescale = buf.readUInt32BE(12);
  const dur = buf.readUInt32BE(16);
  return timescale ? dur / timescale : null;
}

function findDimensions(file) {
  const fd = openSync(file, "r");
  try {
    const fileSize = statSync(file).size;
    const top = readBoxes(fd, 0, fileSize);
    let seconds = null;
    try {
      seconds = findDuration(fd, top);
    } catch {
      seconds = null;
    }
    const moov = top.find((b) => b.type === "moov");
    if (!moov) return null;
    const moovStart = moov.start + moov.headerSize;
    const moovEnd = moov.start + moov.size;
    const traks = readBoxes(fd, moovStart, moovEnd, "moov").filter(
      (b) => b.type === "trak"
    );

    for (const trak of traks) {
      const trakStart = trak.start + trak.headerSize;
      const trakEnd = trak.start + trak.size;
      const kids = readBoxes(fd, trakStart, trakEnd, "trak");
      const tkhd = kids.find((b) => b.type === "tkhd");
      if (!tkhd) continue;
      const p = tkhd.start + tkhd.headerSize;
      const ver = Buffer.alloc(4);
      readSync(fd, ver, 0, 4, p);
      const version = ver[0];
      // Layout from the payload start:
      //   version+flags(4) [ ctime mtime ] trackID(4) reserved(4)
      //   duration(4) reserved(8) layer(2) altGroup(2) volume(2) reserved(2)
      //   matrix(36) width(4) height(4)
      // v0 times are 4+4; v1 times are 8+8.
      const off =
        version === 1
          ? 4 + 8 + 8 + 4 + 4 + 4 + 8 + 2 + 2 + 2 + 2 + 36
          : 4 + 4 + 4 + 4 + 4 + 4 + 8 + 2 + 2 + 2 + 2 + 36;
      const wh = Buffer.alloc(8);
      readSync(fd, wh, 0, 8, p + off);
      const width = wh.readUInt32BE(0) / 65536;
      const height = wh.readUInt32BE(4) / 65536;
      if (width > 0 && height > 0) {
        return { width: Math.round(width), height: Math.round(height) };
      }
    }
    return null;
  } finally {
    closeSync(fd);
  }
}

for (const file of process.argv.slice(2)) {
  let d = null;
  let seconds = null;
  const probe = openSync(file, "r");
  try {
    const probeTop = readBoxes(probe, 0, statSync(file).size);
    seconds = findDuration(probe, probeTop);
  } catch {
    seconds = null;
  } finally {
    closeSync(probe);
  }
  try {
    d = findDimensions(file);
  } catch {
    d = null;
  }
  const mb = (statSync(file).size / 1024 / 1024).toFixed(2);
  const orient = d
    ? d.height > d.width * 1.15
      ? "portrait"
      : d.width > d.height * 1.15
      ? "landscape"
      : "square"
    : "?";
  const dur =
    seconds && seconds > 0
      ? `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`
      : "-";
  console.log(`${file}\t${d ? d.width + "x" + d.height : "UNKNOWN"}\t${orient}\t${dur}\t${mb}MB`);
}