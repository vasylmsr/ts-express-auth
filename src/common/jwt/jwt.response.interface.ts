export default interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
