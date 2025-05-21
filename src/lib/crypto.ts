import bcrypt from "bcryptjs";

async function hash(text: string): Promise<string> {
  if (!text) {
    throw new Error("Password is required");
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(text, salt);
}

async function isValidHash(text: string, hashedText: string): Promise<boolean> {
  return await bcrypt.compare(text, hashedText);
}

export { hash, isValidHash };
