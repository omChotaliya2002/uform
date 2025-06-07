
// => save plain password to local file : 💥💥💥💥


import fs from "fs";
import bcrypt from "bcryptjs";


const filePath = "src/passwords.tsx";

export async function saveUserToKVAndFile(username : string, password : string) {


    const hashedPassword = await bcrypt.hash(password, 10);

    if(process.env.NODE_ENV === "development") {
        
        const passwordEntry = `\n// [${new Date().toLocaleString()}]\nexport const ${username}_pass = "${password}";\n`;

        try{
             fs.appendFileSync(filePath, passwordEntry, "utf-8");
             console.log("✅✅✅user saved to kv");

        } catch(error){
            console.error("❌ failed to save password locally.", error);
        }

    }


    return hashedPassword;

} 