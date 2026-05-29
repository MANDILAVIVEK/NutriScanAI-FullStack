const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const uploadImageForOCR = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/ocr`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("OCR request failed");
  return await response.json();
};

export const getProductByBarcode = async (barcode: string) => {
  const response = await fetch(`${API_URL}/product/${barcode}`);

  if (!response.ok) throw new Error("Product request failed");
  return await response.json();
};

export const scanBarcodeImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/scan-barcode-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Barcode scan failed");
  return await response.json();
};