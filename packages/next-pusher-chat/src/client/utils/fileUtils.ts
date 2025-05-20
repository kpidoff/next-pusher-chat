export const isImage = (fileName: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};

export const isAudio = (fileName: string): boolean => {
  const audioExtensions = [".mp3", ".wav", ".ogg", ".webm"];
  return audioExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};

export const isPdf = (fileName: string): boolean => {
  return fileName.toLowerCase().endsWith(".pdf");
};

export const isDocument = (fileName: string): boolean => {
  const documentExtensions = [".doc", ".docx", ".txt", ".rtf"];
  return documentExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
}; 