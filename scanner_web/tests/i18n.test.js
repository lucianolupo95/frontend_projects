import { describe, it, expect, beforeEach, vi } from "vitest";
import { setLanguage, t, applyTranslation } from "../js/i18n.js";

vi.mock("../js/camera.js", () => ({
  isCameraActive: () => false,
}));

beforeEach(() => {
  document.body.innerHTML = `
    <h1 id="title"></h1>
    <div id="drop-area"></div>
    <label id="file-label"></label>
    <input id="upload">
    <button id="toggle-camera"></button>
    <button id="export-pdf"></button>
    <button id="snap"></button>
    <button id="switch-camera"></button>
    <label id="label-language"></label>
    <label id="label-compress"></label>
    <footer id="footer"></footer>
    <div id="gallery"></div>
  `;
});

describe("i18n module", () => {
  it("returns translated string for current language", () => {
    setLanguage("en");
    expect(t("export")).toBe("Download PDF");
    setLanguage("es");
    expect(t("export")).toBe("Descargar PDF");
  });

  it("applies translation to DOM elements", async () => {
    setLanguage("es");
    await applyTranslation("es");

    expect(document.getElementById("export-pdf").textContent).toContain(
      "Descargar PDF"
    );
    expect(document.getElementById("label-language").textContent).toBe(
      "Idioma"
    );
    expect(document.getElementById("footer").innerHTML).toContain(
      "Luciano Lupo"
    );
  });
});
