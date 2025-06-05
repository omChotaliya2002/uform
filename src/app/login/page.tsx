"use client";


import { IconButton, TextField } from "@mui/material";
import {Button} from "@mui/material";
import React, { useState, useEffect } from "react";
import  {AccountCircleRounded, SettingsPhoneTwoTone, WindowOutlined} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { jwtDecode } from "jwt-decode";
import styles from "./Login.module.css";


export default function Page() {


      const [success, setSuccess] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [error, setError] = useState("");

      const router = useRouter();

      // SHOW / HIDE PASSWORD : 📌
      const togglePassword = () => setShowPassword((prev)=> !prev);


    const handleLogin = async (values : {name : string, password : string}) : Promise<boolean> => {

        try{
            const res = await fetch('/api/login', {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(values),
            });

            const data = await res.json();

            if(res.ok && data.success) {

                sessionStorage.setItem("token", data.token);

                // Auto remove token when it expires : 👍
                const decoded : {exp:number} = jwtDecode(data.token);
                const expiryInMs = decoded.exp * 1000 - Date.now();

                setTimeout(() => {

                    sessionStorage.removeItem("token");
                    console.log("Token expired and removed from sessionStorage");
                    window.location.href = "/login";
                    
                }, expiryInMs);

                router.push("/uform2");
                return true;

            }else{
                setError(data.message || "Invalid login");
                return false;
            }
        }
        catch(error){
            setError("Server error");
            return false;
        }
    };


      const validationSchema = Yup.object({

        name : Yup.string().min(2,"Name must be atleast 2 characters.").required("*Userame is required"),
        password : Yup.string().min(6,"Password must be at least 6 characters").required("*Password is required"),

    });


      const formik = useFormik({

        initialValues : {
            name : "",
            email : "",
            password : "",
        },
        validationSchema,
        onSubmit : async (values, {resetForm}) => {

           const isLoggedIn = await handleLogin(values);

           if(isLoggedIn){
            setSuccess("Login Successfull");  
            setError(""); 
            resetForm();

            setTimeout(() => {
                router.push("/uform2");
            }, 1500);
          }else{
            setSuccess("");
          }
        }
      });
      

  return (
<> 

<div className = {styles.loginContainer} style={{flexDirection : "column"}}>

{success && (

            <Stack spacing={2} sx={{width : "100%", position : "fixed", top : 0, left : 0, zIndex : 9999}}>
                <Alert severity="success">
                    <AlertTitle> Success </AlertTitle>
                        {success}
                </Alert>
            </Stack>
        )} 

        {error && (

            <Stack spacing={2} sx={{width : "100%", position : "fixed", top : 0, left : 0, zIndex : 9999}}>
                <Alert severity="error">
                    <AlertTitle> Error </AlertTitle>
                        {error}
                </Alert>
            </Stack>
        )} 


     <div className="flex items-center justify-center -mt-[80px]">
            <h1 className="text-[40px] font-mono text-white" style={{fontWeight : "bold"}}> Login </h1>
        </div>

  <form onSubmit={formik.handleSubmit}>

    <div className="p-5 flex flex-col w-[400px] h-[350px] mx-auto items-center justify-center gap-y-6" style={{border:"0px solid black"}}>


            <TextField name="name" id="username" variant="filled" fullWidth label="Username" type="name" value={formik.values.name} sx={{bgcolor : "#FFF5EE", borderRadius : "10px" , boxShadow : "0 0 0 3px #708090"}}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText = {formik.touched.name && formik.errors.name}
                inputProps={{
                        startadornment : (
                            <InputAdornment position="start">
                                    <AccountCircleRounded/>
                            </InputAdornment>
                        ),
                }}/>


            <TextField name="password" id="password" variant="filled" fullWidth label="Password" type={showPassword ? "text" : "password"} sx={{bgcolor : "#FFF5EE", borderRadius : "10px", boxShadow : "0 0 0 3px #708090"}}
                value={formik.values.password}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                        endAdornment : (
                            <InputAdornment position="end">

                                <IconButton onClick={togglePassword} edge="end" size="small">

                                    {showPassword ? <VisibilityOff/> : <Visibility/>}

                                </IconButton>
                            </InputAdornment>
                        )
                   }}/>


            {/* {passError && <p className="text-red-500 font-semibold text-sm mt-[-20px]"> {passError} </p>} */}
            
                <Button type="submit" fullWidth style={{marginTop : "20px", borderRadius : "10px"}} variant="contained"> Login </Button>


            <div className="flex items-center justify-between gap-2">
                
                <h1 className="text-white"> Don't have an account? </h1>  <Link className="text-blue-300 hover:underline hover:underline-offset-4" href={"/registration"}> Register here </Link>
            </div>
    </div>

  </form>
</div>
</>
    
  );
}



      // FOR LOGIN FUNCTIONLITY : 📌
    //   const handleLogin = (values : {name : string; password : string}) => {

    //         if(typeof window === "undefined") return false;

    //             const storedData = localStorage.getItem("userCred");
    //             if(!storedData) return false;

    //             try{
    //                 const users = JSON.parse(storedData);
    //                 if(!Array.isArray(users)) throw new Error("Data is not an array"); 

    //                 const matchedUser = users.find(
    //                 (user : any) => user.name.trim().toLowerCase() === values.name.trim().toLowerCase() && user.password === values.password
    //                 );
    //             return !!matchedUser;
    //         }
    //         catch{
    //             return false;
    //         }
    //   };