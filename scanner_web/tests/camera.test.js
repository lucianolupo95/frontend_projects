import { describe, it, expect, vi, beforeEach } from "vitest";
import { isCameraActive, initCamera, stopCamera } from "../js/camera.js";

global.navigator.mediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: vi.fn() }],
  }),
};

beforeEach(() => {
  document.body.innerHTML = '<video id="camera"></video>';
});

describe("Camera module", () => {
  it("should start the camera", async () => {
    await initCamera("user");
    const video = document.getElementById("camera");
    expect(video.srcObject).toBeDefined();
    expect(isCameraActive()).toBe(true);
  });

  it("should stop the camera", async () => {
    await initCamera();
    stopCamera();
    const video = document.getElementById("camera");
    expect(video.srcObject).toBeNull();
    expect(isCameraActive()).toBe(false);
  });
});
