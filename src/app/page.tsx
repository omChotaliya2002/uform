"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";


export default function Home() {

  const fields = ["uname", "email","phone", "address","city", "state", "zip", "country", "notes"];
  const [formData, setFormData] = useState<{[key : string] : string}>({});  //object where key and values are string👍
  const [allData, setAllData] = useState<{[key : string] : string}[]>([]);   //object where key and values are string👍

  const [tableData, setTableData] = useState<{[key : string] : string}[]>([]);;

  const [showModal, setShowModal] = useState(false);
  // const [editIndex, setEditIndex] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string>("");

  type formDataType = {[key : string] : string};        // type specification



  // initial table data : ==============👍

  useEffect(() => {
    
      const initialData : formDataType = {};
      fields.forEach(field => initialData[field] = "");
      setFormData(initialData);

      const storedData = JSON.parse(localStorage.getItem("userData") || "[]");  //if "getitem" returns null it falls back to an empty string array👍
      setTableData(storedData);


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

    // old code : ===============================📌
    // e.preventDefault();         // this will prevent the default data submission in browser 📌

    // if(editIndex !==  null){

    //   //editing existing entry : 👍
    //   const updateData = [...allData];
    //   updateData[editIndex] = formData;
    //   setAllData(updateData);
    //   localStorage.setItem("userData", JSON.stringify(updateData));

    //   // console.log("edit index is : ",editIndex);      // ===================================

    //   setEditIndex(null);    //reset edit mode
    // }
    // else{
      
    //   // if not editing then show data with new id : 👍
    //   const newEntry = {id : generateId(), ...formData};      // set auto generated ID
    //   const updateData : any = [...allData, newEntry];
    //   setAllData(updateData);
    //   localStorage.setItem("userData", JSON.stringify(updateData));
    // }



    // //clear form : 👍
    // const clearData : formDataType = {};
    // fields.forEach(field => clearData[field] = "");
    // setFormData(clearData);

    // setShowModal(true);


    // NEW CODE : ======================================== 📌


      e.preventDefault();

      const isEmpty = fields.some(field => !formData[field]?.trim());			// if any field is empty..

      if(isEmpty){
        setErrorMsg("Please fill out all fields before submitting.");
        return;           // stops further execution 👍
      }

      setTableData([...tableData, formData]);

      const newEntry = {id : generateId(), ...formData};      // set auto generated ID
        const updateData : any = [...allData, newEntry];
        setTableData(updateData);
        localStorage.setItem("userData", JSON.stringify(updateData));


       // //clear form : 👍
    const clearData : formDataType = {};
    fields.forEach(field => clearData[field] = "");
    setFormData(clearData);

    setShowModal(false);
    setErrorMsg("");

  };



  // const handleEdit = (index : number) => {
  //   const selectedData = allData[index];
  //   setFormData(selectedData);
  //   setEditIndex(index);
  //   setShowModal(false);
  // }


  // const handleDelete  = (indexToDelete : number) => {

  //     if(window.confirm("Are you sure you want to delete this record?")) {
  //       const updateData = allData.filter((_, index)=> index !== indexToDelete);
  //       setAllData(updateData);
  //       localStorage.setItem("userData", JSON.stringify(updateData));
  //     }
  // };


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
       
          <div className="relative form flex flex-col items-center justify-center h-[530px]" style={{border:"0px solid black"}}> 

                <div className="absolute mt-[-300px]" style={{border:"0px solid black"}}>
                  <h1 className="font-semibold underline underline-offset-4 text-xl"> User Details  </h1>
                </div>


                  {/* CUTSTOM TABLE :  */}
                <div className="absolute w-[800px] datatable flex items-center justify-center" style={{border:"0px solid blue"}}>

                    <table className="w-[800px] text-center" style={{border:"0px solid red"}}>

                      <thead style={{border:"1.5px solid black"}}>

                        <tr style={{border:"0px solid red"}}>
                            <th className="border-[1.5px] px-3 border-black"> ID </th>
                            <th className="border-[1.5px] px-3 border-black"> Uname </th>
                            <th className="border-[1.5px] px-3 border-black"> Email </th>
                            <th className="border-[1.5px] px-3 border-black"> Phone </th>
                            <th className="border-[1.5px] px-3 border-black"> Address </th>
                            <th className="border-[1.5px] px-3 border-black"> City </th>
                            <th className="border-[1.5px] px-3 border-black"> State </th>
                            <th className="border-[1.5px] px-3 border-black"> Zip </th>
                            <th className="border-[1.5px] px-3 border-black"> Country </th>
                            <th className="border-[1.5px] px-3 border-black"> Notes </th>
                        </tr>
                      </thead>

                      <tbody>

                        {
                          tableData.length === 0 ? (
                              <tr className="" style={{border:"1.5px solid black"}}>
                                  <td colSpan={10} className="font-semibold text-xl text-center" style={{border:"0px solid red"}}> No data found </td>
                              </tr>
                          ) : (

                            tableData.map((data, index)=> (

                              <tr key={index} style={{border:"1.5px solid black"}}> 
  
                                  <td className="text-[12px] font-semibold" style={{border:"0px solid black"}}> {data.id} </td>
  
                                  {fields.filter(field => field !== "id").map((field)=> (
  
                                      <td key={field} className="font-semibold px-2 w-[50px] h-[30px] text-[11px]" style={{border:"1.5px solid black"}}> {data[field]} </td>
  
                                  ))}   
                              </tr>
                            ))

                          )
                        }

                      </tbody>          
                    </table> 

                    <div className="absolute flex items-center justify-center">

                      <button className="mt-[200px] w-[100px] h-[40px] bg-black text-white font-semibold text-lg rounded-lg hover:cursor-pointer hover:bg-slate-700"
                        onClick={()=> setShowModal(true)}>  Add data </button>

                    </div>


                </div>
              

              {
                showModal && (

          <div className="w-full h-full flex items-center justify-center bg-black opacity-95" style={{border:"0px solid skyblue"}}> 
            <div className="w-[400px] h-[450px] bg-white text-black"> 

                    <form onSubmit={handleSubmit} className="flex flex-col h-[400px] mt-[30px] items-center justify-center space-y-3" style={{border:"0px solid blue"}}>

                  <div className="flex flex-row"> 
                      <h1 className="w-[110px] font-semibold"> First Name : </h1>  <input type="text" name="uname" value={formData["uname"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Email : </h1>   <input type="email" name="email" value={formData["email"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Phone no. : </h1>   <input type="text" maxLength={10} name="phone" value={formData["phone"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Address : </h1>   <input type="text" name="address" value={formData["address"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> City : </h1>   <input type="text" name="city" value={formData["city"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> State : </h1>   <input type="text" name="state" value={formData["state"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Zip : </h1>   <input type="text" name="zip" value={formData["zip"] || ""} maxLength={6} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Country : </h1>   <input type="text" name="country" value={formData["country"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>

                  <div className="flex flex-row">
                      <h1 className="w-[110px] font-semibold"> Notes : </h1>   <input type="text" name="notes" value={formData["notes"] || ""} onChange={handleChange} className="focus:ring-[1.5px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"0.5px solid black"}}/>
                  </div>


                  {
                    errorMsg && (
                      <div className="text-red-500 text-md font-semibold">  
                          {errorMsg}
                      </div>
                    )
                  }


                  <button type="submit" className="mt-[10px] w-[100px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800"
                  > Submit </button>

              </form>

          </div>
      </div>

                )
              }
            
          </div>

          </> 
  );
}