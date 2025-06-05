import { kv } from "@vercel/kv";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { saveUserToKVAndFile } from "@/saveUsers";

export async function POST(req: Request) {
  try {
    const { name, email ,password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const userKey = `user:${name.toLowerCase()}`;
    const existingUser = await kv.get(userKey);

    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
     const hashedPassword = await saveUserToKVAndFile(name, password);

     console.log(hashedPassword);
  
    const userData = { name, email, password: hashedPassword,};

    await kv.set(userKey, JSON.stringify(userData));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}











// CODE WITH JSON FILE : 📌📌

// import { NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";

// const filePath = path.join(process.cwd(), "public/data/users.json");

// console.log("current file path is : ", filePath);

// export async function POST(req : Request) {

//     try{
//         const {name, password} = await req.json();

//         if(!name || !password){

//             return NextResponse.json({success : false, message : "Missing fields"}, {status : 400});
//         }

//         const fileData = await fs.readFile(filePath, "utf-8");
//         const users = JSON.parse(fileData) || [];

//         const userExists = users.find((user : any) => user.name.toLowerCase() === name.toLowerCase());

//         if(userExists){
//             return NextResponse.json({success : false, message : "user alredy exists"}, {status : 409});
//         }

//         users.push({name, password});

//         await fs.writeFile(filePath, JSON.stringify(users, null, 2));

//         return NextResponse.json({success : true, message : "Registration successfull"}, {status : 201});
//     }
//     catch(error){
//         return NextResponse.json({success : false, meessage : "Server error"}, {status : 500});
//     }
// }


































