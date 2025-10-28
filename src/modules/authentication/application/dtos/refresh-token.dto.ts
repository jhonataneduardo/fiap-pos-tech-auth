import { z } from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

export type InputRefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export interface OutputRefreshTokenDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}
