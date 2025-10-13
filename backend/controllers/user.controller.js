import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import geminiResponse from "../gemini.js"
import moment from "moment"

 export const getCurrentUser=async (req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
return res.status(400).json({message:"user not found"})
        }

   return res.status(200).json(user)     
    } catch (error) {
       return res.status(400).json({message:"get current user error"}) 
    }
}

export const updateAssistant=async (req,res)=>{
   try {
      const {assistantName,imageUrl}=req.body
      let finalAssistantImage;
if(req.file && req.file.buffer){
const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer)
if (cloudinaryResponse && cloudinaryResponse.secure_url){
   finalAssistantImage=cloudinaryResponse.secure_url
} else {
    console.error("Cloudinary upload failed or returned no URL.")
        return res.status(500).json({ message: "Image upload failed." })
}
}else if(imageUrl){
   finalAssistantImage=imageUrl
}

const user=await User.findByIdAndUpdate(req.userId,{
   assistantName,
   assistantImage:finalAssistantImage
},{new:true}).select("-password")

if(!user){
   return res.status(400).json({message:"user not found"})
}

return res.status(200).json(user)

      
   } catch (error) {
       return res.status(400).json({message:"updateAssistantError user error"}) 
   }
}

export const askToAssistant=async (req,res)=>{
   try {
      const {command}=req.body
      const user = await User.findById(req.userId)
      user.history.push(command)
      user.save()
      const userName=user.name
      const assistantName=user.assistantName

      const response = await geminiResponse(command, assistantName, userName)

      const jsonMatched = response.match(/{[\s\S]*}/)
      if (!jsonMatched) {
         return res.status(500).json({ message: "Invalid response from assistant." })
      }

      const gemResult = JSON.parse(jsonMatched[0])
      const type = gemResult.type

      switch (type) {
         case "get-date":
            return res.json({ 
               type,
               userInput: gemResult.userInput,
               response: `Today is ${moment().format("YYYY-MM-DD")}`
            });
         case "get-time":
            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Current time is ${moment().format("HH:mm A")}`
            });
         case "get-day":
            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Today is ${moment().format("dddd")}`
            });
         case "get-month":
            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Current month is ${moment().format("MMMM")}`
            });
            case "google-search":
            case "youtube-search":
            case "youtube-play":
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
            case "general":
               return res.json({
                  type,
                  userInput: gemResult.userInput,
                  response: gemResult.response
               });
         default:
            return res.status(400).json({ message: "I didn't understand that." });
      }

   } catch (error) {
       return res.status(500).json({message:"askToAssistant error"})
   }
}
  