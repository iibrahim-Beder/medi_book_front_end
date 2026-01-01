import Profil from "../2-Experans & Edition/Profil";
import EditableList from "../../shared/EditableList";
import { useState } from "react";
import { id } from "date-fns/locale/id";
const  ProfileAndSpecialties = () => {
  const [specializations, setSpecializations] = useState([
  { id: 1,
    specialty: "Dentist",}

  ]);
  return (


    <>
  

       <Profil/> 
       <EditableList
       title={"Specialties"}
       fieldKey={"specialty"}
       initialItems={specializations}
       onChange={setSpecializations}
       minItems={1}
       
       />
    

    

    </>
  );
};

export default  ProfileAndSpecialties;
