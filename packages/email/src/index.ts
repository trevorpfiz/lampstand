import { Resend } from 'resend';

import { env } from '@lamp/env/email';

export const resend = new Resend(env.RESEND_TOKEN);
