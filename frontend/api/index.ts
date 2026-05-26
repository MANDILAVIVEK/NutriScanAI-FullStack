const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface NutritionAnalysis {
  score: number
  status: 'Healthy' | 'Moderate' | 'Unhealthy'
  color: 'green' | 'orange' | 'red'
  advice: string[]
}

export interface Product {
  name: string
  brand: string
  ingredients: string
  nutriments: Record<string, number>
  image_url?: string
}

export interface ProductResponse {
  status: 'success' | 'partial' | 'error'
  product?: Product
  analysis?: NutritionAnalysis
  ingredient_analysis?: string[]
  allergy_detection?: string[]
  product_category?: string[]
  diet_suitability?: string[]
  message?: string
}

export interface OcrNutrition {
  protein: string
  carbs: string
  sugar: string
  fat: string
  saturated_fat: string
  sodium: string
}

export interface OcrResponse {
  status: string
  ocr_text: string
  nutrition: OcrNutrition
}

export async function fetchProduct(barcode: string): Promise<ProductResponse> {
  const res = await fetch(`${BASE_URL}/product/${barcode}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function scanBarcodeImage(file: File): Promise<{ status: string; barcode?: string; message?: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/scan-barcode-image`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Failed to scan barcode')
  return res.json()
}

export async function ocrNutrition(file: File): Promise<OcrResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/ocr`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Failed to run OCR')
  return res.json()
}

export async function analyzeCorrected(data: {
  sugar: number; protein: number; carbs: number; salt: number; fat: number
}): Promise<{ status: string; analysis: NutritionAnalysis }> {
  const res = await fetch(`${BASE_URL}/analyze-corrected`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to analyze')
  return res.json()
}
