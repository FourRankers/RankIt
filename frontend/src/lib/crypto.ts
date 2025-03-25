import bcrypt from 'bcryptjs';

const FIXED_SALT = '$2a$10$CwTycUXWt0TYDoWfvA2WZe';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, FIXED_SALT);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}; 