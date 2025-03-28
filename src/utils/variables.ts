const {env} = process as {env: { [key: string]: string }};

export const {MONGO_URI, MAILTRAP_USER,  MAILTRAP_PASS} = env;
export const VERIFICATION_EMAIL = env.VERIFICATION_EMAIL;
export const PASSWORD_RESET_LINK = env.PASSWORD_RESET_LINK;
export const SIGN_IN_URL = env.SIGN_IN_URL;
export const JWT_SECRET = env.JWT_SECRET;
export const CLOUD_NAME = env.CLOUD_NAME;
export const CLOUD_KEY = env.CLOUD_KEY;
export const CLOUD_SECRET = env.CLOUD_SECRET;

