"use client";

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Formik, Form, ErrorMessage, Field, yupToFormErrors } from 'formik';
import * as Yup from 'yup';

type tableDataType = {
  [key : string] : string;
}


const page = () => {

     const fields = ["name", "email","phone", "address","city", "state", "zip", "country", "notes"];
      const [formData, setFormData] = useState<{[key : string] : string}>({});  //object where key and values are string👍
      const [tableData, setTableData] = useState<{[key : string] : string}[]>([]);
    
      const [showModal, setShowModal] = useState(false);
      const [editIndex, setEditIndex] = useState<number | null>(null);
      const [deleteindex, setDeleteIndex] = useState<number | null>(null);

      const [showDelModal, setShowDelModal] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
    
      type formDataType = {[key : string] : string};        // type specification

       const [page, setPage] = useState(1);           // for pagination
        const rowsPerPage = 5;                        // for pagination

        const [searchQuery, setSearchQuery] = useState("");                   // for filteration📌
        const [filterData, setFilterData] = useState<tableDataType[]>([]);    // for filteration

        const [cityFilter, setCityFilter] = useState("");           // for dropdown filters📌
        const [stateFilter, setStateFilter] = useState("");         // for dropdown filters
        const [countryFilter, setCountryFilter] = useState("");     // for dropdown filters
    
    
      // initial table data : ==============👍
    
        const initialValues : formDataType = {
               name : "", email : "", phone : "", address : "", city : "", state : "", 
               zip : "" ,country : "", notes : "",
        }


        useEffect(() => {
            
            const lowerQuery = searchQuery.toLowerCase();

            const filtered : any = tableData.filter((entry)=> {

                const matchesSearch = Object.values(entry).some((value)=>
                  value.toString().toLowerCase().includes(lowerQuery)
                );

                  const matchesCity = cityFilter ? entry.city === cityFilter : true;
                  const matchesState = stateFilter ? entry.state === stateFilter : true;
                  const matchesCountry = countryFilter ? entry.country === countryFilter : true;

                  return matchesSearch && matchesCity && matchesState && matchesCountry;
            });

            setFilterData(filtered);

        }, [searchQuery, cityFilter, stateFilter, countryFilter, tableData]);
        


        // Saved table data : ==============👍
        
          useEffect(() => {
            
              const initialData : formDataType = {};
              fields.forEach(field => initialData[field] = "");
              setFormData(initialData);
        
              const storedData : formDataType[] = JSON.parse(localStorage.getItem("userData2") || "[]");  //if "getitem" returns null it falls back to an empty string array👍
              setTableData(storedData);
        
        
          }, []);

        // form validation for each field : 

        const validationSchema = Yup.object ({

            name : Yup.string().min(2,"Name must be atleast 2 characters.").required("User name is required"),
            email : Yup.string().email("Invalid email address").required("Email address is required"),
            phone : Yup.string().min(10, "Phone number must be exactly 10 digits").required("Phone no. is required"),
            address : Yup.string().required("Address is required"),
            city : Yup.string().required("City name is required"),
            state : Yup.string().required("State name is required"),
            zip : Yup.string().min(6, "Zip code must be exaclty 6 digits").required("Zip code is required"),
            country : Yup.string().required("Country name is required"),
            notes : Yup.string().max(50, "Notes cannot exceed 50 characters").required("Notes are required"),
        });



    
      // to generate unique id for user : 👍
    
      // return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
      const generateId = () => {
              return (tableData.length + 1).toString();  //will generate id like 1,2,3...📌
      }
    
    
    
      const handleSubmit = (values : formDataType, {resetForm} : {resetForm  : ()=> void}) => {
        
            let updateData : any[] = [];

            if(formData.id){
                updateData = tableData.map((entry)=> 
                    
                    entry.id === formData.id ? {...entry, ...values} : entry
                );
            }else {
                const newEntry = {id : generateId(), ...values};
                updateData = [...tableData, newEntry];
            }

            setTableData(updateData);
            localStorage.setItem("userData2", JSON.stringify(updateData));

            resetForm();
            setShowModal(false);
    
      };
    
    
    
      const handleEdit = (realIndex : number) => {
    
        setShowEditModal(true);
    
            const selectedData = tableData[realIndex];
            setFormData(selectedData);
            setEditIndex(realIndex);
      };
    
    
      const handleDelete  = (realIndex : number) => {
    
        setShowDelModal(true);
    
            const updateData = tableData.filter((_, index)=> index !== realIndex);
            setTableData(updateData);
            localStorage.setItem("userData2", JSON.stringify(updateData));
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

          <h1 className='mt-[-10px] mb-[10px] font-semibold underline underline-offset-4 text-2xl'> Formik Form </h1>

        <div className="mt-[20px] w-full flex flex-row items-center justify-center space-x-[850px] max-w-[1100px] mb-[30px]" style={{border:"0px solid black"}}>

          <h1 className="font-semibold underline underline-offset-4 text-2xl"> User Details  </h1>

        </div>


             {/* SEARCHBAR AND & DROPDOWN FILTERS : ======================= */}

                <div className="flex flex-row items-center justify-center w-full max-w-[1080px] mb-[10px]"> 

                      <div className="mb-[15px] ml-[-10px] flex items-center justify-start h-[35px] w-[300px] rounded-md" style={{border:"1px solid black"}}>

                        <input type="text" placeholder=" Search by any fields.." value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}
                          className="border border-gray-400 rounded-md w-full h-full focus:ring-[1.5px] focus:ring-blue-400 focus:outline-none"/>

                      </div>


                    <div className="flex flex-wrap items-center justify-center w-[450px] h-[35px] ml-[70px] mb-[15px] space-x-3" 
                        style={{border:"0px solid black"}}>

                        <select onChange={(e)=> setCityFilter(e.target.value)} className="border-[1.5px] border-gray-400 p-1 rounded focus:ring-[1.5px] focus:ring-blue-500 focus:outline-none">

                            <option value=""> All Cities </option>
                              {[...new Set(tableData.map(d => d.city))].map(city => (
                                    <option key={city} value={city}>{city}</option>
                              ))}
                        </select>

                        <select onChange={(e)=> setStateFilter(e.target.value)} className="border-[1.5px] border-gray-400 p-1 rounded focus:ring-[1.5px] focus:ring-blue-500 focus:outline-none">

                              <option value=""> All States </option>
                                {[...new Set(tableData.map(d => d.state))].map(state => (
                                      <option key={state} value={state}>{state}</option>
                                ))}
                        </select>

                        <select onChange={(e)=> setCountryFilter(e.target.value)} className="border-[1.5px] border-gray-400 p-1 rounded focus:ring-[1.5px] focus:ring-blue-500 focus:outline-none">

                              <option value=""> All Countries </option>
                                {[...new Set(tableData.map(d => d.country))].map(country => (
                                      <option key={country} value={country}>{country}</option>
                                ))}
                        </select>

                    </div>

                        <div className="mb-[16px] ml-[70px]" style={{border:"0px solid black"}}>
                              <button className="w-[90px] h-[25px] bg-black text-white font-semibold text-sm hover:rounded-lg hover:cursor-pointer hover:bg-slate-700 transition-all delay-100"
                                  onClick={()=> setShowModal(true)}> &#x2b; Add Data </button>
                        </div>

                    </div>


      {/* CUTSTOM TABLE :  */}
    <div className="datatable flex flex-col w-full max-w-[1100px] p-2 overflow-y-auto items-center justify-center" style={{border:"0px solid blue"}}>

        <table className="table-auto w-full text-center border-collapse" style={{border:"0px solid red"}}>

          <thead className="sticky top-0 bg-amber-200" style={{border:"1.5px solid black"}}>

            <tr className="" style={{border:"0px solid red"}}>
                <th className="border-[1.5px] p-[2px] w-[40px] border-black"> ID </th>
                <th className="border-[1.5px] p-[2px] w-[150px] border-black"> Name </th>
                <th className="border-[1.5px] p-[2px] w-[190px] border-black"> Email </th>
                <th className="border-[1.5px] p-[2px] border-black"> Phone </th>
                <th className="border-[1.5px] p-[2px] w-[200px] border-black"> Address </th>
                <th className="border-[1.5px] p-[2px] border-black"> City </th>
                <th className="border-[1.5px] p-[2px] w-[60px] border-black"> State </th>
                <th className="border-[1.5px] p-[2px] border-black"> Zip </th>
                <th className="border-[1.5px] p-[2px] w-[70px] border-black"> Country </th>
                <th className="border-[1.5px] p-[2px] w-[100px] border-black"> Notes </th>
                <th className="border-[1.5px] p-[2px] w-[110px] border-black"> Actions </th>
            </tr>
          </thead>

          <tbody>

            {
              tableData.length === 0 ? (
                  <tr className="" style={{border:"1.5px solid black"}}>
                      <td colSpan={11} className="font-semibold text-lg text-center" style={{border:"0px solid red"}}> No data found </td>
                  </tr>
              ) : (

                tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((data, index)=> {

                  const realIndex =  (page-1) * rowsPerPage + index;
                  
                  
                  return(

                  <tr key={index} style={{border:"1.5px solid black"}}> 

                      <td className="text-[12px] font-semibold" style={{border:"0px solid black"}}> {data.id} </td>

                      {fields.filter(field => field !== "id").map((field)=> (

                          <td key={field} className="font-semibold px-2 w-[50px] h-[30px] text-[11px]" style={{border:"1.5px solid black"}}> {data[field]} </td>

                      ))} 

                      <td className="space-x-1"> 
                          <button className="h-[20px] w-[35px] bg-black text-white text-[12px] font-semibold rounded-sm hover:bg-slate-600 hover:cursor-pointer"
                          onClick={()=>handleEdit(realIndex)}> Edit </button> 
                          <button className="h-[20px] w-[45px] bg-black text-white text-[12px] font-semibold rounded-sm hover:bg-slate-600 hover:cursor-pointer"
                          onClick={()=> {setDeleteIndex(realIndex); setShowDelModal(true);}}> Delete </button> 
                      </td>

                  </tr>
                )})
              )
            }

          </tbody>          
        </table> 

        <div className="mt-[15px] w-full flex items-center justify-center space-x-[446.2px] bg-gray-200" style={{border:"0px solid black"}}>

                    <button className="text-[13px] w-[80px] h-[26px] rounded-md font-semibold bg-black text-white hover:cursor-pointer hover:bg-gray-700" 
                        onClick={()=> setPage((prev)=> Math.max(prev - 1, 1))}> &#x2190; Previous </button>

                    <span className="text-sm font-semibold"> Page {page} </span>

                    <button className="text-[13px] w-[65px] h-[26px] rounded-md font-semibold bg-black text-white hover:cursor-pointer hover:bg-gray-700" 
                        onClick={()=> setPage((prev)=> (prev * rowsPerPage < tableData.length ? prev + 1 : prev))}> Next &#x2192; </button>

        </div>


</div>


                  <div className="mt-[30px] w-[250px] h-[40px]" style={{border:"0px solid black"}}>
                        <Link href={"/"}>
                            <button className="w-full h-full bg-black text-white text-[20px] rounded-xl cursor-pointer font-semibold hover:bg-white hover:text-black hover:border-2 hover:border-black active:bg-gray-300" 
                            style={{border:"1px solid black"}} > Go to Normal form </button>
                        </Link>
                    </div>




      {
          showEditModal && (
        <>
          <div className="w-full h-full fixed items-center justify-center z-10 top-0" tabIndex={-1}> 

              <div className="absolute inset-0 bg-black opacity-40 z-10" tabIndex={-2}> </div>

                <div className="relative w-[350px] h-[200px] mx-auto flex flex-col items-center justify-center mt-[30px] rounded-xl bg-white text-black z-30 opacity-100"> 
                  <h1 className="absolute mt-[-145px] text-[24px] font-bold text-[#808080] ml-[-260px]" style={{border:"0px solid black"}}> Edit </h1>
                  <h1 className="absolute text-[18px] mt-[-25px] font-semibold" style={{border:"0px solid black"}}> Do you want to edit this data? </h1>

                  <div className="absolute w-full mt-[140px] h-[50px] flex flex-row items-center justify-center space-x-[170px]" style={{border:"0px solid black"}}> 
                      <button className="w-[75px] h-[35px] bg-white text-black ring-1 ring-black rounded-lg font-semibold cursor-pointer hover:bg-black hover:text-white"
                      onClick={()=>setShowEditModal(false)}> Cancel </button>

                      <button className="w-[75px] h-[35px] bg-white ring-1 ring-black text-black font-semibold rounded-lg cursor-pointer hover:bg-[#4286f4] hover:text-white"
                      onClick={()=> {setShowEditModal(false); setShowModal(true);}}> Edit </button>
                    
                  </div>
                </div>
          </div>
      </>  
        )
      }



          {
            showDelModal && (
          <>
            <div className="w-full h-full fixed items-center justify-center z-10 top-0" tabIndex={-1}> 

                <div className="absolute inset-0 bg-black opacity-40 z-10" tabIndex={-2}> </div>

                  <div className="relative w-[350px] h-[200px] mx-auto flex flex-col items-center justify-center mt-[30px] rounded-xl bg-white text-black z-30 opacity-100"> 
                    <h1 className="absolute mt-[-145px] text-[24px] font-bold text-[#808080] ml-[-260px]" style={{border:"0px solid black"}}> Delete </h1>
                    <h1 className="absolute text-[18px] mt-[-25px] font-semibold" style={{border:"0px solid black"}}> Do you want to delete this data? </h1>

                    <div className="absolute w-full mt-[140px] h-[50px] flex flex-row items-center justify-center space-x-[170px]" style={{border:"0px solid black"}}> 
                        <button className="w-[75px] h-[35px] bg-white text-black ring-1 ring-black rounded-lg font-semibold cursor-pointer hover:bg-black hover:text-white"
                        onClick={()=>setShowDelModal(false)}> Cancel </button>

                        <button className="w-[75px] h-[35px] bg-white ring-1 ring-black text-black font-semibold rounded-lg cursor-pointer hover:bg-[#FF0000] hover:text-white"
                        onClick={()=>{
                            if(deleteindex !== null)  { 
                                handleDelete(deleteindex);
                                setShowDelModal(false);
                                setDeleteIndex(null);
                            }
                        }}> Delete </button>
                      
                    </div>
                  </div>
            </div>
        </>  
          )
        }





    {
        showModal &&(

            <div className="w-full h-full fixed flex items-center justify-center z-20 top-0" tabIndex={-1} style={{border:"0px solid green"}}> 

                {/* background overlay */}
                <div className="absolute inset-0 bg-black opacity-40 z-10 transition-opacity duration-300 ease-in-out" tabIndex={-2} style={{animation : "fadeInModal 0.2s forwards"}}>  </div>
    
                      {/* modal */}
                    <div className="relative w-[450px] h-[510px] bg-white text-black shadow-lg z-30 opacity-100" style={{border:"3px solid skyblue"}}> 

                        <Formik initialValues={formData.id ? formData : initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>

                            <Form className="relative flex flex-col h-full w-full mx-auto items-center justify-center space-y-[1px]" tabIndex={-10} style={{border:"0px solid blue"}}>


                              {/* CLOSE BUTTON :  */}
                              <div className="absolute mt-[-460px] ml-[400px] w-[30px] h-[30px]" style={{border:"0px solid red"}}> 

                                  <button className="text-center w-full h-full bg-white text-black font-extrabold text-[18px] hover:cursor-pointer hover:scale-125"
                                  onClick={()=> setShowModal(false)}> &#x2716; </button>

                              </div>


                                <div className='flex flex-row mt-[30px]'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> User Name : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="name" type="text" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='name' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> Email : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="email" type="email" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='email' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> Phone : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="phone" type="text" maxLength="10" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='phone' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> Address : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="address" type="text" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='address' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> City : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="city" type="text" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='city' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> State : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="state" type="text" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='state' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> Zip : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="zip" type="text" maxLength="6" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='zip' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> Country : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="country" type="text" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='country' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <div className='flex flex-row'>
                                    <h1 className="w-[110px] text-[15px] font-semibold"> Notes : </h1>
                                    <div className='flex flex-col'>
                                        <Field name="notes" type="text" className="focus:ring-[1.5px] w-[220px] focus:ring-blue-400 rounded-md focus:outline-none" style={{border:"1px solid black"}}/>
                                        <ErrorMessage name='notes' component="div" className='text-red-500 text-sm'/>
                                    </div>
                                </div>

                                <button type="submit" className="mt-[8px] w-[200px] h-[30px] text-[15px] font-semibold rounded-lg bg-black text-white hover:bg-slate-600 active:bg-slate-800"
                                    > Submit </button>


                            </Form>
                        </Formik>

                    </div>

             </div>

        )
    }

</div>
    
</>
  )
}

export default page;