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
    closeAboutButton: $("#closeAboutButton"),
    languageButton: $("#languageButton"),
    languageButtonText: $("#languageButtonText"),
    pageDescription: $("#pageDescription")
  };

  var VERSION = "v0.1.0-alpha.2";

  var translations = {
    zh: {
      meta: {
        title: "Sightline · 视觉成品预检",
        description: "Sightline：在发布前检查海报、社媒图和 UI 截图是否看得清。"
      },
      language: {
        chinese: "中文",
        english: "英文"
      },
      topbar: {
        localOnly: "图片不会离开你的设备",
        loadDemo: "载入示例",
        importImage: "导入成品图"
      },
      intro: {
        kicker: "发布前的最后一眼",
        headBefore: "别只看它“好不好看”，也看看它",
        headHighlight: "能不能被看清。",
        copy: "面向海报、社媒图和 UI 截图的本地视觉预检。这里给的是风险提示，不是无障碍合规认证。"
      },
      input: {
        heading: "成品与场景",
        dropTitle: "拖入 PNG / JPG / WebP / SVG",
        dropCopy: "或点这里导入已经导出的视觉成品",
        previewScene: "预览场景"
      },
      target: {
        phone: "手机信息流",
        desktop: "桌面网页",
        poster: "远看海报",
        phoneOption: "手机信息流 · 390px 宽",
        desktopOption: "桌面网页 · 1280px 宽",
        posterOption: "远看海报 · 缩略预览"
      },
      keyMessage: {
        heading: "标出必须看清的内容",
        copy: "例如标题、价格、报名方式、错误提示。拖拽框选后，它会被带进本地验收记录。",
        clear: "清空"
      },
      exact: {
        heading: "取两点，测一次真实对比",
        copy: "依次点击文字色与背景色。对带渐变、阴影或照片底图的文字尤其有用。",
        sampleA: "取文字色",
        sampleB: "取背景色",
        reset: "重置取色"
      },
      mode: {
        original: "原图",
        small: "小屏",
        gray: "灰阶",
        protanopia: "红弱模拟",
        deuteranopia: "绿弱模拟",
        tritanopia: "蓝弱模拟"
      },
      aria: {
        switchLanguage: "切换到{language}",
        modeTabs: "视觉模拟模式",
        canvas: "成品图预览",
        close: "关闭"
      },
      legend: {
        keyArea: "关键区域",
        sampleA: "文字色",
        sampleB: "背景色"
      },
      report: {
        heading: "预检记录",
        keyAreas: "关键区域",
        sampledPairs: "已测色对",
        potentialRisks: "潜在混淆色"
      },
      contrast: {
        heading: "当前 A / B 对比度",
        waiting: "等待取色",
        unchecked: "未检查",
        waitingDetail: "取样后会按照 WCAG 的文字对比度阈值给出提示。",
        passBadge: "正文 AA 参考",
        passDetail: "{first} / {second}。常规文字可把 4.5:1 当作参考线。",
        warnBadge: "仅大字参考",
        warnDetail: "{first} / {second}。达到 3:1，但常规正文通常还不够。",
        failBadge: "建议调整",
        failDetail: "{first} / {second}。低于 3:1，建议先拉开明暗差。"
      },
      findings: {
        heading: "可能需要看一眼",
        refresh: "刷新",
        noAreas: "还没有标出关键区域。先圈标题、价格、CTA 或错误提示，检查才有重点。",
        areasRecorded: "已记录 {count} 个关键区域。切换视图时请优先看它们。",
        noSamples: "还没有测实际 A / B 色对。图片里的文字常常需要手动取样确认。",
        contrastPass: "当前 A / B 色对达到 4.5:1 参考线，可作为常规正文的良好起点。",
        contrastWarn: "当前 A / B 色对低于 4.5:1。若是常规正文，建议再提高明暗差。",
        contrastFail: "当前 A / B 色对低于 3:1。小字、浅字或移动场景下尤其容易消失。",
        colorRisk: "主色 {first} 与 {second} 在{mode}中可能接近；不要只用颜色区分状态。",
        noColorRisk: "主要颜色在三种色觉模拟中没有出现明显的近似色对。仍建议人工查看关键区域。"
      },
      palette: {
        heading: "画面主色",
        count: "{count} 色"
      },
      readiness: {
        emptyEyebrow: "还没有足够信息",
        emptyTitle: "先标出重要信息",
        emptyCopy: "这不是打分器；关键内容和实际色对都值得人工确认。",
        areasEyebrow: "已建立审查重点",
        areasTitle: "重点已圈出，再取一组色",
        areasCopy: "切换小屏、灰阶和色觉模拟，看看这 {count} 处信息是否还成立。",
        passEyebrow: "完成一项精确核对",
        passTitle: "继续做情境检查",
        passCopy: "A / B 已达到正文参考线；接下来检查小屏和灰阶下的信息层级。",
        riskEyebrow: "发现可调整点",
        riskTitle: "关键信息可能偏弱",
        riskCopy: "先加大文字与背景的明暗差，再重新取样核对。"
      },
      stage: {
        invalidFile: "请选择 PNG、JPG、WebP、GIF 或 SVG 图片。",
        imported: "已导入。先框选标题、价格或按钮，再切换不同视图检查。",
        unreadable: "这张图片暂时无法读取，请换一张 PNG、JPG、WebP 或 SVG。",
        marked: "已标注 1 个关键区域。你可以继续取 A / B 色，或切换不同视图检查。",
        areaTooSmall: "框选区域太小了。请把标题、按钮或价格完整框起来。",
        marking: "框选模式：拖拽圈出标题、按钮、价格或任何必须看清的内容。",
        small: "小屏模拟：现在以 320px 宽度重绘。看重点信息会不会被压小。",
        simulation: "{mode}仅用于风险预览。观察关键信息是否仍可区分。",
        original: "正在查看原图。点击画面可取样 {sample}。",
        sampleA: "A 文字色",
        sampleB: "B 背景色",
        demoLoaded: "已载入演示图。里面刻意放了几种常见的可读性风险。",
        areasCleared: "已清空关键区域。",
        analysisRefreshed: "已重新分析画面主色与潜在混淆色。",
        imageExported: "已导出当前视图 PNG。",
        reportExported: "已下载本地预检记录 JSON。"
      },
      marking: {
        finish: "完成框选",
        start: "框选关键区域",
        active: "框选模式已开启：在图片上拖拽，标出一块必须看清的内容。",
        idle: "准备就绪：点击“框选关键区域”后，在画面上拖拽。"
      },
      image: {
        demoTitle: "示例 · 信息流推广图",
        untitled: "未命名成品图"
      },
      overlay: {
        keyArea: "关键 {count}"
      },
      export: {
        image: "导出当前视图 PNG",
        report: "下载本地预检记录"
      },
      footer: {
        copy: "Sightline v0.1.0-alpha.2 · 本地浏览器工具。模拟结果用于设计审查，不替代真实用户测试、屏幕阅读器测试或正式合规审计。",
        howTo: "怎么使用？"
      },
      about: {
        heading: "三分钟，给一张成品图多看几眼。",
        step1: "导入已经导出的海报、社媒图或 UI 截图。",
        step2: "切换小屏、灰阶与不同色觉模拟，观察关键信息是否还成立。",
        step3: "框选标题、价格、按钮等重点，再用 A / B 取色测实际对比度。",
        step4: "把本地预检记录附在设计验收或交付里。",
        note: "所有处理均在当前浏览器完成，不会上传图片。"
      }
    },
    en: {
      meta: {
        title: "Sightline · Local visual preflight",
        description: "Check whether the key information in a poster, social graphic, or UI screenshot is still legible before it ships."
      },
      language: {
        chinese: "Chinese",
        english: "English"
      },
      topbar: {
        localOnly: "Your image stays on this device",
        loadDemo: "Load demo",
        importImage: "Import image"
      },
      intro: {
        kicker: "One last look before publishing",
        headBefore: "A visual should not only look good. It should also ",
        headHighlight: "stay legible.",
        copy: "A local visual preflight for posters, social graphics, and UI screenshots. It highlights risks; it is not an accessibility conformance certification."
      },
      input: {
        heading: "Image & scenario",
        dropTitle: "Drop a PNG / JPG / WebP / SVG",
        dropCopy: "or select an exported visual to inspect",
        previewScene: "Preview scenario"
      },
      target: {
        phone: "Mobile feed",
        desktop: "Desktop web",
        poster: "Distant poster",
        phoneOption: "Mobile feed · 390px wide",
        desktopOption: "Desktop web · 1280px wide",
        posterOption: "Distant poster · thumbnail view"
      },
      keyMessage: {
        heading: "Mark what must stay legible",
        copy: "For example: a title, price, sign-up method, or error message. Drag a box to include it in the local review record.",
        clear: "Clear"
      },
      exact: {
        heading: "Sample two pixels, check the real contrast",
        copy: "Click the text color, then the background color. Especially useful for gradients, shadows, or text on photos.",
        sampleA: "text color",
        sampleB: "background color",
        reset: "Reset samples"
      },
      mode: {
        original: "Original",
        small: "Small screen",
        gray: "Grayscale",
        protanopia: "Red-weak simulation",
        deuteranopia: "Green-weak simulation",
        tritanopia: "Blue-weak simulation"
      },
      aria: {
        switchLanguage: "Switch to {language}",
        modeTabs: "Visual simulation modes",
        canvas: "Visual preview",
        close: "Close"
      },
      legend: {
        keyArea: "Key area",
        sampleA: "text color",
        sampleB: "background color"
      },
      report: {
        heading: "Preflight record",
        keyAreas: "Key areas",
        sampledPairs: "Sampled pairs",
        potentialRisks: "Possible color conflicts"
      },
      contrast: {
        heading: "Current A / B contrast",
        waiting: "Awaiting samples",
        unchecked: "Unchecked",
        waitingDetail: "After sampling, you will see guidance based on WCAG text-contrast reference thresholds.",
        passBadge: "Normal-text AA reference",
        passDetail: "{first} / {second}. 4.5:1 is a useful reference for normal text.",
        warnBadge: "Large-text reference only",
        warnDetail: "{first} / {second}. It reaches 3:1, but is usually not enough for normal text.",
        failBadge: "Adjust recommended",
        failDetail: "{first} / {second}. It is below 3:1; increase the lightness difference first."
      },
      findings: {
        heading: "Worth another look",
        refresh: "Refresh",
        noAreas: "No key areas are marked yet. Start with a title, price, CTA, or error message so the review has a focus.",
        areasRecorded: "{count} key areas recorded. Prioritize them as you switch views.",
        noSamples: "No A / B color pair has been sampled yet. Text in images often needs a manual check.",
        contrastPass: "The current A / B pair reaches the 4.5:1 reference point — a good start for normal text.",
        contrastWarn: "The current A / B pair is below 4.5:1. For normal text, increase the lightness difference.",
        contrastFail: "The current A / B pair is below 3:1. Small, light, or mobile text can disappear especially easily.",
        colorRisk: "Dominant colors {first} and {second} may converge in {mode}; do not rely on color alone to communicate a state.",
        noColorRisk: "No obvious near-color pairs appeared in the three color-vision simulations. Still inspect key areas manually."
      },
      palette: {
        heading: "Dominant colors",
        count: "{count} colors"
      },
      readiness: {
        emptyEyebrow: "Not enough review input yet",
        emptyTitle: "Mark the important information first",
        emptyCopy: "This is not a score. Key content and real sampled color pairs still need a human check.",
        areasEyebrow: "Review focus established",
        areasTitle: "Key content is marked — sample a color pair next",
        areasCopy: "Switch between small screen, grayscale, and color-vision views. Does each of these {count} areas still work?",
        passEyebrow: "One precise check complete",
        passTitle: "Keep testing the situation",
        passCopy: "A / B meets the normal-text reference. Next, check hierarchy on small screens and in grayscale.",
        riskEyebrow: "An adjustment may help",
        riskTitle: "Key information may be too weak",
        riskCopy: "Increase the lightness difference between text and background, then sample again."
      },
      stage: {
        invalidFile: "Choose a PNG, JPG, WebP, GIF, or SVG image.",
        imported: "Image imported. Mark a title, price, or button first, then inspect the different views.",
        unreadable: "This image cannot be read right now. Try a PNG, JPG, WebP, or SVG instead.",
        marked: "1 key area marked. You can keep sampling A / B colors or switch views to inspect it.",
        areaTooSmall: "That marked area is too small. Box the complete title, button, or price.",
        marking: "Marking mode: drag over a title, button, price, or anything that must stay legible.",
        small: "Small-screen simulation: redrawn at 320px wide. Check whether key information becomes too small.",
        simulation: "{mode} is a risk preview only. Inspect whether key information is still distinguishable.",
        original: "Viewing the original. Click the image to sample {sample}.",
        sampleA: "A text color",
        sampleB: "B background color",
        demoLoaded: "Demo loaded. It intentionally includes several common readability risks.",
        areasCleared: "Key areas cleared.",
        analysisRefreshed: "Dominant colors and possible color conflicts re-analysed.",
        imageExported: "Current view exported as PNG.",
        reportExported: "Local preflight record downloaded as JSON."
      },
      marking: {
        finish: "Finish marking",
        start: "Mark key area",
        active: "Marking mode is on: drag across a piece of content that must stay legible.",
        idle: "Ready: click “Mark key area”, then drag on the image."
      },
      image: {
        demoTitle: "Demo · Feed promotion graphic",
        untitled: "Untitled visual"
      },
      overlay: {
        keyArea: "Key {count}"
      },
      export: {
        image: "Export current view PNG",
        report: "Download local record"
      },
      footer: {
        copy: "Sightline v0.1.0-alpha.2 · A local browser tool. Simulations support design review; they do not replace real-user testing, screen-reader testing, or a formal conformance audit.",
        howTo: "How does it work?"
      },
      about: {
        heading: "Give an exported visual three more minutes of attention.",
        step1: "Import an already exported poster, social graphic, or UI screenshot.",
        step2: "Switch between small-screen, grayscale, and color-vision views to see whether key information still holds up.",
        step3: "Mark the title, price, button, or other focus areas, then sample A / B pixels to check actual contrast.",
        step4: "Attach the local preflight record to design review or delivery work.",
        note: "Everything is processed in this browser. Your image is never uploaded."
      }
    }
  };

  var sourceCanvas = document.createElement("canvas");
  var sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  var viewContext = dom.viewCanvas.getContext("2d", { willReadFrequently: true });
  var overlayContext = dom.overlayCanvas.getContext("2d");

  var state = {
    language: resolveLanguage(),
    mode: "original",
    target: "phone",
    title: "示例 · 信息流推广图",
    isDemo: true,
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

  function getTranslationValue(collection, key) {
    return key.split(".").reduce(function (value, part) {
      return value && typeof value === "object" ? value[part] : undefined;
    }, collection);
  }

  function t(key, values) {
    var message = getTranslationValue(translations[state.language], key) ||
      getTranslationValue(translations.zh, key) || key;
    return String(message).replace(/\{(\w+)\}/g, function (token, name) {
      return values && values[name] !== undefined ? values[name] : token;
    });
  }

  function resolveLanguage() {
    var requested = "";
    try {
      requested = new URLSearchParams(window.location.search).get("lang") || "";
    } catch (error) {
      requested = "";
    }

    if (requested === "en" || requested === "zh") {
      return requested;
    }

    try {
      var saved = window.localStorage.getItem("sightline-language");
      if (saved === "en" || saved === "zh") {
        return saved;
      }
    } catch (error) {
      // Local storage can be unavailable in privacy-restricted browser modes.
    }

    return typeof navigator !== "undefined" && /^zh\b/i.test(navigator.language || "") ? "zh" : "en";
  }

  function applyStaticTranslations() {
    if (document.documentElement) {
      document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
    }
    document.title = t("meta.title");
    if (dom.pageDescription) {
      dom.pageDescription.content = t("meta.description");
    }

    $$('[data-i18n]').forEach(function (element) {
      element.textContent = t(element.dataset.i18n);
    });
    $$('[data-i18n-aria-label]').forEach(function (element) {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });

    if (dom.languageButton && dom.languageButtonText) {
      var nextLanguage = state.language === "en" ? "zh" : "en";
      var nextLanguageName = state.language === "en" ? t("language.chinese") : t("language.english");
      dom.languageButtonText.textContent = nextLanguage === "en" ? "EN" : "中文";
      dom.languageButton.setAttribute("aria-label", t("aria.switchLanguage", { language: nextLanguageName }));
      dom.languageButton.title = t("aria.switchLanguage", { language: nextLanguageName });
    }
  }

  function writeLanguageToUrl() {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", state.language);
      window.history.replaceState({}, "", url.toString());
    } catch (error) {
      // A shareable language URL is a convenience; the app still works without it.
    }
  }

  function setLanguage(language) {
    if (language !== "zh" && language !== "en") {
      return;
    }

    state.language = language;
    try {
      window.localStorage.setItem("sightline-language", language);
    } catch (error) {
      // The selected language still applies for the current session.
    }
    writeLanguageToUrl();
    applyStaticTranslations();
    updateMarkingUi();
    updateSampleControls();
    if (state.isDemo) {
      loadDemo();
    } else {
      render();
    }
  }

  function modeLabel(mode) {
    return t("mode." + mode);
  }

  function targetLabel(target) {
    return t("target." + target);
  }

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
    var isEnglish = state.language === "en";
    state.isDemo = true;
    state.title = t("image.demoTitle");
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
    context.font = "700 " + (isEnglish ? "56" : "67") + "px system-ui, sans-serif";
    context.fillText(isEnglish ? "Make an hour" : "忙到满格前，", 119, 249);
    context.fillText(isEnglish ? "just for you." : "把一小时留给自己。", 119, 329);

    context.fillStyle = "#8D9AA2";
    context.font = "400 " + (isEnglish ? "20" : "24") + "px system-ui, sans-serif";
    context.fillText(
      isEnglish ? "A slow weekend session: breathe, stretch, and have tea." : "一个不赶时间的周末练习：呼吸、拉伸、喝一杯热茶。",
      121,
      384
    );

    drawRoundRect(context, 120, 440, 278, 72, 18);
    context.fillStyle = "#1F866D";
    context.fill();
    context.fillStyle = "#BEE59A";
    context.font = "700 " + (isEnglish ? "21" : "24") + "px system-ui, sans-serif";
    context.fillText(isEnglish ? "Tonight · 8 PM" : "今晚 20:00 直播", 156, 486);

    context.fillStyle = "#7775D9";
    context.font = "500 " + (isEnglish ? "17" : "19") + "px system-ui, sans-serif";
    context.fillText(isEnglish ? "Headphones on. Make room for yourself." : "带上耳机，给自己留一点空间", 122, 555);

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
    context.font = "700 " + (isEnglish ? "22" : "25") + "px system-ui, sans-serif";
    context.fillText(isEnglish ? "Today" : "你的今天，", 783, 420);
    context.fillText(isEnglish ? "can be gentle too." : "也值得被温柔对待", 773, 454);

    drawRoundRect(context, 782, 496, 180, 48, 15);
    context.fillStyle = "#EEAB62";
    context.fill();
    context.fillStyle = "#624726";
    context.font = "700 " + (isEnglish ? "15" : "16") + "px system-ui, sans-serif";
    context.fillText(isEnglish ? "See the plan" : "查看本周计划", 812, 526);

    context.fillStyle = "#98A3AB";
    context.font = "500 16px system-ui, sans-serif";
    context.fillText(isEnglish ? "Replace “later” with one breath." : "把“待会儿再说”换成一个呼吸。", 121, 647);

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
      setStageHint(t("stage.invalidFile"));
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.onload = function () {
        state.isDemo = false;
        state.title = file.name.replace(/\.[^/.]+$/, "") || t("image.untitled");
        state.originalWidth = image.naturalWidth;
        state.originalHeight = image.naturalHeight;
        setSourceDimensions(image.naturalWidth, image.naturalHeight);
        sourceContext.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
        sourceContext.drawImage(image, 0, 0, sourceCanvas.width, sourceCanvas.height);
        resetInteractionState();
        analyzeImage();
        render();
        setStageHint(t("stage.imported"));
      };
      image.onerror = function () {
        setStageHint(t("stage.unreadable"));
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
      var label = t("overlay.keyArea", { count: index + 1 });
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
      setStageHint(t("stage.marked"));
    } else {
      setStageHint(t("stage.areaTooSmall"));
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
    dom.markAreaButton.textContent = state.marking ? t("marking.finish") : t("marking.start");
    dom.markingStatus.textContent = state.marking
      ? t("marking.active")
      : t("marking.idle");
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
      addFinding("note", t("findings.noAreas"));
    } else {
      addFinding("good", t("findings.areasRecorded", { count: state.keyAreas.length }));
    }

    if (!contrastResult) {
      addFinding("note", t("findings.noSamples"));
    } else if (contrastResult.status === "pass") {
      addFinding("good", t("findings.contrastPass"));
    } else if (contrastResult.status === "warn") {
      addFinding("risk", t("findings.contrastWarn"));
    } else {
      addFinding("risk", t("findings.contrastFail"));
    }

    if (state.potentialRisks.length) {
      var risk = state.potentialRisks[0];
      addFinding(
        "risk",
        t("findings.colorRisk", {
          first: rgbToHex(risk.first),
          second: rgbToHex(risk.second),
          mode: modeLabel(risk.mode)
        })
      );
    } else if (state.palette.length) {
      addFinding("good", t("findings.noColorRisk"));
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
    dom.paletteCount.textContent = state.palette.length ? t("palette.count", { count: state.palette.length }) : "—";
  }

  function updateReadiness(contrastResult) {
    var areas = state.keyAreas.length;
    if (!areas && !contrastResult) {
      dom.readinessEyebrow.textContent = t("readiness.emptyEyebrow");
      dom.readinessTitle.textContent = t("readiness.emptyTitle");
      dom.readinessCopy.textContent = t("readiness.emptyCopy");
      return;
    }

    if (areas && !contrastResult) {
      dom.readinessEyebrow.textContent = t("readiness.areasEyebrow");
      dom.readinessTitle.textContent = t("readiness.areasTitle");
      dom.readinessCopy.textContent = t("readiness.areasCopy", { count: areas });
      return;
    }

    if (contrastResult.status === "pass") {
      dom.readinessEyebrow.textContent = t("readiness.passEyebrow");
      dom.readinessTitle.textContent = t("readiness.passTitle");
      dom.readinessCopy.textContent = t("readiness.passCopy");
      return;
    }

    dom.readinessEyebrow.textContent = t("readiness.riskEyebrow");
    dom.readinessTitle.textContent = t("readiness.riskTitle");
    dom.readinessCopy.textContent = t("readiness.riskCopy");
  }

  function updateReport() {
    var contrastResult = getContrastResult();
    dom.areaMetric.textContent = state.keyAreas.length;
    dom.sampleMetric.textContent = contrastResult ? "1" : "0";
    dom.riskMetric.textContent = state.palette.length ? String(state.potentialRisks.length) : "—";

    if (!contrastResult) {
      dom.contrastRatio.textContent = t("contrast.waiting");
      dom.contrastBadge.textContent = t("contrast.unchecked");
      dom.contrastBadge.className = "contrast-badge";
      dom.contrastDetail.textContent = t("contrast.waitingDetail");
    } else {
      var ratioText = contrastResult.ratio.toFixed(2) + ":1";
      dom.contrastRatio.textContent = ratioText;
      dom.contrastBadge.className = "contrast-badge is-" + contrastResult.status;
      if (contrastResult.status === "pass") {
        dom.contrastBadge.textContent = t("contrast.passBadge");
        dom.contrastDetail.textContent = t("contrast.passDetail", {
          first: rgbToHex(state.samples.a.rgb),
          second: rgbToHex(state.samples.b.rgb)
        });
      } else if (contrastResult.status === "warn") {
        dom.contrastBadge.textContent = t("contrast.warnBadge");
        dom.contrastDetail.textContent = t("contrast.warnDetail", {
          first: rgbToHex(state.samples.a.rgb),
          second: rgbToHex(state.samples.b.rgb)
        });
      } else {
        dom.contrastBadge.textContent = t("contrast.failBadge");
        dom.contrastDetail.textContent = t("contrast.failDetail", {
          first: rgbToHex(state.samples.a.rgb),
          second: rgbToHex(state.samples.b.rgb)
        });
      }
    }

    updateReadiness(contrastResult);
    updateFindings(contrastResult);
    updatePalette();
  }

  function updateStageHint() {
    if (state.marking) {
      dom.stageHint.textContent = t("stage.marking");
      return;
    }
    if (state.mode === "small") {
      dom.stageHint.textContent = t("stage.small");
      return;
    }
    if (state.mode !== "original") {
      dom.stageHint.textContent = t("stage.simulation", { mode: modeLabel(state.mode) });
      return;
    }
    var next = state.activeSample === "a" ? t("stage.sampleA") : t("stage.sampleB");
    dom.stageHint.textContent = t("stage.original", { sample: next });
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
        setStageHint(t("stage.imageExported"));
      }
    }, "image/png");
  }

  function exportReport() {
    var contrastResult = getContrastResult();
    var report = {
      tool: "Sightline " + VERSION,
      generatedAt: new Date().toISOString(),
      localOnly: true,
      image: {
        name: state.title,
        originalPixels: {
          width: state.originalWidth,
          height: state.originalHeight
        },
        previewScene: targetLabel(state.target),
        activeView: modeLabel(state.mode)
      },
      keyAreas: state.keyAreas.map(function (area, index) {
        return {
          label: t("overlay.keyArea", { count: index + 1 }),
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
          simulation: modeLabel(risk.mode)
        };
      }),
      disclaimer: "A local design-review aid, not a formal accessibility conformance report or substitute for testing with real users."
    };
    var blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8" });
    triggerDownload(blob, cleanFileName(state.title) + "-sightline-report.json");
    setStageHint(t("stage.reportExported"));
  }

  function setMode(mode) {
    state.mode = mode;
    $$(".mode-tab").forEach(function (button) {
      var isSelected = button.dataset.mode === mode;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    });
    render();
  }

  function wireEvents() {
    if (dom.languageButton) {
      dom.languageButton.addEventListener("click", function () {
        setLanguage(state.language === "en" ? "zh" : "en");
      });
    }

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
      setStageHint(t("stage.demoLoaded"));
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
      setStageHint(t("stage.areasCleared"));
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
      setStageHint(t("stage.analysisRefreshed"));
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

  applyStaticTranslations();
  wireEvents();
  loadDemo();
}());
