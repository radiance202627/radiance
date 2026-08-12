import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password against a hashed password.
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}
