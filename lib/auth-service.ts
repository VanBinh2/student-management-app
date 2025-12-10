import { firebaseConfig, AUTH_URL } from "./firebase-config"

export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
  idToken: string
  refreshToken: string
}

interface AuthResponse {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  displayName?: string
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
  const response = await fetch(`${AUTH_URL}:signUp?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(data.error?.message))
  }

  // Update display name
  await updateProfile(data.idToken, displayName)

  return {
    uid: data.localId,
    email: data.email,
    displayName,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${AUTH_URL}:signInWithPassword?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  })

  const data: AuthResponse = await response.json()

  if (!response.ok) {
    throw new Error(getAuthErrorMessage((data as any).error?.message))
  }

  // Get user profile
  const profile = await getUserProfile(data.idToken)

  return {
    uid: data.localId,
    email: data.email,
    displayName: profile.displayName || null,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  }
}

// Update user profile
async function updateProfile(idToken: string, displayName: string): Promise<void> {
  const response = await fetch(`${AUTH_URL}:update?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken,
      displayName,
      returnSecureToken: true,
    }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(getAuthErrorMessage(data.error?.message))
  }
}

// Get user profile
async function getUserProfile(idToken: string): Promise<{ displayName: string | null }> {
  const response = await fetch(`${AUTH_URL}:lookup?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })

  const data = await response.json()

  if (!response.ok) {
    return { displayName: null }
  }

  return {
    displayName: data.users?.[0]?.displayName || null,
  }
}

// Refresh token
export async function refreshToken(refreshTokenStr: string): Promise<AuthUser | null> {
  try {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshTokenStr,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return null
    }

    const profile = await getUserProfile(data.id_token)

    return {
      uid: data.user_id,
      email: data.email || "",
      displayName: profile.displayName,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
    }
  } catch {
    return null
  }
}

// Error message mapping
function getAuthErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    EMAIL_EXISTS: "Email này đã được sử dụng",
    INVALID_EMAIL: "Email không hợp lệ",
    WEAK_PASSWORD: "Mật khẩu phải có ít nhất 6 ký tự",
    EMAIL_NOT_FOUND: "Email không tồn tại",
    INVALID_PASSWORD: "Mật khẩu không chính xác",
    INVALID_LOGIN_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
    USER_DISABLED: "Tài khoản đã bị vô hiệu hóa",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Quá nhiều lần thử. Vui lòng thử lại sau",
  }
  return errorMessages[code] || "Đã có lỗi xảy ra. Vui lòng thử lại"
}
