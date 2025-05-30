"use client"


import { IconButton, TextField } from "@mui/material";
import {Button} from "@mui/material";
import React, { useState } from "react";
import  {AccountCircleRounded, WindowOutlined} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";


export default function Page() {


      const [userName, setUserName] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
  
      const router = useRouter();
  
      // SHOW / HIDE PASSWORD : 📌
  
      const [showPassword, setShowPassword] = useState(false);
  
      const handleClickedShowPassword = () => setShowPassword((show)=> !show);
  
      const handleMoouseDownPassword = (event : React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
      }
  
      const handleMoouseUpPassword = (event : React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
      }
      
  
      // FORM RELATED FUNCTIONALITY : 📌

      const handleLogin = () => {

            if(typeof window !== "undefined") {

                const storedData = localStorage.getItem("userData");

                if(!storedData){
                    setError("No registered user found");
                    return;
                }
                
                const parsedData = JSON.parse(storedData);

                if(parsedData.Name === userName && parsedData.Password === password) {

                        setSuccess("Login Successfull");
                        setError("");
                }
                else {
                    setError("Invalid Credentials");
                    setSuccess("");
                }
            }
      };



  return (
<>
     
     <div className="flex items-center justify-center mt-[40px] mb-[40px]">
            <h1 className="text-4xl font-mono underline underline-offset-[8px]" style={{fontWeight : "bold"}}> Login </h1>
        </div>

    <div className="flex flex-col w-[400px] h-[350px] mx-auto items-center justify-center mt-[30px] mb-[100px] gap-y-6" style={{border:"1px solid black"}}>


            <TextField id="username" variant="outlined" value={userName} label="Username" type="name" onChange={(e)=> setUserName(e.target.value)}
                slotProps={{
                    input : {
                        startAdornment : (
                            <InputAdornment position="start">
                                    {/* <AccountCircleOutlined/> */}
                                    <AccountCircleRounded/>
                            </InputAdornment>
                        ),
                    }
                }}/>
            {/* {unameError && <p className="text-red-500 font-semibold text-sm mt-[-20px]"> {unameError} </p>} */}


            <TextField id="password" variant="outlined" value={password} label="Password" type={showPassword ? "text" : "password"} onChange={(e)=> setPassword(e.target.value)}
                slotProps={{
                    input : {
                        endAdornment : (
                            <InputAdornment position="end">

                                <IconButton aria-label={showPassword ? "hide password" : "show password"} onClick={handleClickedShowPassword}
                                    onMouseDown={handleMoouseDownPassword} onMouseUp={handleMoouseUpPassword} edge="end" size="small">

                                    {showPassword ? <VisibilityOff/> : <Visibility/>}

                                </IconButton>
                            </InputAdornment>
                        )
                      }
                   }}/>


            {/* {passError && <p className="text-red-500 font-semibold text-sm mt-[-20px]"> {passError} </p>} */}
            
                <Button style={{marginTop : "20px"}} variant="contained" onClick={handleLogin}> Login </Button>

                {error && (
                
                <Stack spacing={2} sx={{width : "100%"}}>
                    <Alert severity="error">
                        <AlertTitle> Error </AlertTitle>
                        {error}
                    </Alert>
                </Stack>
                )}

                {success && (

                <Stack spacing={2} sx={{width : "100%"}}>
                    <Alert severity="success">
                        <AlertTitle> Success </AlertTitle>
                        {success}
                    </Alert>
                </Stack>

                )}

            <div className="flex items-center justify-between gap-2">
                
                 Don't have an account? <Link className="text-blue-500 hover:underline hover:underline-offset-4" href={"/registration"}> Register here </Link>
            </div>
    </div>


</>
    
  );
}