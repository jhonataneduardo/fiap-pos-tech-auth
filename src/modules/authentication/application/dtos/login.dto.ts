import { z } from 'zod';

const cpfRegex = /^\d{11}$/;

export const loginSchema = z.object({
  cpf: z
    .string()
    .regex(cpfRegex, 'CPF deve conter 11 dígitos numéricos')
    .transform((val) => val.replace(/\D/g, '')),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type InputLoginDto = z.infer<typeof loginSchema>;

export interface OutputLoginDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: string;
    cpf: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}
