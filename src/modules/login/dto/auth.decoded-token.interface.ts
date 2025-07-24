export interface DecodedToken {
  user: {
    id: string;
    email: string;
  };
  iat: number;
  exp: number;
}
