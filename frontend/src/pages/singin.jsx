import { useContext, useState } from "react"
import bg from "../assets/robotbg.png"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { userDataContext } from "../context/usercontext"
import axios from "axios"


function SignIn() {

  const [showpassword, setShowPassword ] = useState(false)
  const {serverUrl, userData, setUserData} = useContext(userDataContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`,{email,password},
        {withCredentials:true})
        setUserData(result.data)
        setLoading(false)
        navigate("/")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response.data.message)
    }
  }


  return (
    <div className="w-full h-[100vh] bg-cover flex justify-center items-center"
    style={{backgroundImage:`url(${bg})`}}>

  <form className='flex flex-col items-center justify-center gap-5 w-[90%] h-[600px] max-w-[500px] bg-[#00000059] backdrop-blur shadow-lg shadow-black px-5'
  onSubmit={handleSignIn}>
<h1 className="uppercase mb-10 text-white text-xl font-semibold">Login to <span className="text-pink-400">virtual assistant</span></h1>

<input type="email" placeholder="Enter Your Email" className="w-full h-[60px] outline-none border-1 border-white bg-transparent text-white placeholder-gray-400 px-5 py-3 rounded-full text-[18px]"
required autoComplete="email" onChange={(e)=> setEmail(e.target.value)} value={email}/>

<div className="relative w-full h-[60px] outline-none border-1 border-white bg-transparent text-white rounded-full text-[18px]">
<input type={showpassword?"text":"password"} placeholder="Your password" className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-400 px-5 py-3"
required autoComplete="current-password" onChange={(e)=> setPassword(e.target.value)} value={password}/>

{!showpassword && <IoEye className="absolute top-[18px] right-[20px] h-6 w-6 text-white cursor-pointer"
onClick={()=> setShowPassword(true)}/>}
{showpassword && <IoEyeOff className="absolute top-[18px] right-[20px] h-6 w-6 text-white cursor-pointer"
onClick={()=> setShowPassword(false)}/>}
</div>

{err.length>0 && <p className="text-red-600 text-[17px]">*{err}</p>}

<button className="min-w-[110px] h-[50px] mt-8 text-black text-[19px] font-semibold bg-white rounded-full hover:bg-gray-300 hover:scale-105 cursor-pointer" disabled={loading}>{loading?"Loading...":"Login"}</button>
<p onClick={()=> navigate("/signup")}
 className="text-white text-lg cursor-pointer">Wanna create a new account?<span className="text-pink-500"> Sign Up</span></p>
  </form> 
    </div>
  )
}

export default SignIn
