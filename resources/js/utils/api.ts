export const httpGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Realiza um pedido POST para a URL especificada com proteção CSRF.
 */
export const httpPost = async <T, R = undefined>(url: string, data: R): Promise<T> => {
  // CORREÇÃO: O token é lido de dentro da função para garantir que ele exista no momento da chamada.
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-CSRF-TOKEN': csrfToken, // O token é adicionado aqui.
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data ?? ''),
  });

  if (!response.ok) {
    // Tenta analisar o erro como JSON para fornecer mais detalhes.
    const errorData = await response.json().catch(() => ({ message: 'Could not parse error JSON.' }));
    throw new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      }),
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};
