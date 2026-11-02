async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }

  return data
}

export function getCurrentUser() {
  return request('/api/auth/me')
}

export function getUrlHistory() {
  return request('/api/user/history')
}

export function createShortLink(url, slug) {
  return request('/api/create', {
    method: 'POST',
    body: JSON.stringify({ url, ...(slug ? { slug } : {}) }),
  })
}

export function authenticate(mode, form) {
  return request(`/api/auth/${mode}`, {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function signOut() {
  return request('/api/auth/logout', { method: 'POST' })
}
