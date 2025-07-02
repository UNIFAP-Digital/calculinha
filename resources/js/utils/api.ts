
export const httpGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Realiza um pedido POST para a URL especificada com proteção CSRF.
 * Esta versão é robusta contra trocas de sessão.
 */
export const httpPost = async <T, R = undefined>(
  url: string,
  data: R,
): Promise<T> => {
  const csrfToken =
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content') || ''

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-CSRF-TOKEN': csrfToken, 
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data ?? {}),
  })

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Could not parse error JSON.' }))
    throw new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      }),
    )
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}
