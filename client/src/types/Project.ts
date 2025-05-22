export type UploadRequest = {
  name: string;
  description: string;
  file: File;
};

export type RawUploadRequest = {
  name: string;
  description: string;
  file: FileList;
};
