import axios from 'axios'

export const HTTP_TIMEOUT_MS = 10_000

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: HTTP_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  paramsSerializer: {
    serialize: (params: Record<string, unknown>) => {
      const sp = new URLSearchParams()
      for (const [k, v] of Object.entries(params)) {
        if (Array.isArray(v)) v.forEach((x) => sp.append(k, String(x)))
        else if (v !== undefined && v !== null) sp.append(k, String(v))
      }
      return sp.toString()
    },
  },
})
