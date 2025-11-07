
const options = Array.from({ length: 9 }, (_, i) => i + 1);

type PropsType = {
    ticketCount: number,
    setTicketCount: React.Dispatch<React.SetStateAction<number>>
}

const TicketSelection = ({setTicketCount}: PropsType) => {
    
    return (
        <form action="#">
            <label htmlFor="select"> Number of Tickets</label>
            <select name="select" id="select"
                onChange={(event) => {
                    setTicketCount(Number(event.target.value))
                }}>
                {options.map((num) => (
                    <option key={num}
                        value={num}>{num}</option>
                ))};
            </select>
        </form>
    )
} 
export default TicketSelection
