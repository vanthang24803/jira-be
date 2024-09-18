import bcrypt from "bcrypt";

const hashPasswordHelper = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

const verifyPasswordHelper = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { hashPasswordHelper, verifyPasswordHelper };
