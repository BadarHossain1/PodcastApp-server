const {env} = process as {env: { [key: string]: string }};

export const {MONGO_URI, MAILTRAP_USER,  MAILTRAP_PASS} = env;
export const VERIFICATION_EMAIL = env.VERIFICATION_EMAIL;
