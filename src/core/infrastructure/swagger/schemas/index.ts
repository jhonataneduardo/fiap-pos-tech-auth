import { commonSchemas } from './common';
import { authSchemas } from './auth';

export const schemas = {
    ...commonSchemas,
    ...authSchemas
};
