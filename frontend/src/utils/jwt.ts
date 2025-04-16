import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export const decodeJwt = (token: string): JwtPayload => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    throw new Error("Invalid JWT token format");
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJwt(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
