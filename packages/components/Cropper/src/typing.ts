import type Cropper from "cropperjs";

export interface CropperCropendResult {
  imgBase64: string;
  imgInfo: Cropper.Data;
}

export type { Cropper };
