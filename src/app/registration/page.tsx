"use client";

import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField  from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from "@mui/icons-material";


const page = () => {

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const router = useRouter();

    // SHOW / HIDE PASSWORD : 📌
      const togglePassword = () => setShowPassword((prev)=> !prev);
      const toggleConfPassword = () => setShowConfPassword((prev)=> !prev);

    const validationSchema = Yup.object({
       name : Yup.string().min(2,"Name must be atleast 2 characters.").required("*Name is required"),
        email : Yup.string().email("Invalid email").required("*Email is required"),
        password : Yup.string().min(6).required("*Password is required"),
        confpassword : Yup.string()
        .oneOf([Yup.ref("password")], "Password must match")
        .required("*Confirm password is required"),
    });


    const formik = useFormik({
        initialValues : {
            name : "",
            email : "",
            password : "",
            confpassword : "",
        },
        validationSchema,
        onSubmit : async (values, {resetForm}) => {
            
            try{
                const res = await fetch("/api/register", {
                    method : "POST",
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify(values),
                });

                const data = await res.json();

                if(res.ok && data.success){
                    setSuccess("Registration Successfull");
                    setError("");
                    resetForm();
                    
                    setTimeout(() => router.push('/login'), 1500);
                }
                else{
                    setError(data.messsage || "Registration failed");
                    setSuccess("");
                }
            }
            catch{
                setError("Server error");
                setSuccess("");
            }
        },

        validateOnChange : true,
        validateOnBlur : true,
    });


return (
<>

    {success && (

                <Stack spacing={2} sx={{width : "100%"}}>
                    <Alert severity="success">
                        <AlertTitle> Success </AlertTitle>
                          {success}
                    </Alert>
                </Stack>

                )}

    {error && (

                <Stack spacing={2} sx={{width : "100%"}}>
                    <Alert severity="error">
                        <AlertTitle> Error </AlertTitle>
                          {error}
                    </Alert>
                </Stack>

                )}


<form onSubmit={formik.handleSubmit}>

    <div className="flex items-center justify-center mt-[40px]">
        <h1 className="text-3xl font-semibold underline underline-offset-[7px]"> Regestration Form </h1>
    </div>

    
    <div className="flex flex-col items-center justify-center h-[480px] w-[420px] mt-[40px] mb-[100px] select-none gap-y-5 mx-auto hover:rounded-xl" 
        style={{border:"1px solid black"}}>
    
            <TextField name="name" label="Name" size="small" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText = {formik.touched.name && formik.errors.name}
            sx={{width : "60%"}}/>


            <TextField name="email" label="Email" type="email" size="small" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText = {formik.touched.email && formik.errors.email}
                sx={{width : "60%"}}/>


            <TextField name="password" label="password" type={showPassword ? "text" : "password"} size="small" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText = {formik.touched.password && formik.errors.password}
                InputProps={{
                        endAdornment : (
                            <InputAdornment position="end">

                                <IconButton onClick={togglePassword} edge="end" size="small"> 

                                    {showPassword ? <VisibilityOff/> : <Visibility/>}

                                </IconButton>
                            </InputAdornment>
                        ),
                }}
                sx={{width : "60%"}} />


            <TextField name="confpassword" label="Confirm password" type={showConfPassword ? "text" : "password"} size="small" value={formik.values.confpassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.confpassword && Boolean(formik.errors.confpassword)} 
                helperText = {formik.touched.confpassword && formik.errors.confpassword}
                InputProps={{
                        endAdornment : (
                            <InputAdornment position="end">

                                <IconButton onClick={toggleConfPassword} edge="end" size="small"> 

                                    {showConfPassword ? <VisibilityOff/> : <Visibility/>}

                                </IconButton>
                            </InputAdornment>
                        )
                }}
                sx={{width : "60%"}}/>


            <Button variant="contained" color="primary" type="submit" size="medium" className="top-[20px]" sx={{width:"30%"}}> Submit </Button>
            
    </div>
</form>

    </>
)
}

export default page;


//NOTES TO REMEMBER REGARDING THIS CODE :  📌📌📌

// Formik only marks a field as touched when it’s blurred (i.e., user clicks out of it), and your Yup validation only shows errors for touched fields.




// let users = [];

//             const storedData = localStorage.getItem("userCred");

//             if(storedData){
//             try{
//                 users = JSON.parse(storedData);

//                 if(!Array.isArray(users)) throw new Error("Invalid format");
//             }
//             catch(err){
//                 console.error("Currupted user data in localstorage");
//                 users = [];            
//             }
//         }

//             const userNameExists = users.some(
//                 (user)=> user.name.toLowerCase() === values.name.toLowerCase()
//             );

//             const userEmailExists = users.some(
//                 (user)=> user.email.toLowerCase() === values.email.toLowerCase()
//             );

            
//             if(userNameExists && userEmailExists){
//                 alert("Both username and email already exists");
//                 return;
//             }
//             else if(userNameExists){
//                 alert("Username already exists");
//                 return;
//             }
//             else if(userEmailExists){
//                 alert("Email already exists");
//                 return;
//             }

//             users.push(values);
//             localStorage.setItem("userCred", JSON.stringify(users));
//             setSuccess("Registration Successfull");
//             resetForm();