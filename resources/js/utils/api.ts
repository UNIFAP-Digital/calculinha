export const httpGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const httpPost = async <T, R = undefined>(url: string, data: R): Promise<T> => {
  // Obter o token CSRF da meta tag para Laravel
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data ?? ''),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      }),
    )
  }

  if (response.status === 204) return {} as T

  return response.json()
}
