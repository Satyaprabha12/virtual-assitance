import Card from "../components/card"
import Ai1 from "../assets/ai1.png"
import Ai2 from "../assets/ai2.png"
import { LuImageUp } from "react-icons/lu"
import { useRef } from "react"
import { useContext } from "react"
import { userDataContext } from "../context/usercontext"
import { useNavigate } from "react-router-dom"
import { IoMdArrowRoundBack } from "react-icons/io"



function Customize() {

    const {serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
    const navigate = useNavigate()
    const inputImage = useRef(null)

    const handleImage = (e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

return (
<div className="w-full h-[100vh] relative bg-gradient-to-b from-[black] to-[#65013b] flex flex-col justify-center items-center">
    <IoMdArrowRoundBack className='absolute h-8 w-8 top-4 left-4 text-white cursor-pointer'
        onClick={()=>{navigate("/")}}/>
<h1 className="text-white text-4xl font-bold gap-4">Choose Your <span className="text-pink-600 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]">Virtual Assistant </span>Image</h1>
<div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap mx-auto pt-20">
<Card image={Ai1} />
<Card image={Ai2} />
<div className={`w-[80px] h-[160px] lg:w-64 lg:h-96 flex items-center justify-center rounded-2xl m-4 hover:scale-105 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-pink-500/50 hover:border-2 hover:border-white transition-shadow ${selectedImage === "input" ? 'border-4 border-white shadow-[0_0_10px_rgba(236,72,153,0.7)]' : 'null'}`}
onClick={()=> {inputImage.current.click() 
    inputImage.current.click()
    setSelectedImage("input")
}}>
    {!frontendImage && <LuImageUp className="text-white w-12 h-12 "/>}
    {frontendImage && <img src={frontendImage} alt="Frontend Preview" className="w-full h-full object-cover" />}
<input type="file" ref={inputImage} accept="image/*" className="hidden" onChange={handleImage}/>
</div>
{selectedImage && <button className="min-w-[110px] h-[50px] mt-8 text-black text-[19px] font-semibold bg-white rounded-full hover:bg-gray-300 hover:scale-105 cursor-pointer"
onClick={() => {navigate("/customize2")}}>Next </button>}

</div>
 
</div>
)
}

export default Customize

