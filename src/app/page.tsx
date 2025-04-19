"use client";

import React from "react";
import { useEffect, useState } from "react";


export default function Home() {

  const fields = ["uname", "email","phone", "address","city", "state", "zip", "country", "notes"];
  const [formData, setFormData] = useState<{[key : string] : string}>({});  //object where key and values are string👍
  const [allData, setAllData] = useState<{[key : string] : string}[]>([]);   //object where key and values are string👍
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  type formDataType = {[key : string] : string};        // type specification



  useEffect(() => {
    
      const initialData : formDataType = {};
      fields.forEach(field => initialData[field] = "");
      setFormData(initialData);

      const storedData = JSON.parse(localStorage.getItem("userData") || "[]");  //if "getitem" returns null it falls back to an empty string array👍
      setAllData(storedData);

  }, []);


  // console.log("alldata are :",allData);     //============================================
 


  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name] : e.target.value});
  };


  // to generate unique id for user : 👍
  const generateId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;   //generates id like : 1713483848392-832📌
  }


  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();         // this will prevent the default data submission in browser 📌

    if(editIndex !==  null){

      //editing existing entry : 👍
      const updateData = [...allData];
      updateData[editIndex] = formData;
      setAllData(updateData);
      localStorage.setItem("userData", JSON.stringify(updateData));

      // console.log("edit index is : ",editIndex);      // ===================================

      setEditIndex(null);    //reset edit mode
    }
    else{
      
      // if not editing then show data with new id : 👍
      const newEntry = {id : generateId(), ...formData};      // set auto generated ID
      const updateData : any = [...allData, newEntry];
      setAllData(updateData);
      localStorage.setItem("userData", JSON.stringify(updateData));
    }



    //clear form : 👍
    const clearData : formDataType = {};
    fields.forEach(field => clearData[field] = "");
    setFormData(clearData);

    setShowModal(true);
  };



  const handleEdit = (index : number) => {
    const selectedData = allData[index];
    setFormData(selectedData);
    setEditIndex(index);
    setShowModal(false);
  }


  const handleDelete  = (indexToDelete : number) => {

      if(window.confirm("Are you sure you want to delete this record?")) {
        const updateData = allData.filter((_, index)=> index !== indexToDelete);
        setAllData(updateData);
        localStorage.setItem("userData", JSON.stringify(updateData));
      }
  };


  // lock the background when modal is open : 👍

  useEffect(() => {
    
      if(showModal){
        document.body.style.overflow = "hidden";  //Lock scrolling 🔒
      }
      else{
        document.body.style.overflow = "auto";  //Unlock scrolling 🔓
      }

    // cleanup if component unmounts : 
    return () => {

      document.body.style.overflow = "auto";
      
    }
  }, [showModal]);
  


  return (
    <>
       
          <div className="form flex flex-col items-center justify-center mx-auto w-[350px] h-[450px] mt-[50px] hover:rounded-lg hover:ring-2 hover:ring-purple-500" style={{border:"1px solid black"}}> 

                <div className="mb-[20px]" style={{border:"0px solid black"}}>
                  <h1 className="font-semibold underline underline-offset-4 text-xl"> Enter Your Detailes :  </h1>
                </div>


              <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-3" style={{border:"0px solid black"}}>

                  <div className="flex flex-row"> 
                      <h1 className="w-[110px] font-semibold"> First Name : </h1>  <input type="text" name="uname" required value={formData["uname"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Email : </h1>   <input type="email" name="email" required value={formData["email"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Phone no. : </h1>   <input type="text" maxLength={10} name="phone" required value={formData["phone"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Address : </h1>   <input type="text" name="address" required value={formData["address"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> City : </h1>   <input type="text" name="city" required value={formData["city"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> State : </h1>   <input type="text" name="state" required value={formData["state"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Zip : </h1>   <input type="text" name="zip" required value={formData["zip"] || ""} maxLength={6} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Country : </h1>   <input type="text" name="country" required value={formData["country"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Notes : </h1>   <input type="text" name="notes" required value={formData["notes"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <button type="submit" className="mt-[20px] w-[100px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800"> Submit </button>

              </form>

              {
                showModal && (

                    <div className="fixed modal text-black w-full h-full z-10 flex items-center justify-center bg-black opacity-70 overflow-auto" style={{border:"0px solid skyblue"}}> 

                        <div className="relative z-20 w-fit h-auto flex flex-col items-center justify-center bg-black text-white overflow-auto" style={{border:"2px solid yellow"}}> 

                              <div> <h1 className="font-bold underline underline-offset-4 text-[18px] mb-[20px]"> Submitted Data </h1> </div>


                              <table className="w-[400px] text-center" style={{border:"0px solid blue"}}>
                                  <thead>
                                    <tr>
                                        <th style={{border:"2px solid white"}}> ID </th>

                                        {fields.map((field)=> (
                                              <th key={field} className="text-[15px] capitalize px-4" style={{border:"2px solid white"}}> {field}  </th>
                                          ))
                                        }

                                        <th className="text-[15px] capitalize px-4" key={"action"} style={{border:"2px solid white"}}>
                                          Action
                                        </th>

                                    </tr>
                                  </thead>
                                  
                                  <tbody>
                                          
                                      {
                                        allData.map((data : any, index : any)=> (

                                            <tr className="" key={index}>

                                                <td className="text-[12px] font-semibold" style={{border:"2px solid white"}}> {data.id} </td>

                                                  {fields.filter(field => field !== "id").map((field)=> (

                                                      <td key={field} className="font-semibold w-[40px] py-4 h-[50px] text-[12px]" style={{border:"2px solid white"}}> {data[field]} </td>

                                                  ))}
                                                    <td className="space-y-1 space-x-[2px]" key={"actions"} style={{border:"2px solid white"}}>

                                                    <button className="w-[50px] h-[20px] text-[12px] bg-white text-black font-semibold rounded-lg hover:ring-white hover:ring-2 hover:cursor-pointer active:bg-slate-900" 
                                                          onClick={()=> handleEdit(index)}> Edit </button>

                                                        <button className="w-[50px] h-[20px] text-[12px] bg-white text-black font-semibold rounded-lg hover:text-red-600 hover:ring-white hover:ring-2 hover:cursor-pointer active:bg-slate-900" 
                                                          onClick={()=> handleDelete(index)}> Delete </button>  
                                                    </td>

                                            </tr>
                                        ))      
                                      }
                                  </tbody>
                              </table>

                            <div className="relative mt-[20px] mb-[10px]" style={{border:"0px solid yellow"}}> 
                                  <button className="w-[80px] h-[30px] bg-white text-black font-semibold rounded-lg hover:bg-slate-700 hover:text-white hover:ring-white hover:ring-2 hover:cursor-pointer active:bg-slate-900"
                                  style={{border:"0px solid red"}} onClick={()=>setShowModal(false)}>Close </button>
                            </div>

                        </div>

                    </div>

                )
              }
            
          </div>

          </> 
  );
}







 {/* <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-[350px] h-[500px] mb-[100px] text-[15px] space-y-3" style={{border:"1px solid black"}}>
                {
                  fields.map((field)=> (

                    <div className="flex flex-row">
                      <h1 className="w-[75px]" style={{border:"0px solid black"}}> <b> {field} : </b> </h1>
                    <input className="rounded-md" key={field} required onChange={handleChange} type="text" name={field} placeholder={`Enter your ${field}`} value={formData[field] || ""} style={{border:"1px solid black"}}/>
                    </div>
                  ))
                }

                <button type="submit" className="mt-[20px] w-[100px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800">
                  Submit </button>

              </form> */}