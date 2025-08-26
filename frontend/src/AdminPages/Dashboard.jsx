import { useNavigate } from "react-router-dom"



function Dashboard(){
    const navigate = useNavigate();

    const onClickRouteTo = (routeTo)=>{
        navigate(`/dashboard/${routeTo}`);
    }



    return(
        <ul>
            <div onClick={()=>{onClickRouteTo('users')}}>Users - {}</div>
            <div onClick={()=>{onClickRouteTo('orders')}}>Orders - {}</div>
            <div onClick={()=>{onClickRouteTo('returs')}}> Returns - {}</div>
            <div onClick={()=>{onClickRouteTo('cancellations')}}>Cancellations - {}</div>
            <div onClick={()=>{onClickRouteTo('admins')}}>Admins - {}</div>
            <div onClick={()=>{onClickRouteTo('sales')}}>Sales - {}</div>
            <div onClick={()=>{onClickRouteTo('balance')}}>You balance</div>
            <div onClick={()=>{onClickRouteTo('picksUp')}}>pick Ups</div>
        </ul>
    )
}

export default Dashboard;