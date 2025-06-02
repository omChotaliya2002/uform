import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from "path";


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
            return NextResponse.json({success : true, message : 'Login successfull'});
        }
        else{
            return NextResponse.json({success : false, message : "Invalid Credentials"}, {status : 401});
        }
    }
    catch(error){
        return NextResponse.json({success : false, message : "Server error"}, {status : 500});
    }
}