import React from "react";
import GroceryInput from "./GroceryInput";
import { v4 as uuid } from 'uuid';
import GroceryList from "./GroceryList";

export default function Grocery () {
    const [groceries, setGroceries] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [showGroceries, setShowGroceries] = React.useState(true);
    const [page, setPage] = React.useState(1);
    
    const [lastPage, setLastPage] = React.useState();

    const getData = async () => {
        try {
            setLoading(true);
            let result = await fetch (`http://localhost:7000/task?_page=${page}&_limit=5`);
            let res = await result.json();
            setGroceries(res);
            for(var pair of result.headers.entries()){
                if(pair[0] === 'x-total-count'){
                    setLastPage(Math.ceil(pair[1]/5));
                }
            }
        } catch (error) {
            setError(true);
            setGroceries([]);
        }
        setLoading(false);
            
    }

    const handleAddTask = async (title) => {
        const payLoad = {
            id : uuid(),
            title : title,
            status : false
        }
        try {
            setLoading(true);
            await fetch(`http://localhost:7000/task`,{
                method :"POST",
                body : JSON.stringify(payLoad),
                headers : {"Content-Type" : "application/json"}
            });
            setError(false);
            getData();
        } catch (error) {
            
            setError(true);
        }
        setLoading(false);
    }

    const handleToggle = async (itemId,itemStatus) => {
        try {
            setLoading(true);
            let status = {
                status : (!itemStatus)
            }
            await fetch (`http://localhost:7000/task/${itemId}`,{
                method :"PATCH",
                body : JSON.stringify(status),
                headers : {"Content-Type" : "application/json"}
            });
            getData();
        } catch (error) {
            setError(true);
        }
        setLoading(false);
    } 
    
    const handleDelete = async (itemId) => {
        try {
            setLoading(true);
            await fetch (`http://localhost:7000/task/${itemId}`,{
                method :"DELETE"
            });
            getData();
        } catch (error) {
            setError(true);
        }
        setLoading(false);
    }
    

    React.useEffect(() => {
        getData();
    },[page]);

    return loading ? (
    <h1>Loading...</h1>
    ) : error ? (
        <h1>Error</h1>
    ) : (
        <>
        <h1>GROCERY LIST USING JSON SERVER</h1>
        <GroceryInput handleAddTask={handleAddTask} />
        <GroceryList allGroceries={groceries} handleToggle={handleToggle} handleDelete={handleDelete} showGroceries={showGroceries}/>
        <button onClick={() => {setShowGroceries(!showGroceries)}}>{showGroceries ? "Show Pending groceries" : "Show All groceries"}</button>
        <div>
            <button onClick={()=>{setPage((page-1))}} disabled={page === 1}>PREV</button>
            <button onClick={()=>{setPage((page+1))}} disabled={page === lastPage}>NEXT</button>
        </div>
        </>

        
    )
}