import { useContext } from 'react'
import { userDataContext } from '../context/usercontext'

function Card({ image }) {

  const {serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)

  return (
    <div className={`w-[80px] h-[160px] lg:w-64 lg:h-96 rounded-2xl m-4 hover:scale-105 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-pink-500/50 hover:border-2 hover:border-white transition-shadow ${selectedImage === image ? 'border-4 border-white shadow-[0_0_10px_rgba(236,72,153,0.7)]' : 'null'}`}
    onClick={()=> {
      {setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }
    }}>
      <img src={image} alt="card" className='w-full h-full object-cover'/>
    </div>
  )
}

export default Card
