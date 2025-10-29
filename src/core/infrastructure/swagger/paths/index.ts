import { healthPaths } from './health';
import { authPaths } from './auth';

export const paths = {
    ...healthPaths,
    ...authPaths
};
