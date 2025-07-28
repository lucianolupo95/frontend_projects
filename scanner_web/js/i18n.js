let currentLang = "es";

const translations = {
  es: {
    title: "📄 Escáner Web",
    drop: "Arrastra aquí tus imágenes",
    enableCamera: "📷 Usar cámara",
    disableCamera: "📷 Dejar de usar cámara",
    switchCamera: "🔄 Cambiar cámara",
    snap: "📸 Capturar",
    compress: "Comprimir imágenes",
    export: "📥 Descargar PDF",
    fileLabel: "Elegir archivo",
    theme: "Tema",
    language: "Idioma",
    rotate: "🔄",
    delete: "🗑️",
    footer:
      "Un proyecto de <a href='https://lucianolupo95.github.io' target='_blank'>Luciano Lupo</a>",
  },
  en: {
    title: "📄 Web Scanner",
    drop: "Drop your images here",
    enableCamera: "📷 Use Camera",
    disableCamera: "📷 Stop Camera",
    switchCamera: "🔄 Switch Camera",
    snap: "📸 Snap",
    compress: "Compress images",
    export: "📥 Download PDF",
    fileLabel: "Choose file",
    theme: "Theme",
    language: "Language",
    rotate: "🔄",
    delete: "🗑️",
    footer:
      "A project by <a href='https://lucianolupo95.github.io' target='_blank'>Luciano Lupo</a>",
  },
  val: {
    title: "📄 Escàner Web",
    drop: "Arrossega ací les imatges",
    enableCamera: "📷 Usar càmera",
    disableCamera: "📷 Aturar càmera",
    switchCamera: "🔄 Canviar càmera",
    snap: "📸 Capturar",
    compress: "Compressió d’imatges",
    export: "📥 Descarregar PDF",
    fileLabel: "Triar fitxer",
    theme: "Tema",
    language: "Idioma",
    rotate: "🔄",
    delete: "🗑️",
    footer:
      "Un projecte de <a href='https://lucianolupo95.github.io' target='_blank'>Luciano Lupo</a>",
  },
  ja: {
    title: "📄 ウェブスキャナー",
    drop: "ここに画像をドロップしてください",
    enableCamera: "📷 カメラを使う",
    disableCamera: "📷 カメラを止める",
    switchCamera: "🔄 カメラ切替",
    snap: "📸 撮影",
    compress: "画像を圧縮する",
    export: "📥 PDFをダウンロード",
    fileLabel: "ファイルを選択",
    theme: "テーマ",
    language: "言語",
    rotate: "🔄",
    delete: "🗑️",
    footer:
      "<a href='https://lucianolupo95.github.io' target='_blank'>Luciano Lupo</a> のプロジェクトです",
  },
};

export function t(key) {
  return translations[currentLang][key] || key;
}

export function setLanguage(lang) {
  currentLang = lang;
}

export function applyTranslation(lang) {
  setLanguage(lang);
  document.getElementById("title").textContent = t("title");
  document.getElementById("drop-area").textContent = t("drop");
  document.getElementById("file-label").textContent = t("fileLabel");
  document.getElementById("compress-text").textContent = t("compress");
  document.getElementById("label-language").textContent = t("language");
  document.getElementById("label-theme").textContent = t("theme");
  document.getElementById("footer").innerHTML = t("footer");
}
