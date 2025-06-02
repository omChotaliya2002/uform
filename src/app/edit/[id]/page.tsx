"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { object } from "yup";

export default function EditUserData() {


    const {id} = useParams();
    const [formData, setFormData] = useState<{[key : string] : string}>({});
    const [showForm, setShowForm] = useState(false);
     const [errors, setErrors] = useState<{[key : string] : string}>({});

      // Proper field error message : ======================📌

  const requiredFieldMsg :{[key : string] : string} = {

    name : "User name is required.",
    email : "Email address is required.",
    phone : "Phone no. is required.",
    address : "Address is required.",
    city : "City name is required.",
    state : "State name is required.",
    zip : "Zip code is required.",
    country : "Country name is required.",
    notes : "Notes is required."

}


      // custom validations : =========================================📌

  type fieldName = "email" | "phone" | "zip" | "name" | "notes" | "address" | "city" | "state" | "country" | string;

  const validateField = (name : fieldName, value : string) : string => {

      const trimmedValue = value.trim();

      if(!trimmedValue) {
        return requiredFieldMsg[name] || `${name} is required.`;
      }

      switch(name){
          case "email" : {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if(!emailRegex.test(trimmedValue)){
                return "Invalid email format";
              }
              break;
          }

            case "phone" : {
              const phoneRegex = /^\d{10}$/;
              if(!phoneRegex.test(trimmedValue)){
                return "number must be exactly 10 digits";
              }
              break;
          }

            case "zip" : {
              const zipRegex = /^\d{6}$/;
              if(!zipRegex.test(trimmedValue)){
                return "Zip code must be exactly 6 digits";
              }
              break;
          }

            case "name" : {

              if(trimmedValue.length < 2){
                return "Name must be at least 2 characters";
              }
              break;
          }

            case "notes" : {

              if(value.length > 50){
                return "Notes cannot exceed 50 characters";
              }
              break;
          }

          default : 
          break;
          
      }
        return "";
  };





    const router = useRouter();

    useEffect(() => {

        const storedData : any[] = JSON.parse(localStorage.getItem('userData')  || '[]')
        const userToEdit = storedData.find(user => user.id === id);

        setShowForm(true);

        if(userToEdit){
            setFormData(userToEdit);
            // setFormData({});                //📌📌    
        }

    }, [id]);


    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const newErrors : {[key:string] : string} = {};
        Object.keys(formData).forEach(field=> {
            const error = validateField(field, formData[field] || "");
            if(error) newErrors[field] = error;
        });

        if(Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return;
        }

        const storedData : any[] = JSON.parse(localStorage.getItem('userData') || '[]');
        const updateData = storedData.map(user => user.id === id ? {...user, ...formData} : user);
        localStorage.setItem('userData', JSON.stringify(updateData));
        router.push("/");
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
    
            setFormData(prev => ({
                ...prev, [name] : value,
            }));
    
            setErrors(prevErrors => {
              const newErrors = {...prevErrors};
              if(newErrors[name]){
                delete newErrors[name];
              }
              return newErrors;
            });
        };
    
    
      const handleBlur = (e : React.FocusEvent<HTMLInputElement>) => {
    
            const{name, value} = e.target;
    
            const error = validateField(name, value);
            setErrors(prev => ({...prev, [name] : error}))
    
      };


return(

<>
{
    showForm && (

    <div className="w-full h-full fixed flex items-center justify-center z-20 top-0" tabIndex={-1} style={{border:"0px solid green"}}> 

        {/* background overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-10 transition-opacity duration-300 ease-in-out" tabIndex={-2} style={{animation : "fadeInModal 0.2s forwards"}}>  </div>

            {/* modal */}
        <div className="relative w-[450px] h-[510px] bg-white text-black shadow-lg z-30 opacity-100" style={{border:"3px solid skyblue"}}> 

        <form onSubmit={handleSubmit} className="relative flex flex-col h-full w-full mx-auto items-center justify-center space-y-[3px]" tabIndex={-10} style={{border:"0px solid blue"}}>

            {/* CLOSE BUTTON :  */}
            <div className="absolute mt-[-460px] ml-[400px] w-[30px] h-[30px]" style={{border:"0px solid red"}}> 

                <button className="text-center w-full h-full bg-white text-black font-extrabold text-[18px] hover:cursor-pointer hover:scale-125"
                onClick={()=> {setShowForm(false); router.push("/uform2")}}> &#x2716; </button>

            </div>


            <div className="flex flex-row items-center justify-center mt-[10px]" style={{border:"0px solid black"}}> 
                <h1 className="w-[110px] text-[15px] font-semibold"> First Name : </h1>
                    <div className="flex flex-col">  
                    <input type="text" name="name" value={formData["name"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["name"]&& (
                            <div className="text-red-500 text-xs font-semibold"> {errors["name"]} </div> 
                        )}
                </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> Email : </h1>
                    <div className="flex flex-col">  
                        <input type="email" name="email" value={formData["email"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["email"] && (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["email"]} </div> 
                        )}
                    </div>
            </div>

            
            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> Phone no. : </h1>
                    <div className="flex flex-col"> 
                        <input type="text" maxLength={10} name="phone" value={formData["phone"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["phone"] && (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["phone"]} </div> 
                        )}
                    </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> Address : </h1>
                    <div className="flex flex-col"> 
                        <input type="text" name="address" value={formData["address"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                            {errors["address"] && (
                            <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["address"]} </div> 
                            )}
                    </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> City : </h1>
                    <div className="flex flex-col"> 
                        <input type="text" name="city" value={formData["city"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["city"] && (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["city"]} </div> 
                        )}
                    </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> State : </h1>
                    <div className="flex flex-col"> 
                    <input type="text" name="state" value={formData["state"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["state"] && (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["state"]} </div> 
                        )}
                    </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> Zip : </h1>
                <div className="flex flex-col">  
                    <input type="text" name="zip" value={formData["zip"] || ""} maxLength={6} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                    
                    {errors["zip"] && (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["zip"]} </div> 
                    )}
                </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> Country : </h1>
                    <div className="flex flex-col">  
                    <input type="text" name="country" value={formData["country"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["country"] && (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["country"]} </div> 
                        )}
                    </div>
            </div>


            <div className="flex flex-row items-center justify-center " style={{border:"0px solid black"}}>
                <h1 className="w-[110px] text-[15px] font-semibold"> Notes : </h1>
                    <div className="flex flex-col">  
                        <input type="text" name="notes" value={formData["notes"] || ""} onChange={handleChange} onBlur={handleBlur} className="focus:ring-[1.5px] w-[200px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>

                        {errors["notes"]&& (
                        <div className="text-red-500 text-xs font-semibold mt-[2px]"> {errors["notes"]} </div> 
                        )}
                    </div>
            </div>


            <button type="submit" className="mt-[10px] w-[200px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800"
            > Submit </button>

        </form>

        </div>
    </div>
  )
}

</>     



    )



    
}
