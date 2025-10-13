import { useState, useContext, useEffect } from 'react'
import { userDataContext } from "../context/usercontext"
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'


function Customize2() {

    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")

    const [imageFile, setImageFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(selectedImage)

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        setAssistantName(userData?.assistantName || "")
         if (userData?.assistantImage) {
            setPreviewUrl(userData.assistantImage);
        }
    }, [userData])


    const handleUpdateAssistant = async() =>{
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if(imageFile){
                formData.append("AssistantImage", imageFile, imageFile.name)
            }else if  (!imageFile && selectedImage) {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update-assistant`, formData,
                {withCredentials:true,
                    headers: { 'Content-Type': 'multipart/form-data'
        }
                })

                console.log(result.data)
                setUserData(result.data)
                navigate("/")

        } catch (error) {
            console.log("update assistant error", error)
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <div className="w-full h-[100vh] relative bg-gradient-to-b from-[black] to-[#65013b] flex flex-col justify-center items-center">
        <IoMdArrowRoundBack className='absolute h-8 w-8 top-4 left-4 text-white cursor-pointer'
        onClick={()=>{navigate(-1)}}/>
      <h1 className="text-white font-bold sm:text-3xl lg:text-4xl text-center px-4">Enter Your
         <span className="text-pink-600 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]"> Virtual Assistant's</span> Name</h1>
         <input type="text" placeholder="Ex. Jarvis" className="w-full max-w-[500px] h-[60px] mt-10 outline-none border-1 border-white bg-transparent text-white placeholder-gray-400 px-5 py-3 rounded-full text-[18px]"required
         onChange={(e) => setAssistantName(e.target.value)} value={assistantName}/>
         {assistantName && <button className="min-w-[280px] h-[50px] mt-8 text-black text-[19px] font-semibold bg-white rounded-full hover:bg-gray-300 hover:scale-105 cursor-pointer"
         disabled={loading} onClick={()=>{
        handleUpdateAssistant()
    }
         }>{!loading ? "Finally Create Your Assistant" : "Creating..."}</button>}
         
    </div>
  )
}

export default Customize2
