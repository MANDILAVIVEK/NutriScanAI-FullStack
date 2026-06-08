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

  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log(
    "Calling:",
    `${import.meta.env.VITE_API_URL}/scan-barcode-image`
  );

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/scan-barcode-image`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  console.log("Barcode image response:", data);

  if (!response.ok) {
    throw new Error(data?.detail || "Barcode scan failed");
  }

  return data;
};