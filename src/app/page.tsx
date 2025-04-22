"use client";

import { table } from "node:console";
import React from "react";
import { useEffect, useState } from "react";


export default function Home() {

  const fields = ["uname", "email","phone", "address","city", "state", "zip", "country", "notes"];
  const [formData, setFormData] = useState<{[key : string] : string}>({});  //object where key and values are string👍
  const [tableData, setTableData] = useState<{[key : string] : string}[]>([]);;

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string>("");

  type formDataType = {[key : string] : string};        // type specification



  // initial table data : ==============👍

  useEffect(() => {
    
      const initialData : formDataType = {};
      fields.forEach(field => initialData[field] = "");
      setFormData(initialData);

      const storedData : formDataType[] = JSON.parse(localStorage.getItem("userData") || "[]");  //if "getitem" returns null it falls back to an empty string array👍
      setTableData(storedData);


  }, []);


  // console.log("alldata are :",allData);     //============================================
 


  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name] : e.target.value});
  };


  // to generate unique id for user : 👍

  // return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const generateId = () => {
          return (tableData.length + 1).toString();  //will generate id like 1,2,3...📌
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


    // NEW CODE : ======================================== 📌


      e.preventDefault();

      const isEmpty = fields.some(field => !formData[field]?.trim());			// if any field is empty..

      if(isEmpty){
        setErrorMsg("Please fill out all fields before submitting.");
        return;           // stops further execution 👍
      }

      let updateData : any[] = [];

      if(formData.id){
        updateData = tableData.map((entry)=> 
        
          entry.id === formData.id ? {...entry, ...formData} : entry
        );
      }
      else{
              //generating new entry : 
            const newEntry = {id : generateId(), ...formData};
            updateData = [...tableData, newEntry];
      }

        setTableData(updateData);
        localStorage.setItem("userData", JSON.stringify(updateData));


       // //clear form : 👍
    const clearData : formDataType = {};
    fields.forEach(field => clearData[field] = "");
    setFormData(clearData);

    setShowModal(false);
    setErrorMsg("");

  };



  const handleEdit = (index : number) => {

    if(window.confirm("do you want to edit this record?")){
        const selectedData = tableData[index];
        setFormData(selectedData);
        setEditIndex(index);
        setShowModal(true);
    }
  }


  const handleDelete  = (indexToDelete : number) => {

      if(window.confirm("Are you sure you want to delete this record?")) {
        const updateData = tableData.filter((_, index)=> index !== indexToDelete);
        setTableData(updateData);
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
       
          <div className="form flex flex-col items-center justify-center py-8 px-4" style={{border:"0px solid black"}}> 

                <div className="mt-[50px] w-full flex flex-row items-center justify-center space-x-[670px] max-w-[900px] mb-4" style={{border:"0px solid black"}}>

                  <h1 className="font-semibold underline underline-offset-4 text-2xl"> User Details  </h1>

                  <button className="w-[90px] h-[25px] bg-black text-white font-semibold text-sm hover:rounded-lg hover:cursor-pointer hover:bg-slate-700 transition-all delay-100"
                    onClick={()=> setShowModal(true)}> &#x2b; Add Data </button>

                </div>


                  {/* CUTSTOM TABLE :  */}
                <div className="datatable w-full max-w-[920px] p-2 overflow-y-auto flex items-center justify-center" style={{border:"0px solid blue"}}>

                    <table className="table-auto w-full text-center border-collapse" style={{border:"0px solid red"}}>

                      <thead className="sticky top-0 bg-amber-200" style={{border:"1.5px solid black"}}>

                        <tr className="" style={{border:"0px solid red"}}>
                            <th className="border-[1.5px] p-3 border-black"> ID </th>
                            <th className="border-[1.5px] p-3 border-black"> Uname </th>
                            <th className="border-[1.5px] p-3 border-black"> Email </th>
                            <th className="border-[1.5px] p-3 border-black"> Phone </th>
                            <th className="border-[1.5px] p-3 border-black"> Address </th>
                            <th className="border-[1.5px] p-3 border-black"> City </th>
                            <th className="border-[1.5px] p-3 border-black"> State </th>
                            <th className="border-[1.5px] p-3 border-black"> Zip </th>
                            <th className="border-[1.5px] p-3 border-black"> Country </th>
                            <th className="border-[1.5px] p-3 border-black"> Notes </th>
                            <th className="border-[1.5px] p-3 border-black"> Actions </th>
                        </tr>
                      </thead>

                      <tbody>

                        {
                          tableData.length === 0 ? (
                              <tr className="" style={{border:"1.5px solid black"}}>
                                  <td colSpan={11} className="font-semibold text-lg text-center" style={{border:"0px solid red"}}> No data found </td>
                              </tr>
                          ) : (

                            tableData.map((data, index)=> (

                              <tr key={index} style={{border:"1.5px solid black"}}> 
  
                                  <td className="text-[12px] font-semibold" style={{border:"0px solid black"}}> {data.id} </td>
  
                                  {fields.filter(field => field !== "id").map((field)=> (
  
                                      <td key={field} className="font-semibold px-2 w-[50px] h-[30px] text-[11px]" style={{border:"1.5px solid black"}}> {data[field]} </td>
  
                                  ))} 

                                  <td className="space-x-1"> 
                                      <button className="h-[20px] w-[35px] bg-black text-white text-[12px] font-semibold rounded-sm hover:bg-slate-600 hover:cursor-pointer"
                                      onClick={()=>handleEdit(index)}> Edit </button> 
                                      <button className="h-[20px] w-[45px] bg-black text-white text-[12px] font-semibold rounded-sm hover:bg-slate-600 hover:cursor-pointer"
                                      onClick={()=>handleDelete(index)}> Delete </button> 
                                  </td>

                              </tr>
                            ))

                          )
                        }

                      </tbody>          
                    </table> 


                </div>
              

              {
                showModal && (

        <div className="w-full h-full fixed flex items-center justify-center z-20 top-0" tabIndex={-1} style={{border:"0px solid green"}}> 

            {/* background overlay */}
          <div className="absolute inset-0 bg-black opacity-40 z-10 transition-opacity duration-300 ease-in-out" tabIndex={-2} style={{animation : "fadeInModal 0.2s forwards"}}>  </div>

                  {/* modal */}
            <div className="relative w-[410px] h-[490px] bg-white text-black shadow-lg z-30 opacity-100" style={{border:"3px solid skyblue"}}> 

              <form onSubmit={handleSubmit} className="relative flex flex-col h-full w-full mx-auto items-center justify-center space-y-4" tabIndex={-10} style={{border:"0px solid blue"}}>

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