
import fs from "fs";
import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";


export async function saveUserToKVAndFile(username : string, password : string) {


    const hashedPassword = await bcrypt.hash(password, 10);

    //1. save the hashed password to KV : ✅

    await kv.set(`user:${username.toLowerCase()}`,{name :username, hashedPassword});


    // 2. save plain password to local file : ✅

    const filePath = "src/passwords.tsx";

    const passwordEntry = `\n// [${new Date().toLocaleString()}]\nexport const ${username}_pass = "${password}";\n`;

    fs.appendFileSync(filePath, passwordEntry, "utf-8");


    console.log("✅✅✅user saved to kv");

    return hashedPassword;

} 