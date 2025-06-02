"use client";

import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField  from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useFormik } from "formik";
import * as Yup from 'yup';


const page = () => {


    const [success, setSuccess] = useState("");

    const router = useRouter();


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
        onSubmit : (values, {resetForm}) => {
            
            let users = [];

            const storedData = localStorage.getItem("userCred");

            if(storedData){
            try{
                users = JSON.parse(storedData);

                if(!Array.isArray(users)) throw new Error("Invalid format");
            }
            catch(err){
                console.error("Currupted user data in localstorage");
                users = [];            
            }
        }

            const userNameExists = users.some(
                (user)=> user.name.toLowerCase() === values.name.toLowerCase()
            );

            const userEmailExists = users.some(
                (user)=> user.email.toLowerCase() === values.email.toLowerCase()
            );

            
            if(userNameExists && userEmailExists){
                alert("Both username and email already exists");
                return;
            }
            else if(userNameExists){
                alert("Username already exists");
                return;
            }
            else if(userEmailExists){
                alert("Email already exists");
                return;
            }

            users.push(values);
            localStorage.setItem("userCred", JSON.stringify(users));
            setSuccess("Registration Successfull");
            resetForm();
        },

        validateOnChange : true,
        validateOnBlur : true,
    });


    useEffect(() => {
          
            if(success){

                const timer = setTimeout(() => {
                    setSuccess("");
                    router.push("/login");
                },2000);

                return()=> {
                    clearTimeout(timer);
                }
            }
        
        }, [success]);


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


            <TextField name="password" label="password" type="password" size="small" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText = {formik.touched.password && formik.errors.password}
                sx={{width : "60%"}} />


            <TextField name="confpassword" label="Confirm password" type="password" size="small" value={formik.values.confpassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.confpassword && Boolean(formik.errors.confpassword)} 
                helperText = {formik.touched.confpassword && formik.errors.confpassword}
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