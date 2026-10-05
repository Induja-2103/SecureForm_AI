import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SALT = "cybershield_secureform_ai_v2";

function hashPassword(password: string): string {
  return crypto.scryptSync(password, SALT, 32).toString("hex");
}

async function initUsersStore(): Promise<UserAccount[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const content = await fs.readFile(USERS_FILE, "utf-8");
    const users = JSON.parse(content) as UserAccount[];
    if (Array.isArray(users) && users.length > 0) {
      return users;
    }
  } catch {
    // file does not exist or invalid
  }

  // Seed default demo operator if no users exist
  const defaultUser: UserAccount = {
    id: "usr_induja_default",
    username: "induja",
    email: "induja2103@gmail.com",
    name: "Induja S",
    passwordHash: hashPassword("admin123"),
    createdAt: new Date().toISOString()
  };

  const initialList = [defaultUser];
  await fs.writeFile(USERS_FILE, JSON.stringify(initialList, null, 2), "utf-8");
  return initialList;
}

export async function getAllUsers(): Promise<UserAccount[]> {
  return await initUsersStore();
}

export async function findUserByIdentifier(identifier: string): Promise<UserAccount | null> {
  const users = await getAllUsers();
  const cleanId = identifier.trim().toLowerCase();
  return users.find(u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) || null;
}

export async function registerUserAccount(data: {
  username: string;
  email: string;
  password: string;
  name?: string;
}): Promise<{ success: boolean; user?: Omit<UserAccount, "passwordHash">; error?: string }> {
  const cleanUsername = data.username.trim();
  const cleanEmail = data.email.trim().toLowerCase();
  const password = data.password.trim();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters long." };
  }

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password || password.length < 4) {
    return { success: false, error: "Password must be at least 4 characters long." };
  }

  const users = await getAllUsers();

  const existingUser = users.find(
    u => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email.toLowerCase() === cleanEmail
  );

  if (existingUser) {
    if (existingUser.username.toLowerCase() === cleanUsername.toLowerCase()) {
      return { success: false, error: "This username is already taken. Please choose another." };
    }
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    email: cleanEmail,
    name: data.name?.trim() || cleanUsername,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");

  const { passwordHash, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

export async function verifyUserCredentials(
  identifier: string,
  passwordAttempt: string
): Promise<Omit<UserAccount, "passwordHash"> | null> {
  const user = await findUserByIdentifier(identifier);
  if (!user) return null;

  const attemptHash = hashPassword(passwordAttempt);
  if (attemptHash !== user.passwordHash) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
