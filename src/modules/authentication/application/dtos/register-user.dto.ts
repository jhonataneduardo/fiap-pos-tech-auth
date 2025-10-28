import { z } from 'zod';

const cpfRegex = /^\d{11}$/;

export const registerUserSchema = z.object({
  cpf: z
    .string()
    .regex(cpfRegex, 'CPF deve conter 11 dígitos numéricos')
    .transform((val) => val.replace(/\D/g, '')),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número'),
  email: z.string().email('Email inválido').optional(),
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres').optional(),
});

export type InputRegisterUserDto = z.infer<typeof registerUserSchema>;

export interface OutputRegisterUserDto {
  id: string;
  cpf: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}
