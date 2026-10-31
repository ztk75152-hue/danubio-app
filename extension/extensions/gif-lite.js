"use strict";

(function(root) {
  function lzwDecode(minCodeSize, data) {
    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;
    var pos = 0, bitBuf = 0, bitCnt = 0;
    var dict, codeSize;
    function reset() {
      dict = [];
      for (var i = 0; i < clearCode; i++) dict[i] = [ i ];
      dict[clearCode] = null;
      dict[eoiCode] = null;
      codeSize = minCodeSize + 1;
    }
    reset();
    var out = [];
    var prev = null;
    function readCode() {
      while (bitCnt < codeSize) {
        if (pos >= data.length) return eoiCode;
        bitBuf |= data[pos++] << bitCnt;
        bitCnt += 8;
      }
      var code = bitBuf & (1 << codeSize) - 1;
      bitBuf >>= codeSize;
      bitCnt -= codeSize;
      return code;
    }
    var guard = 0;
    while (true) {
      if (guard++ > 2e7) break;
      var code = readCode();
      if (code === clearCode) {
        reset();
        prev = null;
        continue;
      }
      if (code === eoiCode) break;
      var entry;
      if (dict[code]) {
        entry = dict[code];
      } else if (code === dict.length && prev) {
        entry = prev.concat([ prev[0] ]);
      } else {
        break;
      }
      for (var j = 0; j < entry.length; j++) out.push(entry[j]);
      if (prev) {
        dict[dict.length] = prev.concat([ entry[0] ]);
        if (dict.length === 1 << codeSize && codeSize < 12) codeSize++;
      }
      prev = entry;
    }
    return out;
  }
  function deinterlace(indices, w, h) {
    var out = new Array(w * h);
    var passes = [ [ 0, 8 ], [ 4, 8 ], [ 2, 4 ], [ 1, 2 ] ];
    var srcRow = 0;
    for (var pi = 0; pi < passes.length; pi++) {
      var start = passes[pi][0], step = passes[pi][1];
      for (var row = start; row < h; row += step) {
        for (var col = 0; col < w; col++) out[row * w + col] = indices[srcRow * w + col];
        srcRow++;
      }
    }
    return out;
  }
  function decodeGif(bytes) {
    var p = 0;
    function u8() {
      return bytes[p++];
    }
    function u16() {
      var v = bytes[p] | bytes[p + 1] << 8;
      p += 2;
      return v;
    }
    var sig = String.fromCharCode(bytes[0], bytes[1], bytes[2]);
    if (sig !== "GIF") throw new Error("No es un GIF válido");
    p = 6;
    var screenW = u16(), screenH = u16();
    var packed = u8();
    var gctFlag = !!(packed & 128);
    var gctSize = 2 << (packed & 7);
    var bgIndex = u8();
    u8();
    var gct = null;
    if (gctFlag) {
      gct = [];
      for (var i = 0; i < gctSize; i++) {
        gct.push([ bytes[p], bytes[p + 1], bytes[p + 2] ]);
        p += 3;
      }
    }
    var frames = [];
    var loopCount = 0;
    var gceDelay = 10, gceDispose = 0, gceTransparent = -1, haveGce = false;
    var guard = 0;
    while (p < bytes.length) {
      if (guard++ > 1e5) break;
      var block = u8();
      if (block === 33) {
        var label = u8();
        if (label === 249) {
          u8();
          var packed2 = u8();
          gceDispose = packed2 >> 2 & 7;
          var transFlag = !!(packed2 & 1);
          gceDelay = u16();
          var transIndex = u8();
          u8();
          gceTransparent = transFlag ? transIndex : -1;
          haveGce = true;
        } else if (label === 255) {
          var appBlkSize = u8();
          var appId = "";
          for (var k = 0; k < appBlkSize; k++) appId += String.fromCharCode(bytes[p + k]);
          p += appBlkSize;
          var sub, subData = [];
          while ((sub = u8()) !== 0) {
            for (var m = 0; m < sub; m++) subData.push(bytes[p + m]);
            p += sub;
          }
          if (appId.indexOf("NETSCAPE") === 0 && subData.length >= 3 && subData[0] === 1) {
            loopCount = subData[1] | subData[2] << 8;
          }
        } else {
          var s2;
          while ((s2 = u8()) !== 0) p += s2;
        }
      } else if (block === 44) {
        var left = u16(), top = u16(), w = u16(), h = u16();
        var packed3 = u8();
        var lctFlag = !!(packed3 & 128);
        var interlace = !!(packed3 & 64);
        var lctSize = 2 << (packed3 & 7);
        var lct = null;
        if (lctFlag) {
          lct = [];
          for (var i2 = 0; i2 < lctSize; i2++) {
            lct.push([ bytes[p], bytes[p + 1], bytes[p + 2] ]);
            p += 3;
          }
        }
        var minCodeSize = u8();
        var imgData = [];
        var sb;
        while ((sb = u8()) !== 0) {
          for (var n = 0; n < sb; n++) imgData.push(bytes[p + n]);
          p += sb;
        }
        var indices = lzwDecode(minCodeSize, imgData);
        if (indices.length < w * h) {
          while (indices.length < w * h) indices.push(0);
        }
        if (interlace) indices = deinterlace(indices, w, h);
        frames.push({
          left: left,
          top: top,
          width: w,
          height: h,
          palette: lct || gct,
          indices: indices,
          delay: haveGce ? gceDelay : 10,
          dispose: haveGce ? gceDispose : 0,
          transparent: haveGce ? gceTransparent : -1
        });
        haveGce = false;
      } else if (block === 59) {
        break;
      } else {
        break;
      }
    }
    return {
      width: screenW,
      height: screenH,
      bgIndex: bgIndex,
      gct: gct,
      frames: frames,
      loopCount: loopCount
    };
  }
  function compositeFrames(gif) {
    var W = gif.width, H = gif.height;
    if (!W || !H || !gif.frames.length) return {
      width: W || 1,
      height: H || 1,
      frames: [],
      loopCount: 0
    };
    var canvas = new Uint8ClampedArray(W * H * 4);
    var result = [];
    var prevCanvas = null;
    for (var fi = 0; fi < gif.frames.length; fi++) {
      var f = gif.frames[fi];
      var pal = f.palette || gif.gct || [ [ 0, 0, 0 ] ];
      if (f.dispose === 3) prevCanvas = canvas.slice();
      for (var y = 0; y < f.height; y++) {
        for (var x = 0; x < f.width; x++) {
          var idx = f.indices[y * f.width + x];
          if (idx === f.transparent) continue;
          var color = pal[idx] || [ 0, 0, 0 ];
          var px = f.left + x, py = f.top + y;
          if (px < 0 || py < 0 || px >= W || py >= H) continue;
          var o = (py * W + px) * 4;
          canvas[o] = color[0];
          canvas[o + 1] = color[1];
          canvas[o + 2] = color[2];
          canvas[o + 3] = 255;
        }
      }
      result.push({
        rgba: canvas.slice(),
        delay: (f.delay || 10) * 10
      });
      if (f.dispose === 2) {
        for (var y2 = 0; y2 < f.height; y2++) {
          for (var x2 = 0; x2 < f.width; x2++) {
            var px2 = f.left + x2, py2 = f.top + y2;
            if (px2 < 0 || py2 < 0 || px2 >= W || py2 >= H) continue;
            var o2 = (py2 * W + px2) * 4;
            canvas[o2] = 0;
            canvas[o2 + 1] = 0;
            canvas[o2 + 2] = 0;
            canvas[o2 + 3] = 0;
          }
        }
      } else if (f.dispose === 3 && prevCanvas) {
        canvas = prevCanvas;
      }
    }
    return {
      width: W,
      height: H,
      frames: result,
      loopCount: gif.loopCount
    };
  }
  function resizeRGBA(src, sw, sh, dw, dh) {
    var dst = new Uint8ClampedArray(dw * dh * 4);
    for (var y = 0; y < dh; y++) {
      var sy = (y + .5) * sh / dh - .5;
      var sy0 = Math.floor(sy);
      if (sy0 < 0) sy0 = 0;
      var sy1 = Math.min(sh - 1, sy0 + 1);
      var fy = Math.max(0, sy - sy0);
      for (var x = 0; x < dw; x++) {
        var sx = (x + .5) * sw / dw - .5;
        var sx0 = Math.floor(sx);
        if (sx0 < 0) sx0 = 0;
        var sx1 = Math.min(sw - 1, sx0 + 1);
        var fx = Math.max(0, sx - sx0);
        for (var c = 0; c < 4; c++) {
          var v00 = src[(sy0 * sw + sx0) * 4 + c], v10 = src[(sy0 * sw + sx1) * 4 + c];
          var v01 = src[(sy1 * sw + sx0) * 4 + c], v11 = src[(sy1 * sw + sx1) * 4 + c];
          var top = v00 + (v10 - v00) * fx;
          var bot = v01 + (v11 - v01) * fx;
          dst[(y * dw + x) * 4 + c] = top + (bot - top) * fy;
        }
      }
    }
    return dst;
  }
  function buildPalette(framesRGBA, w, h, maxColors) {
    var samples = [];
    var totalPixels = w * h * framesRGBA.length;
    var stride = Math.max(1, Math.floor(totalPixels / 2e4));
    var counter = 0;
    for (var fi = 0; fi < framesRGBA.length; fi++) {
      var d = framesRGBA[fi];
      for (var i = 0; i < w * h; i++) {
        if (d[i * 4 + 3] < 128) {
          counter++;
          continue;
        }
        if (counter++ % stride === 0) samples.push([ d[i * 4], d[i * 4 + 1], d[i * 4 + 2] ]);
      }
    }
    if (samples.length === 0) samples.push([ 0, 0, 0 ]);
    var boxes = [ samples ];
    var guard = 0;
    while (boxes.length < maxColors && guard++ < maxColors * 2) {
      var bestIdx = -1, bestRange = -1, bestChannel = 0;
      for (var bi = 0; bi < boxes.length; bi++) {
        var box = boxes[bi];
        if (box.length < 2) continue;
        for (var ch = 0; ch < 3; ch++) {
          var mn = 255, mx = 0;
          for (var pi = 0; pi < box.length; pi++) {
            var v = box[pi][ch];
            if (v < mn) mn = v;
            if (v > mx) mx = v;
          }
          var range = mx - mn;
          if (range > bestRange) {
            bestRange = range;
            bestIdx = bi;
            bestChannel = ch;
          }
        }
      }
      if (bestIdx === -1 || bestRange <= 0) break;
      var target = boxes[bestIdx];
      target.sort(function(a, b) {
        return a[bestChannel] - b[bestChannel];
      });
      var mid = Math.floor(target.length / 2);
      boxes.splice(bestIdx, 1, target.slice(0, mid), target.slice(mid));
    }
    return boxes.map(function(box) {
      var r = 0, g = 0, b = 0;
      for (var i = 0; i < box.length; i++) {
        r += box[i][0];
        g += box[i][1];
        b += box[i][2];
      }
      var n = box.length || 1;
      return [ Math.round(r / n), Math.round(g / n), Math.round(b / n) ];
    });
  }
  function nearestPaletteIndex(palette, r, g, b) {
    var best = 0, bestDist = Infinity;
    for (var i = 0; i < palette.length; i++) {
      var p = palette[i];
      var dr = p[0] - r, dg = p[1] - g, db = p[2] - b;
      var dist = dr * dr + dg * dg + db * db;
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }
  function quantizeFrames(framesRGBA, w, h, maxColors) {
    var hasTransparency = false;
    outer: for (var fi = 0; fi < framesRGBA.length; fi++) {
      var d = framesRGBA[fi];
      for (var i = 0; i < w * h; i++) {
        if (d[i * 4 + 3] < 128) {
          hasTransparency = true;
          break outer;
        }
      }
    }
    var colorBudget = Math.max(2, hasTransparency ? maxColors - 1 : maxColors);
    var palette = buildPalette(framesRGBA, w, h, colorBudget);
    var transparentIndex = -1;
    if (hasTransparency) {
      transparentIndex = palette.length;
      palette.push([ 0, 0, 0 ]);
    }
    var cache = Object.create(null);
    var indexedFrames = framesRGBA.map(function(d) {
      var idx = new Uint8Array(w * h);
      for (var i = 0; i < w * h; i++) {
        if (hasTransparency && d[i * 4 + 3] < 128) {
          idx[i] = transparentIndex;
          continue;
        }
        var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
        var key = r << 16 | g << 8 | b;
        var found = cache[key];
        if (found === undefined) {
          found = nearestPaletteIndex(palette, r, g, b);
          cache[key] = found;
        }
        idx[i] = found;
      }
      return idx;
    });
    return {
      palette: palette,
      indexedFrames: indexedFrames,
      transparentIndex: transparentIndex
    };
  }
  function lzwEncode(minCodeSize, indices) {
    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;
    var codeSize, nextCode, dict;
    function reset() {
      dict = Object.create(null);
      nextCode = eoiCode + 1;
      codeSize = minCodeSize + 1;
    }
    reset();
    var bitBuf = 0, bitCnt = 0;
    var out = [];
    function emit(code) {
      bitBuf |= code << bitCnt;
      bitCnt += codeSize;
      while (bitCnt >= 8) {
        out.push(bitBuf & 255);
        bitBuf >>= 8;
        bitCnt -= 8;
      }
    }
    emit(clearCode);
    if (indices.length === 0) {
      emit(eoiCode);
      if (bitCnt > 0) out.push(bitBuf & 255);
      return out;
    }
    var prefixCode = indices[0];
    for (var i = 1; i < indices.length; i++) {
      var k = indices[i];
      var keyStr = prefixCode + "_" + k;
      if (dict[keyStr] !== undefined) {
        prefixCode = dict[keyStr];
      } else {
        emit(prefixCode);
        if (nextCode === 1 << codeSize && codeSize < 12) codeSize++;
        if (nextCode < 4096) {
          dict[keyStr] = nextCode;
          nextCode++;
        } else {
          emit(clearCode);
          reset();
        }
        prefixCode = k;
      }
    }
    emit(prefixCode);
    emit(eoiCode);
    if (bitCnt > 0) out.push(bitBuf & 255);
    return out;
  }
  function bitsFor(n) {
    var b = 1;
    while (1 << b < n) b++;
    return b;
  }
  function encodeGif(width, height, indexedFrames, palette, delaysMs, loopCount, transparentIndex) {
    var bytes = [];
    function u8(v) {
      bytes.push(v & 255);
    }
    function u16(v) {
      bytes.push(v & 255);
      bytes.push(v >> 8 & 255);
    }
    function str(s) {
      for (var i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
    }
    var code = 0;
    while (2 << code < palette.length && code < 7) code++;
    var gctSize = 2 << code;
    var minCodeSize = Math.max(2, code + 1);
    str("GIF89a");
    u16(width);
    u16(height);
    u8(128 | 112 | code);
    u8(0);
    u8(0);
    for (var i = 0; i < gctSize; i++) {
      var c = palette[i] || [ 0, 0, 0 ];
      u8(c[0]);
      u8(c[1]);
      u8(c[2]);
    }
    u8(33);
    u8(255);
    u8(11);
    str("NETSCAPE2.0");
    u8(3);
    u8(1);
    u16(loopCount || 0);
    u8(0);
    for (var f = 0; f < indexedFrames.length; f++) {
      u8(33);
      u8(249);
      u8(4);
      var transFlag = transparentIndex >= 0 ? 1 : 0;
      u8(2 << 2 | transFlag);
      var delayCs = Math.max(2, Math.round((delaysMs[f] || 100) / 10));
      u16(delayCs);
      u8(transparentIndex >= 0 ? transparentIndex : 0);
      u8(0);
      u8(44);
      u16(0);
      u16(0);
      u16(width);
      u16(height);
      u8(0);
      var lzwBytes = lzwEncode(minCodeSize, indexedFrames[f]);
      u8(minCodeSize);
      var pos = 0;
      while (pos < lzwBytes.length) {
        var chunk = Math.min(255, lzwBytes.length - pos);
        u8(chunk);
        for (var k = 0; k < chunk; k++) u8(lzwBytes[pos + k]);
        pos += chunk;
      }
      u8(0);
    }
    u8(59);
    return new Uint8Array(bytes);
  }
  function bytesToBase64(bytes) {
    if (typeof root.btoa === "function") {
      var bin = "";
      for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return root.btoa(bin);
    }
    return Buffer.from(bytes).toString("base64");
  }
  function dataUrlToBytes(dataUrl) {
    var b64 = dataUrl.split(",")[1] || "";
    if (typeof root.atob === "function") {
      var bin = root.atob(b64);
      var out = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  function shrinkGifDataUrl(dataUrl, options, cb) {
    options = options || {};
    var maxDim = options.maxDim || 160;
    var maxColors = options.maxColors || 128;
    var maxFrames = options.maxFrames || 40;
    try {
      var bytes = dataUrlToBytes(dataUrl);
      var gif = decodeGif(bytes);
      if (!gif.frames.length) {
        cb(null, {
          error: "sin-frames"
        });
        return;
      }
      var composited = compositeFrames(gif);
      var frames = composited.frames;
      if (frames.length > maxFrames) {
        var step = Math.ceil(frames.length / maxFrames);
        var kept = [];
        for (var i = 0; i < frames.length; i += step) {
          var acc = frames[i].delay;
          for (var j = i + 1; j < Math.min(i + step, frames.length); j++) acc += frames[j].delay;
          kept.push({
            rgba: frames[i].rgba,
            delay: acc
          });
        }
        frames = kept;
      }
      var srcW = composited.width, srcH = composited.height;
      var scale = Math.min(1, maxDim / Math.max(srcW, srcH));
      var dstW = Math.max(1, Math.round(srcW * scale));
      var dstH = Math.max(1, Math.round(srcH * scale));
      var resized = frames.map(function(f) {
        return scale < 1 ? resizeRGBA(f.rgba, srcW, srcH, dstW, dstH) : f.rgba;
      });
      var delays = frames.map(function(f) {
        return f.delay;
      });
      var q = quantizeFrames(resized, dstW, dstH, maxColors);
      var gifBytes = encodeGif(dstW, dstH, q.indexedFrames, q.palette, delays, composited.loopCount, q.transparentIndex);
      var out = "data:image/gif;base64," + bytesToBase64(gifBytes);
      cb(out, {
        width: dstW,
        height: dstH,
        frames: resized.length,
        colors: q.palette.length,
        bytes: gifBytes.length
      });
    } catch (e) {
      if (root.console) console.error("[GifLite] shrinkGifDataUrl falló:", e);
      cb(null, {
        error: e && e.message || String(e)
      });
    }
  }
  var api = {
    decodeGif: decodeGif,
    compositeFrames: compositeFrames,
    resizeRGBA: resizeRGBA,
    quantizeFrames: quantizeFrames,
    encodeGif: encodeGif,
    shrinkGifDataUrl: shrinkGifDataUrl,
    dataUrlToBytes: dataUrlToBytes,
    bytesToBase64: bytesToBase64
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.GifLite = api;
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);