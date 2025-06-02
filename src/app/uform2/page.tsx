  "use client";

  import React from "react";
  import { useEffect, useState } from "react";
  import Image from "next/image";
  import { useRouter } from "next/navigation";



type tableDataType = {
  [key : string] : string;
}



export default function Page() {

  const fields = ["name", "email","phone", "address","city", "state", "zip", "country", "notes"];
  const [formData, setFormData] = useState<{[key : string] : string}>({});  //object where key and values are string👍
  const [tableData, setTableData] = useState<{[key : string] : string}[]>([]);

  const [showModal, setShowModal] = useState(false);
   const [editIndex, setEditIndex] = useState<number | null>(null);
    const [deleteindex, setDeleteIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState<{[key : string] : string}>({});
  const [errorMsg, setErrorMsg] = useState<string>("");

   const [showDelModal, setShowDelModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);

  type formDataType = {[key : string] : string};        // type specification
  
  const [page, setPage] = useState(1);           // for pagination📌
  const rowsPerPage = 5;                        // for pagination

  const [searchQuery, setSearchQuery] = useState("");                   // for filteration📌
  const [filterData, setFilterData] = useState<tableDataType[]>([]);    // for filteration

  const [cityFilter, setCityFilter] = useState("");           // for dropdown filters📌
  const [stateFilter, setStateFilter] = useState("");         // for dropdown filters
  const [countryFilter, setCountryFilter] = useState("");     // for dropdown filters


  const router = useRouter();


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

    // COMBINING ALL SEARCH FILTERS =============================== : 📌📌 

  useEffect(() => {
    
        const lowerQuery = searchQuery.toLowerCase();    // for case-sensitive search

        const filtered : any = tableData.filter((entry)=>{
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



  // initial table data : ==============👍

  useEffect(() => {
    
      // const initialData : formDataType = {};
      const initialData = {} as formDataType;
      fields.forEach(field => {
        initialData[field] = ""
      });
      setFormData(initialData);


      let storedData : formDataType[] = [];
      try{
        storedData = JSON.parse(localStorage.getItem("userData") || "[]");
        setTableData(storedData);
      }
      catch(err) {
          console.error("❌❌ Error parsing userData from localstorage", err);
          setTableData([]);
      }

      // setTableData(storedData);
  }, []);


  // console.log("alldata are :",allData);     //============================================
 
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


  // to generate unique id for user : 👍

  // return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const generateId = () => {
          return (tableData.length + 1).toString();  //will generate id like 1,2,3...📌
  }



  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {

      e.preventDefault();

        // validate fields before submitting too : ======👍

        const newErros : {[key : string] : string} = {};

        fields.forEach(field => {

          const error = validateField(field, formData[field] || "");
          if(error) newErros[field] = error;
        });

        if(Object.keys(newErros).length > 0){
          setErrors(newErros);
          setErrorMsg("Please fix the error before submitting.");
          return;
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

  const handleEdit = (realIndex : number) => {

    // setShowEditModal(true);

        const selectedData = tableData[realIndex];


        // console.log(selectedData);
        // console.log("the index is : ", realIndex);


        // setFormData(selectedData);
        // setEditIndex(realIndex);


        router.push(`/edit/${selectedData.id}`);   //navigate to edit page
        console.log("the id is : ",selectedData.id);

        // setShowModal(true);
  };


  const handleDelete  = (realIndex : number) => {

    setShowDelModal(true);

        const updateData = tableData.filter((_, index)=> index !== realIndex);
        setTableData(updateData);
        localStorage.setItem("userData", JSON.stringify(updateData));
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

                <div className="mt-[20px] w-full flex flex-row items-center justify-center max-w-fit mb-[30px]" style={{border:"0px solid black"}}>

                  <h1 className="font-semibold underline underline-offset-4 text-2xl"> User Details  </h1>
                  </div>


                {/* SEARCH BAR & DROPDOWN FILTERS : =============================== */}

            <div className="flex flex-row items-center w-full max-w-[1080px] justify-center mb-[10px]" style={{border:"0px solid red"}}>

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
                    <button className="w-[100px] h-[30px] bg-black text-white font-semibold text-sm ring-2 ring-black rounded-lg hover:cursor-pointer hover:bg-white hover:text-black hover:font-semibold transition-all delay-150"
                        onClick={()=> setShowModal(true)}> &#x2b; Add Data </button>
                </div>

            </div>



                  {/* CUTSTOM TABLE :  */}
                <div className="datatable flex flex-col w-full max-w-[1100px] p-2 overflow-y-auto items-center justify-center" style={{border:"0px solid blue"}}>

                    <table className="table-auto w-full text-center border-collapse" style={{border:"0px solid red"}}>

                      <thead className="sticky text-[15px] top-0 bg-amber-200" style={{border:"1.5px solid black"}}>

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
                          filterData.length === 0 ? (
                              <tr className="" style={{border:"1.5px solid black"}}>
                                  <td colSpan={11} className="font-semibold text-lg text-center" style={{border:"0px solid red"}}> No data found </td>
                              </tr>
                          ) : (

                            filterData.slice((page - 1) * rowsPerPage, page * rowsPerPage)       // it will show 5-5 data for each page
                            .map((data, index)=> {
                              const realIndex = (page-1) * rowsPerPage + index;

                              
                              return(

                              <tr key={realIndex} style={{border:"1.5px solid black"}}> 
  
                                  <td className="text-[12px] font-semibold" style={{border:"0px solid black"}}> {data.id} </td>
                                  {fields.filter(field => field !== "id").map((field)=> (
  
                                      <td key={field} className="font-semibold px-2 w-[50px] h-[30px] text-[11px]" style={{border:"1.5px solid black"}}> {data[field]} </td>
  
                                  ))} 

                                    <td className="space-x-5 flex items-center justify-center"> 
                                      <button className="h-[25px] w-[25px] bg-white text-black text-[12px] font-semibold rounded-sm hover:cursor-pointer"
                                        onClick={()=> {setShowEditModal(true); setEditIndex(realIndex)}}    style={{border:"0px solid redq"}}> 
                                          <Image src={"/actions/edit.svg"} alt="edit" height={25} width={25} className="hover:scale-125"/>
                                       </button> 

                                      <button className="h-[23px] w-[23px] bg-white text-white text-[12px] font-semibold rounded-sm hover:cursor-pointer"
                                      onClick={()=> {setDeleteIndex(realIndex); setShowDelModal(true);}} style={{border : "0px solid black"}}>
                                         <Image src={"/actions/delete.svg"} alt="delete" height={17} width={17} className="mt-[2px] ml-[2px] hover:scale-125"/> 
                                      </button> 
                                  </td>

                              </tr>
                            )})
                          )
                        }

                      </tbody>          
                    </table> 

                    <div className="mt-[15px] w-full flex items-center justify-center space-x-[441.2px] bg-gray-200" style={{border:"0px solid black"}}>
                          <button className="text-[13px] w-[90px] h-[26px] rounded-md font-semibold bg-black text-white hover:cursor-pointer hover:bg-gray-700" 
                            onClick={()=> setPage((prev)=> Math.max(prev - 1, 1))}> &#x2190; Previous </button>

                          <span className="text-sm font-semibold"> Page {page} </span>

                          <button className="text-[13px] w-[65px] h-[26px] rounded-md font-semibold bg-black text-white hover:cursor-pointer hover:bg-gray-700" 
                            onClick={()=> setPage((prev)=> (prev * rowsPerPage < tableData.length ? prev + 1 : prev))}> Next &#x2192; </button>

                    </div>

                </div>


                    {/* <div className="mt-[30px] w-[250px] h-[40px]" style={{border:"0px solid black"}}>
                        <Link href={"/actions"}>
                        <button className="w-full h-full bg-black text-white text-[20px] rounded-xl cursor-pointer font-semibold hover:bg-white hover:text-black hover:border-2 hover:border-black active:bg-gray-300" 
                        style={{border:"1px solid black"}} > Edit User data </button>
                        </Link>
                    </div> */}


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
                                   onClick={()=> {
                                      if(editIndex !== null){
                                        handleEdit(editIndex);
                                        setShowEditModal(false);
                                      }
                                   }}> Edit </button>
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
                showModal && (

        <div className="w-full h-full fixed flex items-center justify-center z-20 top-0" tabIndex={-1} style={{border:"0px solid green"}}> 

            {/* background overlay */}
          <div className="absolute inset-0 bg-black opacity-40 z-10 transition-opacity duration-300 ease-in-out" tabIndex={-2} style={{animation : "fadeInModal 0.2s forwards"}}>  </div>

                  {/* modal */}
            <div className="relative w-[450px] h-[510px] bg-white text-black shadow-lg z-30 opacity-100" style={{border:"3px solid skyblue"}}> 

              <form onSubmit={handleSubmit} className="relative flex flex-col h-full w-full mx-auto items-center justify-center space-y-[3px]" tabIndex={-10} style={{border:"0px solid blue"}}>

                {/* CLOSE BUTTON :  */}
                <div className="absolute mt-[-460px] ml-[400px] w-[30px] h-[30px]" style={{border:"0px solid red"}}> 

                    <button className="text-center w-full h-full bg-white text-black font-extrabold text-[18px] hover:cursor-pointer hover:scale-125"
                     onClick={()=> setShowModal(false)}> &#x2716; </button>

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
              
            
          </div>

          </> 
  );
}