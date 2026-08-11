(function () {
  "use strict";

  var $ = function (selector) {
    return document.querySelector(selector);
  };

  var $$ = function (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  };

  var dom = {
    fileInput: $("#fileInput"),
    uploadButton: $("#uploadButton"),
    demoButton: $("#demoButton"),
    dropZone: $("#dropZone"),
    targetPreset: $("#targetPreset"),
    markAreaButton: $("#markAreaButton"),
    clearAreasButton: $("#clearAreasButton"),
    markingStatus: $("#markingStatus"),
    sampleAButton: $("#sampleAButton"),
    sampleBButton: $("#sampleBButton"),
    sampleADot: $("#sampleADot"),
    sampleBDot: $("#sampleBDot"),
    resetSamplesButton: $("#resetSamplesButton"),
    canvasStage: $("#canvasStage"),
    canvasScaleWrap: $("#canvasScaleWrap"),
    viewCanvas: $("#viewCanvas"),
    overlayCanvas: $("#overlayCanvas"),
    stageHint: $("#stageHint"),
    imageTitle: $("#imageTitle"),
    imageMeta: $("#imageMeta"),
    readinessEyebrow: $("#readinessEyebrow"),
    readinessTitle: $("#readinessTitle"),
    readinessCopy: $("#readinessCopy"),
    areaMetric: $("#areaMetric"),
    sampleMetric: $("#sampleMetric"),
    riskMetric: $("#riskMetric"),
    contrastRatio: $("#contrastRatio"),
    contrastBadge: $("#contrastBadge"),
    contrastDetail: $("#contrastDetail"),
    findingsList: $("#findingsList"),
    paletteGrid: $("#paletteGrid"),
    paletteCount: $("#paletteCount"),
    refreshAnalysisButton: $("#refreshAnalysisButton"),
    exportImageButton: $("#exportImageButton"),
    exportReportButton: $("#exportReportButton"),
    aboutButton: $("#aboutButton"),
    aboutDialog: $("#aboutDialog"),
    closeAboutButton: $("#closeAboutButton")
  };

  var sourceCanvas = document.createElement("canvas");
  var sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  var viewContext = dom.viewCanvas.getContext("2d", { willReadFrequently: true });
  var overlayContext = dom.overlayCanvas.getContext("2d");

  var state = {
    mode: "original",
    target: "phone",
    title: "示例 · 信息流推广图",
    originalWidth: 1200,
    originalHeight: 800,
    keyAreas: [],
    draftArea: null,
    marking: false,
    pointerStart: null,
    activeSample: "a",
    samples: {
      a: null,
      b: null
    },
    palette: [],
    potentialRisks: []
  };

  var modeLabels = {
    original: "原图",
    small: "小屏模拟",
    gray: "灰阶",
    protanopia: "红弱模拟",
    deuteranopia: "绿弱模拟",
    tritanopia: "蓝弱模拟"
  };

  var targetLabels = {
    phone: "手机信息流",
    desktop: "桌面网页",
    poster: "远看海报"
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function rounded(value) {
    return Math.round(value);
  }

  function rgbToHex(rgb) {
    return "#" + [rgb.r, rgb.g, rgb.b].map(function (channel) {
      return clamp(rounded(channel), 0, 255).toString(16).padStart(2, "0");
    }).join("").toUpperCase();
  }

  function rgbCss(rgb) {
    return "rgb(" + rounded(rgb.r) + ", " + rounded(rgb.g) + ", " + rounded(rgb.b) + ")";
  }

  function getLuminance(rgb) {
    var values = [rgb.r, rgb.g, rgb.b].map(function (value) {
      var channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  }

  function getContrast(rgbA, rgbB) {
    var light = Math.max(getLuminance(rgbA), getLuminance(rgbB));
    var dark = Math.min(getLuminance(rgbA), getLuminance(rgbB));
    return (light + 0.05) / (dark + 0.05);
  }

  function colorDistance(rgbA, rgbB) {
    return Math.sqrt(
      Math.pow(rgbA.r - rgbB.r, 2) +
      Math.pow(rgbA.g - rgbB.g, 2) +
      Math.pow(rgbA.b - rgbB.b, 2)
    );
  }

  function applyMatrix(rgb, matrix) {
    return {
      r: clamp(rgb.r * matrix[0] + rgb.g * matrix[1] + rgb.b * matrix[2], 0, 255),
      g: clamp(rgb.r * matrix[3] + rgb.g * matrix[4] + rgb.b * matrix[5], 0, 255),
      b: clamp(rgb.r * matrix[6] + rgb.g * matrix[7] + rgb.b * matrix[8], 0, 255)
    };
  }

  function simulateColor(rgb, mode) {
    if (mode === "gray") {
      var gray = rounded(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
      return { r: gray, g: gray, b: gray };
    }

    if (mode === "protanopia") {
      return applyMatrix(rgb, [
        0.56667, 0.43333, 0,
        0.55833, 0.44167, 0,
        0, 0.24167, 0.75833
      ]);
    }

    if (mode === "deuteranopia") {
      return applyMatrix(rgb, [
        0.625, 0.375, 0,
        0.7, 0.3, 0,
        0, 0.3, 0.7
      ]);
    }

    if (mode === "tritanopia") {
      return applyMatrix(rgb, [
        0.95, 0.05, 0,
        0, 0.43333, 0.56667,
        0, 0.475, 0.525
      ]);
    }

    return { r: rgb.r, g: rgb.g, b: rgb.b };
  }

  function transformImageData(imageData, mode) {
    if (mode === "original" || mode === "small") {
      return imageData;
    }

    var pixels = imageData.data;
    for (var index = 0; index < pixels.length; index += 4) {
      var transformed = simulateColor({
        r: pixels[index],
        g: pixels[index + 1],
        b: pixels[index + 2]
      }, mode);
      pixels[index] = rounded(transformed.r);
      pixels[index + 1] = rounded(transformed.g);
      pixels[index + 2] = rounded(transformed.b);
    }
    return imageData;
  }

  function normalizeSourceDimensions(width, height) {
    var maxPixels = 2400000;
    var maxSide = 1800;
    var factor = Math.min(1, maxSide / Math.max(width, height), Math.sqrt(maxPixels / (width * height)));
    return {
      width: Math.max(1, rounded(width * factor)),
      height: Math.max(1, rounded(height * factor))
    };
  }

  function setSourceDimensions(width, height) {
    var normalized = normalizeSourceDimensions(width, height);
    sourceCanvas.width = normalized.width;
    sourceCanvas.height = normalized.height;
  }

  function drawRoundRect(context, x, y, width, height, radius) {
    var safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.arcTo(x + width, y, x + width, y + height, safeRadius);
    context.arcTo(x + width, y + height, x, y + height, safeRadius);
    context.arcTo(x, y + height, x, y, safeRadius);
    context.arcTo(x, y, x + width, y, safeRadius);
    context.closePath();
  }

  function loadDemo() {
    state.title = "示例 · 信息流推广图";
    state.originalWidth = 1200;
    state.originalHeight = 800;
    setSourceDimensions(1200, 800);

    var context = sourceContext;
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
    var background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "#F7DFC1");
    background.addColorStop(0.52, "#EED7D1");
    background.addColorStop(1, "#D9E5DA");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    context.globalAlpha = 0.72;
    context.fillStyle = "#FFECCA";
    context.beginPath();
    context.arc(150, 104, 116, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#B8DCCB";
    context.beginPath();
    context.arc(1060, 698, 168, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;

    drawRoundRect(context, 58, 54, 1084, 692, 34);
    context.fillStyle = "#FFFDF7";
    context.fill();
    context.strokeStyle = "rgba(34, 42, 52, 0.1)";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "#C35442";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText("WEEKEND RESET CLUB", 122, 149);

    context.fillStyle = "#1D3246";
    context.font = "700 67px system-ui, sans-serif";
    context.fillText("忙到满格前，", 119, 249);
    context.fillText("把一小时留给自己。", 119, 329);

    context.fillStyle = "#8D9AA2";
    context.font = "400 24px system-ui, sans-serif";
    context.fillText("一个不赶时间的周末练习：呼吸、拉伸、喝一杯热茶。", 121, 384);

    drawRoundRect(context, 120, 440, 278, 72, 18);
    context.fillStyle = "#1F866D";
    context.fill();
    context.fillStyle = "#BEE59A";
    context.font = "700 24px system-ui, sans-serif";
    context.fillText("今晚 20:00 直播", 156, 486);

    context.fillStyle = "#7775D9";
    context.font = "500 19px system-ui, sans-serif";
    context.fillText("带上耳机，给自己留一点空间", 122, 555);

    drawRoundRect(context, 726, 119, 291, 514, 39);
    context.fillStyle = "#243346";
    context.fill();
    drawRoundRect(context, 744, 151, 255, 432, 27);
    context.fillStyle = "#FBE6CC";
    context.fill();

    context.fillStyle = "#E76B66";
    context.beginPath();
    context.arc(868, 315, 76, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#78AB5D";
    context.beginPath();
    context.arc(917, 315, 76, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#FCEFD8";
    context.beginPath();
    context.arc(891, 293, 50, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#243346";
    context.beginPath();
    context.arc(873, 292, 5, 0, Math.PI * 2);
    context.arc(908, 292, 5, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#243346";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(890, 320, 23, 0.2, Math.PI - 0.2);
    context.stroke();

    context.fillStyle = "#17314A";
    context.font = "700 25px system-ui, sans-serif";
    context.fillText("你的今天，", 783, 420);
    context.fillText("也值得被温柔对待", 773, 454);

    drawRoundRect(context, 782, 496, 180, 48, 15);
    context.fillStyle = "#EEAB62";
    context.fill();
    context.fillStyle = "#624726";
    context.font = "700 16px system-ui, sans-serif";
    context.fillText("查看本周计划", 812, 526);

    context.fillStyle = "#98A3AB";
    context.font = "500 16px system-ui, sans-serif";
    context.fillText("把“待会儿再说”换成一个呼吸。", 121, 647);

    resetInteractionState();
    analyzeImage();
    render();
  }

  function resetInteractionState() {
    state.keyAreas = [];
    state.draftArea = null;
    state.pointerStart = null;
    state.marking = false;
    state.activeSample = "a";
    state.samples.a = null;
    state.samples.b = null;
    updateMarkingUi();
    updateSampleControls();
  }

  function importImage(file) {
    if (!file || !file.type || file.type.indexOf("image/") !== 0) {
      setStageHint("请选择 PNG、JPG、WebP、GIF 或 SVG 图片。");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.onload = function () {
        state.title = file.name.replace(/\.[^/.]+$/, "") || "未命名成品图";
        state.originalWidth = image.naturalWidth;
        state.originalHeight = image.naturalHeight;
        setSourceDimensions(image.naturalWidth, image.naturalHeight);
        sourceContext.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
        sourceContext.drawImage(image, 0, 0, sourceCanvas.width, sourceCanvas.height);
        resetInteractionState();
        analyzeImage();
        render();
        setStageHint("已导入。先框选标题、价格或按钮，再切换不同视图检查。");
      };
      image.onerror = function () {
        setStageHint("这张图片暂时无法读取，请换一张 PNG、JPG、WebP 或 SVG。");
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function render() {
    if (!sourceCanvas.width || !sourceCanvas.height) {
      return;
    }

    var renderScale = state.mode === "small" ? Math.min(1, 320 / sourceCanvas.width) : 1;
    var renderWidth = Math.max(1, rounded(sourceCanvas.width * renderScale));
    var renderHeight = Math.max(1, rounded(sourceCanvas.height * renderScale));
    dom.viewCanvas.width = renderWidth;
    dom.viewCanvas.height = renderHeight;
    dom.overlayCanvas.width = renderWidth;
    dom.overlayCanvas.height = renderHeight;

    viewContext.imageSmoothingEnabled = true;
    viewContext.imageSmoothingQuality = "high";
    viewContext.clearRect(0, 0, renderWidth, renderHeight);
    viewContext.drawImage(sourceCanvas, 0, 0, renderWidth, renderHeight);

    if (state.mode !== "original" && state.mode !== "small") {
      var transformed = viewContext.getImageData(0, 0, renderWidth, renderHeight);
      viewContext.putImageData(transformImageData(transformed, state.mode), 0, 0);
    }

    var cssMaxWidth = {
      phone: 390,
      desktop: 900,
      poster: 248
    }[state.target];

    if (state.mode === "small") {
      cssMaxWidth = Math.min(cssMaxWidth, 320);
    }

    dom.canvasScaleWrap.style.width = Math.min(renderWidth, cssMaxWidth) + "px";
    dom.imageTitle.textContent = state.title;
    dom.imageMeta.textContent = state.originalWidth + " × " + state.originalHeight + " px";
    refreshSampleColors();
    drawOverlay();
    updateReport();
    updateStageHint();
  }

  function refreshSampleColors() {
    ["a", "b"].forEach(function (sampleKey) {
      var sample = state.samples[sampleKey];
      if (!sample || !dom.viewCanvas.width || !dom.viewCanvas.height) {
        return;
      }
      var x = clamp(rounded(sample.u * (dom.viewCanvas.width - 1)), 0, dom.viewCanvas.width - 1);
      var y = clamp(rounded(sample.v * (dom.viewCanvas.height - 1)), 0, dom.viewCanvas.height - 1);
      var pixel = viewContext.getImageData(x, y, 1, 1).data;
      sample.rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
    });
  }

  function getPointerPosition(event, targetCanvas) {
    var rect = targetCanvas.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) * (targetCanvas.width / rect.width), 0, targetCanvas.width),
      y: clamp((event.clientY - rect.top) * (targetCanvas.height / rect.height), 0, targetCanvas.height)
    };
  }

  function normalizeArea(start, end) {
    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y)
    };
  }

  function toRelativeArea(area) {
    return {
      x: area.x / dom.viewCanvas.width,
      y: area.y / dom.viewCanvas.height,
      width: area.width / dom.viewCanvas.width,
      height: area.height / dom.viewCanvas.height
    };
  }

  function relativeToCanvas(area) {
    return {
      x: area.x * dom.overlayCanvas.width,
      y: area.y * dom.overlayCanvas.height,
      width: area.width * dom.overlayCanvas.width,
      height: area.height * dom.overlayCanvas.height
    };
  }

  function drawOverlay() {
    var width = dom.overlayCanvas.width;
    var height = dom.overlayCanvas.height;
    overlayContext.clearRect(0, 0, width, height);

    state.keyAreas.forEach(function (area, index) {
      var drawArea = relativeToCanvas(area);
      overlayContext.save();
      overlayContext.setLineDash([]);
      overlayContext.lineWidth = Math.max(2, width / 420);
      overlayContext.strokeStyle = "#F4C94B";
      overlayContext.fillStyle = "rgba(244, 201, 75, 0.16)";
      overlayContext.fillRect(drawArea.x, drawArea.y, drawArea.width, drawArea.height);
      overlayContext.strokeRect(drawArea.x, drawArea.y, drawArea.width, drawArea.height);
      var label = "关键 " + (index + 1);
      overlayContext.font = "700 " + Math.max(11, width / 55) + "px system-ui, sans-serif";
      var labelWidth = overlayContext.measureText(label).width + 12;
      var labelHeight = Math.max(18, width / 27);
      overlayContext.fillStyle = "#F4C94B";
      overlayContext.fillRect(drawArea.x, Math.max(0, drawArea.y - labelHeight), labelWidth, labelHeight);
      overlayContext.fillStyle = "#33290B";
      overlayContext.fillText(label, drawArea.x + 6, Math.max(labelHeight - 5, drawArea.y - 5));
      overlayContext.restore();
    });

    if (state.draftArea) {
      var draft = state.draftArea;
      overlayContext.save();
      overlayContext.setLineDash([7, 5]);
      overlayContext.lineWidth = Math.max(2, width / 420);
      overlayContext.strokeStyle = "#6D5BE8";
      overlayContext.fillStyle = "rgba(109, 91, 232, 0.13)";
      overlayContext.fillRect(draft.x, draft.y, draft.width, draft.height);
      overlayContext.strokeRect(draft.x, draft.y, draft.width, draft.height);
      overlayContext.restore();
    }

    drawSampleMarker("a", "#6D5BE8", "A");
    drawSampleMarker("b", "#047A77", "B");
  }

  function drawSampleMarker(key, color, label) {
    var sample = state.samples[key];
    if (!sample) {
      return;
    }

    var x = sample.u * dom.overlayCanvas.width;
    var y = sample.v * dom.overlayCanvas.height;
    var radius = Math.max(7, dom.overlayCanvas.width / 90);
    overlayContext.save();
    overlayContext.fillStyle = color;
    overlayContext.strokeStyle = "#FFFFFF";
    overlayContext.lineWidth = Math.max(2, dom.overlayCanvas.width / 350);
    overlayContext.beginPath();
    overlayContext.arc(x, y, radius, 0, Math.PI * 2);
    overlayContext.fill();
    overlayContext.stroke();
    overlayContext.fillStyle = "#FFFFFF";
    overlayContext.font = "800 " + Math.max(9, dom.overlayCanvas.width / 92) + "px system-ui, sans-serif";
    overlayContext.textAlign = "center";
    overlayContext.textBaseline = "middle";
    overlayContext.fillText(label, x, y + 0.5);
    overlayContext.restore();
  }

  function sampleAt(event) {
    if (state.marking) {
      return;
    }

    var position = getPointerPosition(event, dom.viewCanvas);
    var x = clamp(rounded(position.x), 0, dom.viewCanvas.width - 1);
    var y = clamp(rounded(position.y), 0, dom.viewCanvas.height - 1);
    var pixel = viewContext.getImageData(x, y, 1, 1).data;
    state.samples[state.activeSample] = {
      u: x / Math.max(1, dom.viewCanvas.width - 1),
      v: y / Math.max(1, dom.viewCanvas.height - 1),
      rgb: { r: pixel[0], g: pixel[1], b: pixel[2] }
    };

    state.activeSample = state.activeSample === "a" ? "b" : "a";
    updateSampleControls();
    drawOverlay();
    updateReport();
    updateStageHint();
  }

  function beginArea(event) {
    if (!state.marking) {
      return;
    }
    event.preventDefault();
    var start = getPointerPosition(event, dom.overlayCanvas);
    state.pointerStart = start;
    state.draftArea = { x: start.x, y: start.y, width: 0, height: 0 };
    dom.overlayCanvas.setPointerCapture(event.pointerId);
    drawOverlay();
  }

  function updateArea(event) {
    if (!state.marking || !state.pointerStart) {
      return;
    }
    var point = getPointerPosition(event, dom.overlayCanvas);
    state.draftArea = normalizeArea(state.pointerStart, point);
    drawOverlay();
  }

  function finishArea(event) {
    if (!state.marking || !state.pointerStart) {
      return;
    }

    var point = getPointerPosition(event, dom.overlayCanvas);
    var area = normalizeArea(state.pointerStart, point);
    var minimum = Math.max(8, dom.overlayCanvas.width / 100);
    if (area.width >= minimum && area.height >= minimum) {
      state.keyAreas.push(toRelativeArea(area));
      state.marking = false;
      updateMarkingUi();
      setStageHint("已标注 1 个关键区域。你可以继续取 A / B 色，或切换不同视图检查。");
    } else {
      setStageHint("框选区域太小了。请把标题、按钮或价格完整框起来。");
    }

    state.pointerStart = null;
    state.draftArea = null;
    if (dom.overlayCanvas.hasPointerCapture(event.pointerId)) {
      dom.overlayCanvas.releasePointerCapture(event.pointerId);
    }
    drawOverlay();
    updateReport();
  }

  function updateMarkingUi() {
    dom.canvasStage.dataset.marking = String(state.marking);
    dom.markAreaButton.textContent = state.marking ? "完成框选" : "框选关键区域";
    dom.markingStatus.textContent = state.marking
      ? "框选模式已开启：在图片上拖拽，标出一块必须看清的内容。"
      : "准备就绪：点击“框选关键区域”后，在画面上拖拽。";
  }

  function updateSampleControls() {
    ["a", "b"].forEach(function (key) {
      var isActive = state.activeSample === key;
      var button = key === "a" ? dom.sampleAButton : dom.sampleBButton;
      var dot = key === "a" ? dom.sampleADot : dom.sampleBDot;
      button.classList.toggle("is-active", isActive);
      var sample = state.samples[key];
      dot.style.background = sample ? rgbCss(sample.rgb) : "#D8D8D8";
      button.title = sample ? rgbToHex(sample.rgb) : "";
    });
  }

  function calculatePalette() {
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
    var imageData = sourceContext.getImageData(0, 0, width, height).data;
    var stride = Math.max(3, rounded(Math.sqrt((width * height) / 35000)));
    var buckets = new Map();

    for (var y = 0; y < height; y += stride) {
      for (var x = 0; x < width; x += stride) {
        var index = (y * width + x) * 4;
        if (imageData[index + 3] < 100) {
          continue;
        }
        var r = imageData[index];
        var g = imageData[index + 1];
        var b = imageData[index + 2];
        var key = (r >> 5) + "-" + (g >> 5) + "-" + (b >> 5);
        var bucket = buckets.get(key);
        if (!bucket) {
          bucket = { count: 0, r: 0, g: 0, b: 0 };
          buckets.set(key, bucket);
        }
        bucket.count += 1;
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
      }
    }

    state.palette = Array.from(buckets.values())
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 8)
      .map(function (bucket) {
        return {
          r: rounded(bucket.r / bucket.count),
          g: rounded(bucket.g / bucket.count),
          b: rounded(bucket.b / bucket.count),
          count: bucket.count
        };
      });
  }

  function calculatePotentialRisks() {
    var riskModes = ["protanopia", "deuteranopia", "tritanopia"];
    var risks = [];

    for (var a = 0; a < state.palette.length; a += 1) {
      for (var b = a + 1; b < state.palette.length; b += 1) {
        var first = state.palette[a];
        var second = state.palette[b];
        var originalDistance = colorDistance(first, second);
        if (originalDistance < 58) {
          continue;
        }

        riskModes.forEach(function (mode) {
          var transformedDistance = colorDistance(simulateColor(first, mode), simulateColor(second, mode));
          var originalLumDelta = Math.abs(getLuminance(first) - getLuminance(second));
          if (transformedDistance < 30 && originalLumDelta < 0.22) {
            risks.push({
              first: first,
              second: second,
              mode: mode,
              distance: transformedDistance
            });
          }
        });
      }
    }

    state.potentialRisks = risks
      .sort(function (a, b) { return a.distance - b.distance; })
      .slice(0, 3);
  }

  function analyzeImage() {
    calculatePalette();
    calculatePotentialRisks();
  }

  function getContrastResult() {
    var first = state.samples.a;
    var second = state.samples.b;
    if (!first || !second) {
      return null;
    }
    var ratio = getContrast(first.rgb, second.rgb);
    return {
      ratio: ratio,
      status: ratio >= 4.5 ? "pass" : ratio >= 3 ? "warn" : "fail"
    };
  }

  function addFinding(type, text) {
    var item = document.createElement("li");
    item.className = "finding " + (type === "risk" ? "is-risk" : type === "good" ? "is-good" : "");
    var icon = document.createElement("span");
    icon.className = "finding-icon";
    icon.textContent = type === "risk" ? "!" : type === "good" ? "✓" : "·";
    var copy = document.createElement("span");
    copy.textContent = text;
    item.appendChild(icon);
    item.appendChild(copy);
    dom.findingsList.appendChild(item);
  }

  function updateFindings(contrastResult) {
    dom.findingsList.innerHTML = "";

    if (!state.keyAreas.length) {
      addFinding("note", "还没有标出关键区域。先圈标题、价格、CTA 或错误提示，检查才有重点。");
    } else {
      addFinding("good", "已记录 " + state.keyAreas.length + " 个关键区域。切换视图时请优先看它们。");
    }

    if (!contrastResult) {
      addFinding("note", "还没有测实际 A / B 色对。图片里的文字常常需要手动取样确认。");
    } else if (contrastResult.status === "pass") {
      addFinding("good", "当前 A / B 色对达到 4.5:1 参考线，可作为常规正文的良好起点。");
    } else if (contrastResult.status === "warn") {
      addFinding("risk", "当前 A / B 色对低于 4.5:1。若是常规正文，建议再提高明暗差。");
    } else {
      addFinding("risk", "当前 A / B 色对低于 3:1。小字、浅字或移动场景下尤其容易消失。");
    }

    if (state.potentialRisks.length) {
      var risk = state.potentialRisks[0];
      addFinding(
        "risk",
        "主色 " + rgbToHex(risk.first) + " 与 " + rgbToHex(risk.second) +
          " 在" + modeLabels[risk.mode] + "中可能接近；不要只用颜色区分状态。"
      );
    } else if (state.palette.length) {
      addFinding("good", "主要颜色在三种色觉模拟中没有出现明显的近似色对。仍建议人工查看关键区域。");
    }
  }

  function updatePalette() {
    dom.paletteGrid.innerHTML = "";
    state.palette.forEach(function (color) {
      var swatch = document.createElement("span");
      swatch.className = "palette-swatch";
      swatch.style.background = rgbCss(color);
      swatch.title = rgbToHex(color);
      dom.paletteGrid.appendChild(swatch);
    });
    dom.paletteCount.textContent = state.palette.length ? state.palette.length + " 色" : "—";
  }

  function updateReadiness(contrastResult) {
    var areas = state.keyAreas.length;
    if (!areas && !contrastResult) {
      dom.readinessEyebrow.textContent = "还没有足够信息";
      dom.readinessTitle.textContent = "先标出重要信息";
      dom.readinessCopy.textContent = "这不是打分器；关键内容和实际色对都值得人工确认。";
      return;
    }

    if (areas && !contrastResult) {
      dom.readinessEyebrow.textContent = "已建立审查重点";
      dom.readinessTitle.textContent = "重点已圈出，再取一组色";
      dom.readinessCopy.textContent = "切换小屏、灰阶和色觉模拟，看看这 " + areas + " 处信息是否还成立。";
      return;
    }

    if (contrastResult.status === "pass") {
      dom.readinessEyebrow.textContent = "完成一项精确核对";
      dom.readinessTitle.textContent = "继续做情境检查";
      dom.readinessCopy.textContent = "A / B 已达到正文参考线；接下来检查小屏和灰阶下的信息层级。";
      return;
    }

    dom.readinessEyebrow.textContent = "发现可调整点";
    dom.readinessTitle.textContent = "关键信息可能偏弱";
    dom.readinessCopy.textContent = "先加大文字与背景的明暗差，再重新取样核对。";
  }

  function updateReport() {
    var contrastResult = getContrastResult();
    dom.areaMetric.textContent = state.keyAreas.length;
    dom.sampleMetric.textContent = contrastResult ? "1" : "0";
    dom.riskMetric.textContent = state.palette.length ? String(state.potentialRisks.length) : "—";

    if (!contrastResult) {
      dom.contrastRatio.textContent = "等待取色";
      dom.contrastBadge.textContent = "未检查";
      dom.contrastBadge.className = "contrast-badge";
      dom.contrastDetail.textContent = "取样后会按照 WCAG 的文字对比度阈值给出提示。";
    } else {
      var ratioText = contrastResult.ratio.toFixed(2) + ":1";
      dom.contrastRatio.textContent = ratioText;
      dom.contrastBadge.className = "contrast-badge is-" + contrastResult.status;
      if (contrastResult.status === "pass") {
        dom.contrastBadge.textContent = "正文 AA 参考";
        dom.contrastDetail.textContent = rgbToHex(state.samples.a.rgb) + " / " + rgbToHex(state.samples.b.rgb) + "。常规文字可把 4.5:1 当作参考线。";
      } else if (contrastResult.status === "warn") {
        dom.contrastBadge.textContent = "仅大字参考";
        dom.contrastDetail.textContent = rgbToHex(state.samples.a.rgb) + " / " + rgbToHex(state.samples.b.rgb) + "。达到 3:1，但常规正文通常还不够。";
      } else {
        dom.contrastBadge.textContent = "建议调整";
        dom.contrastDetail.textContent = rgbToHex(state.samples.a.rgb) + " / " + rgbToHex(state.samples.b.rgb) + "。低于 3:1，建议先拉开明暗差。";
      }
    }

    updateReadiness(contrastResult);
    updateFindings(contrastResult);
    updatePalette();
  }

  function updateStageHint() {
    if (state.marking) {
      dom.stageHint.textContent = "框选模式：拖拽圈出标题、按钮、价格或任何必须看清的内容。";
      return;
    }
    if (state.mode === "small") {
      dom.stageHint.textContent = "小屏模拟：现在以 320px 宽度重绘。看重点信息会不会被压小。";
      return;
    }
    if (state.mode !== "original") {
      dom.stageHint.textContent = modeLabels[state.mode] + "仅用于风险预览。观察关键信息是否仍可区分。";
      return;
    }
    var next = state.activeSample === "a" ? "A 文字色" : "B 背景色";
    dom.stageHint.textContent = "正在查看原图。点击画面可取样 " + next + "。";
  }

  function setStageHint(text) {
    dom.stageHint.textContent = text;
  }

  function cleanFileName(name) {
    return (name || "sightline").replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "-").toLowerCase();
  }

  function triggerDownload(blob, name) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function exportCurrentImage() {
    var exportCanvas = document.createElement("canvas");
    exportCanvas.width = dom.viewCanvas.width;
    exportCanvas.height = dom.viewCanvas.height;
    var exportContext = exportCanvas.getContext("2d");
    exportContext.drawImage(dom.viewCanvas, 0, 0);
    exportContext.drawImage(dom.overlayCanvas, 0, 0);
    exportCanvas.toBlob(function (blob) {
      if (blob) {
        triggerDownload(blob, cleanFileName(state.title) + "-" + state.mode + "-sightline.png");
        setStageHint("已导出当前视图 PNG。");
      }
    }, "image/png");
  }

  function exportReport() {
    var contrastResult = getContrastResult();
    var report = {
      tool: "Sightline v0.1.0-alpha.1",
      generatedAt: new Date().toISOString(),
      localOnly: true,
      image: {
        name: state.title,
        originalPixels: {
          width: state.originalWidth,
          height: state.originalHeight
        },
        previewScene: targetLabels[state.target],
        activeView: modeLabels[state.mode]
      },
      keyAreas: state.keyAreas.map(function (area, index) {
        return {
          label: "关键 " + (index + 1),
          normalizedBounds: area
        };
      }),
      sampledContrast: contrastResult ? {
        first: rgbToHex(state.samples.a.rgb),
        second: rgbToHex(state.samples.b.rgb),
        ratio: Number(contrastResult.ratio.toFixed(2)),
        guidance: contrastResult.status === "pass" ? "Meets 4.5:1 reference for normal text" :
          contrastResult.status === "warn" ? "Meets 3:1 reference for large text or UI components" :
            "Below 3:1 reference; improve contrast"
      } : null,
      dominantColors: state.palette.map(function (color) {
        return rgbToHex(color);
      }),
      possibleColorConfusions: state.potentialRisks.map(function (risk) {
        return {
          first: rgbToHex(risk.first),
          second: rgbToHex(risk.second),
          simulation: modeLabels[risk.mode]
        };
      }),
      disclaimer: "A local design-review aid, not a formal accessibility conformance report or substitute for testing with real users."
    };
    var blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8" });
    triggerDownload(blob, cleanFileName(state.title) + "-sightline-report.json");
    setStageHint("已下载本地预检记录 JSON。");
  }

  function setMode(mode) {
    state.mode = mode;
    $$(".mode-tab").forEach(function (button) {
      button.classList.toggle("is-selected", button.dataset.mode === mode);
    });
    render();
  }

  function wireEvents() {
    dom.uploadButton.addEventListener("click", function () {
      dom.fileInput.click();
    });

    dom.dropZone.addEventListener("click", function () {
      dom.fileInput.click();
    });

    dom.fileInput.addEventListener("change", function (event) {
      if (event.target.files && event.target.files[0]) {
        importImage(event.target.files[0]);
      }
      event.target.value = "";
    });

    ["dragenter", "dragover"].forEach(function (eventName) {
      dom.dropZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dom.dropZone.classList.add("is-dragging");
      });
    });

    ["dragleave", "drop"].forEach(function (eventName) {
      dom.dropZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dom.dropZone.classList.remove("is-dragging");
      });
    });

    dom.dropZone.addEventListener("drop", function (event) {
      var file = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : null;
      if (file) {
        importImage(file);
      }
    });

    dom.demoButton.addEventListener("click", function () {
      loadDemo();
      setStageHint("已载入演示图。里面刻意放了几种常见的可读性风险。");
    });

    dom.targetPreset.addEventListener("change", function (event) {
      state.target = event.target.value;
      render();
    });

    $$(".mode-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        setMode(button.dataset.mode);
      });
    });

    dom.markAreaButton.addEventListener("click", function () {
      state.marking = !state.marking;
      updateMarkingUi();
      updateStageHint();
    });

    dom.clearAreasButton.addEventListener("click", function () {
      state.keyAreas = [];
      state.draftArea = null;
      drawOverlay();
      updateReport();
      setStageHint("已清空关键区域。");
    });

    dom.sampleAButton.addEventListener("click", function () {
      state.activeSample = "a";
      state.marking = false;
      updateMarkingUi();
      updateSampleControls();
      updateStageHint();
    });

    dom.sampleBButton.addEventListener("click", function () {
      state.activeSample = "b";
      state.marking = false;
      updateMarkingUi();
      updateSampleControls();
      updateStageHint();
    });

    dom.resetSamplesButton.addEventListener("click", function () {
      state.samples.a = null;
      state.samples.b = null;
      state.activeSample = "a";
      updateSampleControls();
      drawOverlay();
      updateReport();
      updateStageHint();
    });

    dom.viewCanvas.addEventListener("click", sampleAt);
    dom.overlayCanvas.addEventListener("pointerdown", beginArea);
    dom.overlayCanvas.addEventListener("pointermove", updateArea);
    dom.overlayCanvas.addEventListener("pointerup", finishArea);
    dom.overlayCanvas.addEventListener("pointercancel", function () {
      state.pointerStart = null;
      state.draftArea = null;
      drawOverlay();
    });

    dom.refreshAnalysisButton.addEventListener("click", function () {
      analyzeImage();
      updateReport();
      setStageHint("已重新分析画面主色与潜在混淆色。");
    });

    dom.exportImageButton.addEventListener("click", exportCurrentImage);
    dom.exportReportButton.addEventListener("click", exportReport);

    dom.aboutButton.addEventListener("click", function () {
      dom.aboutDialog.showModal();
    });

    dom.closeAboutButton.addEventListener("click", function () {
      dom.aboutDialog.close();
    });

    dom.aboutDialog.addEventListener("click", function (event) {
      var rect = dom.aboutDialog.getBoundingClientRect();
      var inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) {
        dom.aboutDialog.close();
      }
    });
  }

  wireEvents();
  loadDemo();
}());
