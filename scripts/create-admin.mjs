/**
 * Create an admin account for /admin, or promote an existing user to admin.
 *
 *   npm run create-admin -- you@example.com [username]
 *
 * Prompts for the password (input is hidden), so it never lands in shell
 * history. When stdin is not a terminal, the password is read from stdin
 * instead (e.g. `openssl rand -base64 18 | npm run create-admin -- ...`). Reads MONGODB_URI from .env.local. Re-running it for an existing
 * email resets that account's password and makes sure it is a verified admin.
 */
import readline from "node:readline";
import mongoose from "mongoose";
import User, { ROLES } from "../src/models/UserModel.js";

const MIN_PASSWORD_LENGTH = 12;

const askHidden = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (text) => {
      if (!muted) rl.output.write(text);
    };
    rl.question(question, (answer) => {
      rl.output.write("\n");
      rl.close();
      resolve(answer);
    });
    muted = true;
  });

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const [email, usernameArg] = process.argv.slice(2);
if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  fail("Usage: npm run create-admin -- you@example.com [username]");
}
if (!process.env.MONGODB_URI) {
  fail("MONGODB_URI is not set. Add it to .env.local.");
}

const readStdin = async () => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data.trim();
};

const interactive = process.stdin.isTTY;
const password = interactive
  ? await askHidden(`Password for ${email} (min ${MIN_PASSWORD_LENGTH} characters): `)
  : await readStdin();
if (password.length < MIN_PASSWORD_LENGTH) {
  fail(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
}
if (interactive && (await askHidden("Confirm password: ")) !== password) {
  fail("Passwords do not match.");
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  let user = await User.findOne({ email });
  const existed = Boolean(user);
  if (!user) {
    user = new User({ email, username: usernameArg || email.split("@")[0] });
  } else if (usernameArg) {
    user.username = usernameArg;
  }
  // the model's pre-save hook hashes the password
  user.password = password;
  user.role = ROLES.ADMIN;
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  console.log(`${existed ? "Updated" : "Created"} admin ${email}. Sign in at /admin/login.`);
} catch (error) {
  fail(`Could not create admin: ${error.message}`);
} finally {
  await mongoose.disconnect();
}
