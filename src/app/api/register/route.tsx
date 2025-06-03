// import { kv } from "@vercel/kv";

// export async function POST(req : Request) {

//     const body = await req.json();

//     const userKey = `user:${body.email}`;
//     const existing = await kv.get(userKey);

//     if(existing){
        
//         return new Response(JSON.stringify({success : false, message : "User already exists"}), {status : 400});

//     }

//     await kv.set(userKey, JSON.stringify(body));

//     return new Response(JSON.stringify({success : true}), {status : 201});
// }



// CODE WITH JSON FILE : 📌📌

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/users.json");

console.log("current file path is : ", filePath);

export async function POST(req : Request) {

    try{
        const {name, password} = await req.json();

        if(!name || !password){

            return NextResponse.json({success : false, message : "Missing fields"}, {status : 400});
        }

        const fileData = await fs.readFile(filePath, "utf-8");
        const users = JSON.parse(fileData) || [];

        const userExists = users.find((user : any) => user.name.toLowerCase() === name.toLowerCase());

        if(userExists){
            return NextResponse.json({success : false, message : "user alredy exists"}, {status : 409});
        }

        users.push({name, password});

        await fs.writeFile(filePath, JSON.stringify(users, null, 2));

        return NextResponse.json({success : true, message : "Registration successfull"}, {status : 201});
    }
    catch(error){
        return NextResponse.json({success : false, meessage : "Server error"}, {status : 500});
    }
}


































