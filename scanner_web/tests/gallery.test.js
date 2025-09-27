import { describe, it, expect, beforeEach } from "vitest";
import {
  addImage,
  getPhotos,
  rotateImage,
  deleteImage,
} from "../js/gallery.js";

describe("Gallery", () => {
  beforeEach(() => {
    // Reset the internal photos array
    while (getPhotos().length > 0) {
      deleteImage(0);
    }
  });

  it("should add an image", () => {
    addImage({ dataURL: "test1", rotation: 0 });
    expect(getPhotos()).toHaveLength(1);
    expect(getPhotos()[0].dataURL).toBe("test1");
  });

  it("should rotate an image", () => {
    addImage({ dataURL: "test2", rotation: 0 });
    rotateImage(0);
    expect(getPhotos()[0].rotation).toBe(90);
    rotateImage(0);
    expect(getPhotos()[0].rotation).toBe(180);
  });

  it("should delete an image", () => {
    addImage({ dataURL: "test3", rotation: 0 });
    expect(getPhotos()).toHaveLength(1);
    deleteImage(0);
    expect(getPhotos()).toHaveLength(0);
  });
});
