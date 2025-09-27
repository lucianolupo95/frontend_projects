let currentLang = "es";

const translations = {
  es: {
    title: "Escáner Web",
    drop: "Suelta tus imágenes aquí",
    fileLabel: "Elegir archivo",
    enableCamera: "Usar cámara",
    disableCamera: "Dejar de usar cámara",
    export: "Descargar PDF",
    capture: "Capturar",
    switch: "Cambiar cámara",
    language: "Idioma",
    compress: "Comprimir imágenes",
    footer:
      'Un proyecto de <a href="https://lucianolupo95.github.io" target="_blank">Luciano Lupo</a>',
  },
  en: {
    title: "Web Scanner",
    drop: "Drop your images here",
    fileLabel: "Choose file",
    enableCamera: "Use camera",
    disableCamera: "Stop using camera",
    export: "Download PDF",
    capture: "Capture",
    switch: "Switch camera",
    language: "Language",
    compress: "Compress images",
    footer:
      'A project by <a href="https://lucianolupo95.github.io" target="_blank">Luciano Lupo</a>',
  },
  val: {
    title: "Escàner Web",
    drop: "Deixa caure les imatges ací",
    fileLabel: "Triar fitxer",
    enableCamera: "Usar càmera",
    disableCamera: "Parar càmera",
    export: "Descarregar PDF",
    capture: "Capturar",
    switch: "Canviar càmera",
    language: "Idioma",
    compress: "Comprimir imatges",
    footer:
      'Un projecte de <a href="https://lucianolupo95.github.io" target="_blank">Luciano Lupo</a>',
  },
  ja: {
    title: "ウェブスキャナー",
    drop: "ここに画像をドロップしてください",
    fileLabel: "ファイルを選択",
    enableCamera: "カメラを使う",
    disableCamera: "カメラを停止",
    export: "PDFをダウンロード",
    capture: "撮影",
    switch: "カメラを切り替え",
    language: "言語",
    compress: "画像を圧縮する",
    footer:
      '<a href="https://lucianolupo95.github.io" target="_blank">Luciano Lupo</a>のプロジェクト',
  },
};

export function setLanguage(lang) {
  currentLang = lang in translations ? lang : "es";
}

export function t(key) {
  return translations[currentLang]?.[key] || key;
}

export async function applyTranslation(lang) {
  setLanguage(lang);

  const update = (id, value, prop = "textContent") => {
    const el = document.getElementById(id);
    if (el) el[prop] = value;
  };

  update("title", t("title"));
  update("drop-area", t("drop"));
  update("file-label", t("fileLabel"));
  update("upload", t("fileLabel"), "title");

  try {
    const isCameraActive = await import("./camera.js").then(
      (m) => m.isCameraActive
    );
    update(
      "toggle-camera",
      isCameraActive() ? t("disableCamera") : t("enableCamera")
    );
  } catch {
    update("toggle-camera", t("enableCamera"));
  }

  update("export-pdf", "📥 " + t("export"));
  update("snap", t("capture"));
  update("switch-camera", t("switch"));
  update("label-language", t("language"));
  update("label-compress", t("compress"));
  update("footer", t("footer"), "innerHTML");
}
