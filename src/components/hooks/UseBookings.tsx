import { useContext } from "react";
import BookingsContext from "../context/BookingsProvider";

const useBookings = () => {
    return useContext(BookingsContext)
}

export default useBookings;