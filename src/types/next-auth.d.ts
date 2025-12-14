import 'next-auth';
import 'next-auth/jwt';

import { AUTH_TYPE } from '@/constants/auth';
import { User as AuthUser } from '@/types/auth';

declare module 'next-auth' {
  interface User extends AuthUser {
    authType: AUTH_TYPE;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: User;
    authType: AUTH_TYPE;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
    accessToken: string;
    expiresIn: number;
    refreshToken?: string;
    authType: AUTH_TYPE;
    error?: 'RefreshTokenError';
  }
}
