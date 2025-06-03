import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from "path";
import jwt from "jsonwebtoken"; 

const SECRET = process.env.JWT_SECRET || "mySuperSecret";


export async function POST(req : Request) {

    const{name, password} = await req.json();
    const filePath = path.join(process.cwd(), 'public/data/users.json');


    try{
        const fileData = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(fileData);

        const matchedUser = users.find(
            (user : any)=> 
                user.name.trim().toLowerCase() === name.trim().toLowerCase() &&
                user.password === password
        );

        if(matchedUser){
            // CREATING JWT : 📌📌📌

            const token = jwt.sign({name : matchedUser.name}, SECRET, {expiresIn : "20s"});

            return NextResponse.json({success : true, token, message : "Login successfully"});
            
        }
        else{
            return NextResponse.json({success : false, message : "Invalid Credentials"}, {status : 401});
        }
    }
    catch(error){
        return NextResponse.json({success : false, message : "Server error"}, {status : 500});
    }
}