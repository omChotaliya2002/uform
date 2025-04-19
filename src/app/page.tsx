"use client";

import React from "react";
import { useEffect, useState } from "react";


export default function Home() {

  const fields = ["id", "name", "email","phone", "address","city", "state", "zip", "country", "notes"];
  const [formData, setFormData] = useState<{[key : string] : string}>({});  //object where key and values are string👍
  const [allData, setAllData] = useState<{[key : string] : string}[]>([]);   //object where key and values are string👍
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);



  useEffect(() => {
    
      const initialData : any = {};
      fields.forEach(field => initialData[field] = "");
      setFormData(initialData);

      const storedData = JSON.parse(localStorage.getItem("userData") || "[]");  //if "getitem" returns null it falls back to an empty string array👍
      setAllData(storedData);

  }, []);



  const handleChange = (e : any) => {
        setFormData({...formData, [e.target.name] : e.target.value});
  };


  const handleSubmit = (e : any) => {
    e.preventDefault();

    if(editIndex !==  null){

      //editing existing entry : 👍
      const updateData = [...allData];
      updateData[editIndex] = formData;
      setAllData(updateData);
      localStorage.setItem("userData", JSON.stringify(updateData));
      setEditIndex(null);    //reset edit mode
    }
    else{

      const updateData : any = [...allData, formData];
      setAllData(updateData);
      localStorage.setItem("userData", JSON.stringify(allData));
    }

    //clear form : 👍
    const clearData : any = {};
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
       
          <div className="form flex items-center justify-center mt-[50px]"> 

              {/* <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-[400px] h-[300px] space-y-3" style={{border:"1px solid black"}}>

                  <div className="flex flex-row"> 
                      <h1 className="w-[120px]" style={{border:"1px solid black"}}> First Name : </h1>  <input type="text" name="uname" className="" style={{border:"1px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[120px]" style={{border:"1px solid black"}}> Last Name : </h1>   <input type="text" name="lname" className="" style={{border:"1px solid black"}}/>
                  </div>

                  <div className="gender w-[200px]" style={{border:"1px solid black"}}> 
                      
                      <input className="ml-[20px]" type="radio" id="male" name="gender"/> <label> Male </label>
                      <input className="ml-[26px]"  type="radio" id="female" name="gender"/> <label> Female </label>

                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[120px]" style={{border:"1px solid black"}}> Employee ID : </h1>   <input type="text" maxLength={8} name="emp_id" className="" style={{border:"1px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[120px]" style={{border:"1px solid black"}}> Designation : </h1>   <input type="text" name="designation" className="" style={{border:"1px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[120px]" style={{border:"1px solid black"}}> Contact No. : </h1>   <input type="text" name="contact" maxLength={12} className="" style={{border:"1px solid black"}}/>
                  </div>

                  <button type="submit" className="mt-[20px] w-[100px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800"> Submit </button>

              </form> */}

              <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-[350px] h-[500px] mb-[100px] text-[15px] space-y-3" style={{border:"1px solid black"}}>
                {
                  fields.map((field)=> (

                    <div className="flex flex-row">
                      <h1 className="w-[75px]" style={{border:"0px solid black"}}> <b> {field} : </b> </h1>
                    <input className="rounded-md" key={field} onChange={handleChange} type="text" name={field} placeholder={`Enter your ${field}`} value={formData[field] || ""} style={{border:"1px solid black"}}/>
                    </div>
                  ))
                }

                <button type="submit" className="mt-[20px] w-[100px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800">
                  Submit </button>

              </form>

              {
                showModal && (

                    <div className="fixed modal text-black mt-[-100px] w-[900px] h-[300px] z-10 flex items-center justify-center bg-black opacity-70"> 

                        <div className="relative w-[890px] h-[200px] z-20 flex flex-col items-center justify-center bg-black text-white" style={{border:"1px solid white"}}> 

                            <div className="mb-[30px]"> 

                              <h2 className="font-bold underline-offset-4 underline"> Submitted Data  </h2>

                            </div>

                              {/* <div className="absolute">   */}
                              <table className="w-[850px] h-[300px] text-center" style={{border:"0px solid blue"}}>
                                  <thead>
                                    <tr>
                                        {
                                          fields.map((field)=> (
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
                                                  {fields.map((field)=> (

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
                              {/* </div> */}

                              <button className=" mt-[40px] w-[80px] h-[30px] bg-white text-black font-semibold rounded-lg hover:bg-slate-700 hover:text-white hover:ring-white hover:ring-2 hover:cursor-pointer active:bg-slate-900"
                                onClick={()=>setShowModal(false)}>Close </button>

                        </div>

                    </div>

                )
              }
            
          </div>

          </> 
  );
}
