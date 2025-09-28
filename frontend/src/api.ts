const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}

export const getTransactions = async (month?: string, search?: string) => {
  const params = new URLSearchParams()
  if (month) params.append('month', month)
  if (search) params.append('search', search)
  
  const response = await fetch(`${API_BASE}/api/transactions?${params}`)
  return response.json()
}

export const updateTransaction = async (id: number, updates: any) => {
  const response = await fetch(`${API_BASE}/api/transactions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
  
  return response.json()
}

export const getSummary = async (month?: string) => {
  const params = new URLSearchParams()
  if (month) params.append('month', month)
  
  const response = await fetch(`${API_BASE}/api/summary?${params}`)
  return response.json()
}

export const deleteTransaction = async (id: number) => {
  const response = await fetch(`${API_BASE}/api/transactions/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete transaction: ${response.status}`)
  }
  
  return response.json()
}