import { useContext, useEffect, useState,useRef } from 'react'
import { userDataContext } from "../context/usercontext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Lottie from 'lottie-react'
import user from "../assets/userGif.json"
import ai from "../assets/AIGif.json"
import { CiMenuKebab } from "react-icons/ci"
import { RxCross2 } from "react-icons/rx";



function Home() {

  const { userData, serverUrl,setUserData, getgeminiResponse } = useContext(userDataContext)
  const Navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText , setUserText] = useState("")
  const [aiText , setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setham] = useState(false)
  const synth = window.speechSynthesis


  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
         { withCredentials: true })
      setUserData(null)
         Navigate("/signup")
    } catch (error) {
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start()
      setListening(true)
    } catch (error) {
      if (!error.message.includes("recognition has already started")) {
        console.log("Recognition error:", error)
      }
    }
  }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition()
      }, 800)
    }
    synth.cancel()
    synth.speak(utterance)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type === "google-search") {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
    if (type === "youtube-search") {
      const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`
      window.open(youtubeUrl, '_blank')
    }
    if (type === "youtube-play") {
      const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`
      window.open(youtubeUrl, '_blank')
    }
    if (type === "calculator-open") {
      window.open('https://www.online-calculator.com/full-screen-calculator/', '_blank')
    }
    if (type === "instagram-open") {
      window.open('https://www.instagram.com/', '_blank')
    }
    if (type === "facebook-open") {
      window.open('https://www.facebook.com/', '_blank')
    }
    if (type === "weather-show") {
      const city = userInput.split("in").pop().trim() || "your location"
      window.open(`https://www.google.com/search?q=weather+in+${encodeURIComponent(city)}`, '_blank')
    }


  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognitionRef.current = recognition

    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Listening...")
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log("Recognition error:", error)
          }
        }
      }
    }, 1000)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }
    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && !isSpeakingRef.current){
        setTimeout(() => {
          if (isMounted){
            try {
              recognition.start()
              console.log("Recognition restarted")
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log("Recognition error:", error)
              }
            }
          }
        }, 1000)
      }
    }
    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "no-speech" && isMounted && !isSpeakingRef.current) {
        setTimeout(()=>{
          try {
            recognition.start()
            console.log("Recognition restarted after error")
          } catch (error) {
            if (error.name !== "InvalidStateError") {
              console.log("Recognition error:", error)
            }
            
          }
        },1000)
      }
    }
    

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log("user-response: " + transcript)

      recognition.stop()
      isRecognizingRef.current = false
      setListening(false)

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {

        setAiText("")
        setUserText(transcript)

        const data = await getgeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

   
      const greeting = new SpeechSynthesisUtterance(`hello ${userData.name}, How can I help you Today?`)
      greeting.lang = "en-US"
      window.speechSynthesis.speak(greeting)
    

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false

    }
  }, [])


  return (
    <div className="w-full h-[100vh] relative bg-gradient-to-b from-[black] to-[#65013b] flex flex-col justify-center items-center overflow-hidden">
      <CiMenuKebab className='absolute lg:hidden top-5 right-5 text-white text-4xl'
      onClick={() => setham(true)}/>
      <div className={`absolute top-0 w-full h-full bg-black/90 flex flex-col justify-center items-center gap-10
        ${ham?"translate-x-0":"translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden`}>
      <RxCross2 className='absolute top-5 right-5 text-white text-4xl'
      onClick={() => setham(false)}/>
      <button className="min-w-[110px] h-[50px] text-pink-400 text-[19px] font-semibold underline underline-offset-4"
      onClick={handleLogout}>Log Out </button>
      <button className="min-w-[110px] h-[50px] text-pink-400 text-[19px] font-semibold underline underline-offset-4"
      onClick={() => {Navigate("/customize")}}>Customize your Assistant</button>
      <div className='w-full h-[2px] bg-gray-500'>
        <h1 className='text-white font-semibold text-2xl flex justify-center mt-2'>History</h1>
        <div className='w-full h-[300px] overflow-y-auto flex flex-col gap-3 p-3'>
          {userData?.history?.map((his, index)=>(
            <span key={index} className='text-gray-400 text-[18px] truncate'>{his}</span>
          ))}
          </div>

      </div>
      </div>

      <button className="absolute top-5 right-5 min-w-[110px] h-[50px] mt-8 text-pink-400 text-[19px] font-semibold underline underline-offset-4 hover:text-white cursor-pointer hidden lg:block "
      onClick={handleLogout}>Log Out </button>
      <button className="absolute top-20 right-5  min-w-[110px] h-[50px] mt-8 text-pink-400 text-[19px] font-semibold underline underline-offset-4 hover:text-white cursor-pointer px-5 py-2 hidden lg:block"
      onClick={() => {Navigate("/customize")}}>Customize your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-[0_0_20px_rgba(236,72,153,0.7)]'>
        <img src={userData?.assistantImage} alt="ai" className='h-full w-full object-cover'/>
      </div>
      <h1 className='text-white text-4xl font-serif mt-5'>I'm {userData?.assistantName}</h1>
      {!aiText && <Lottie animationData={user} loop={true} className='w-[200px]'/>}
      {aiText && <Lottie animationData={ai} loop={true} className='w-[400px]'/>}
      <h1 className='text-white text-2xl font-mono mt-5'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home

