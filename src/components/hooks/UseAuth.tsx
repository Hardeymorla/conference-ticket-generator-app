import { useContext } from "react"
import AuthContext from "../context/UsersProvider"

const useAuth = () => {

    return useContext(AuthContext)
}

export default useAuth