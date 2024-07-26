import { FcGoogle } from "react-icons/fc";

function LoginByGoogle({text}){
    return(
        <div className="flex items-center justify-center">
          <button className="flex items-center gap-6 w-80 p-2 bg-white text-zinc-800 border border-zinc-300 rounded-full shadow-sm hover:bg-zinc-100">
               <FcGoogle className="text-[1.5rem] mr-4"/>
            <span className="ml-4">{text}</span>
          </button>
        </div>
    )
}
export default LoginByGoogle;