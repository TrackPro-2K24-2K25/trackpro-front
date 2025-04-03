export interface FileModel {
    id?: string; // UUID
    name: string;
    contentType: string; // e.g. "image/png", "application/pdf"
    url: string;
  }
  