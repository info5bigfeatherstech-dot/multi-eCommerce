import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";
import { setEcommAccessToken, clearEcommAccessToken, setEcommRefreshToken, clearAllEcommTokens } from "./authStorage.js";

/**
 * Fallback security questions as defined in the API specification.
 * Displayed in registration dropdown when offline or waiting for API.
 */
export const DEFAULT_SECURITY_QUESTIONS = [
  { id: "nick_name", text: "What is your nickname?" },
  { id: "first_school", text: "What was the name of your first school?" },
  { id: "grandmother_name", text: "What is your grandmother's name?" },
  { id: "eye_color", text: "What is your eye color?" },
  { id: "favorite_place", text: "What is your favorite place?" },
];

/**
 * 1) Get security questions
 * GET /api/auth/security-questions
 */
export async function getSecurityQuestions() {
  try {
    const response = await apiClient.get(ENDPOINTS.AUTH.SECURITY_QUESTIONS);
    const questions = response.data?.questions || response.data?.data?.questions;
    if (Array.isArray(questions) && questions.length > 0) {
      return questions;
    }
    return DEFAULT_SECURITY_QUESTIONS;
  } catch (error) {
    console.warn("Could not fetch security questions from server, using defaults:", error.message);
    return DEFAULT_SECURITY_QUESTIONS;
  }
}

/**
 * 2) Register
 * POST /api/auth/register
 * 
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.password
 * @param {string} payload.confirmPassword
 * @param {Array<{questionId: string, answer: string}>} payload.securityAnswers
 */
export async function register(payload) {
  try {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
      name: payload.name?.trim(),
      email: payload.email?.trim(),
      phone: payload.phone?.trim(),
      password: payload.password,
      confirmPassword: payload.confirmPassword,
      securityAnswers: payload.securityAnswers || [],
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    throw customError;
  }
}

/**
 * 3) Verify registration OTP (then login)
 * POST /api/auth/otp-verify-login
 * 
 * @param {Object} payload
 * @param {string} payload.identifier - email or phone
 * @param {string} payload.otp - 6-digit code
 * @param {string} [payload.email]
 */
export async function verifyRegistrationOtp({ identifier, otp, email }) {
  try {
    const targetIdentifier = identifier || email;
    const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP_LOGIN, {
      identifier: targetIdentifier,
      email: email || targetIdentifier,
      otp: otp?.trim(),
    });

    const data = response.data || {};
    if (data.accessToken) {
      setEcommAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      setEcommRefreshToken(data.refreshToken);
    }
    return data;
  } catch (error) {
    const errData = error.response?.data;
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    throw customError;
  }
}

/**
 * 4) Login
 * POST /api/auth/login
 * 
 * @param {Object} payload
 * @param {string} payload.identifier - Email or 10-digit phone
 * @param {string} payload.password
 * @param {string} [payload.portal="ecomm"]
 */
export async function login({ identifier, password, portal = "ecomm" }) {
  try {
    const trimmedIdentifier = identifier?.trim();
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      identifier: trimmedIdentifier,
      password,
      portal,
    });

    const data = response.data || {};
    if (data.accessToken) {
      setEcommAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      setEcommRefreshToken(data.refreshToken);
    }
    return data;
  } catch (error) {
    const errData = error.response?.data;
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    throw customError;
  }
}

/**
 * 5) Forgot password — Step 1: Find user
 * POST /api/auth/forgot-password/find-user
 * 
 * @param {Object} payload
 * @param {string} payload.identifier - email or phone
 */
export async function forgotPasswordFindUser({ identifier }) {
  try {
    const trimmed = identifier?.trim();
    const isEmail = trimmed.includes("@");
    const payload = {
      identifier: trimmed,
      ...(isEmail ? { email: trimmed } : { phone: trimmed }),
    };

    const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_FIND_USER, payload);
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    throw customError;
  }
}

/**
 * 6) Forgot password — Step 2: Verify security answer
 * POST /api/auth/forgot-password/verify-answers
 * 
 * @param {Object} payload
 * @param {string} payload.challengeToken
 * @param {Array<{questionId: string, answer: string}>} payload.answers
 */
export async function forgotPasswordVerifyAnswers({ challengeToken, answers }) {
  try {
    const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_VERIFY_ANSWERS, {
      challengeToken,
      answers,
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    // 400 with SECURITY_ANSWERS_INCORRECT or 429
    if (errData && errData.code === "SECURITY_ANSWERS_INCORRECT") {
      return errData;
    }
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    customError.attemptsRemaining = errData?.attemptsRemaining;
    throw customError;
  }
}

/**
 * 7) Forgot password — Step 2b: Email OTP fallback
 * POST /api/auth/forgot-password/verify-otp-fallback
 * 
 * @param {Object} payload
 * @param {string} payload.challengeToken
 * @param {string} payload.otp
 */
export async function forgotPasswordVerifyOtpFallback({ challengeToken, otp }) {
  try {
    const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_VERIFY_OTP_FALLBACK, {
      challengeToken,
      otp: otp?.trim(),
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    throw customError;
  }
}

/**
 * 8) Forgot password — Step 3: Set new password
 * POST /api/auth/forgot-password/reset-direct
 * 
 * @param {Object} payload
 * @param {string} payload.resetToken
 * @param {string} payload.newPassword
 * @param {string} payload.confirmPassword
 */
export async function forgotPasswordResetDirect({ resetToken, newPassword, confirmPassword }) {
  try {
    const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_RESET_DIRECT, {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    const msg = normalizeApiError(error);
    const customError = new Error(msg);
    customError.code = errData?.code;
    customError.response = error.response;
    throw customError;
  }
}

/**
 * Customer Logout
 */
export function logoutCustomer() {
  clearAllEcommTokens();
}
