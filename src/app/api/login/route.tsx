import { kv } from "@vercel/kv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


const SECRET = process.env.JWT_SECRET;


export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ success: false, message: "Name and password are required" }, { status: 400 });
    }

    const userKey = `user:${name.toLowerCase()}`;
    const userData = await kv.get(userKey);

    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const user = userData as {
      name : string;
      email : string;
      password : string;
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    if(!SECRET){
        console.error("Missing JWT_SECRET");
        return NextResponse.json({success : false, message : "Server misconfiguration"}, {status : 500});
    }

    const token = jwt.sign({ name: user.name}, SECRET, { expiresIn: "1m" });

    return NextResponse.json({ success: true, token}, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "<Server></Server> error" }, { status: 500 });
  }
};













// LOGIN USING JWT TOKEN : 

// import { NextResponse } from "next/server";
// import fs from 'fs/promises';
// import path from "path";
// import jwt from "jsonwebtoken"; 

// const SECRET = process.env.JWT_SECRET || "mySuperSecret";


// export async function POST(req : Request) {

//     const{name, password} = await req.json();
//     const filePath = path.join(process.cwd(), 'public/data/users.json');


//     try{
//         const fileData = await fs.readFile(filePath, 'utf-8');
//         const users = JSON.parse(fileData);

//         const matchedUser = users.find(
//             (user : any)=> 
//                 user.name.trim().toLowerCase() === name.trim().toLowerCase() &&
//                 user.password === password
//         );

//         if(matchedUser){
//             // CREATING JWT : 📌📌📌

//             const token = jwt.sign({name : matchedUser.name}, SECRET, {expiresIn : "20s"});

//             return NextResponse.json({success : true, token, message : "Login successfully"});
            
//         }
//         else{
//             return NextResponse.json({success : false, message : "Invalid Credentials"}, {status : 401});
//         }
//     }
//     catch(error){
//         return NextResponse.json({success : false, message : "Server error"}, {status : 500});
//     }
// }