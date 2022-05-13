import { useEffect, useState } from "react"

export default function useFetch(){
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    useEffect(()=> {
        const url = 'https://jsonplaceholder.typicode.com/posts';
        setLoading(true);
        fetch(url)
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            setPosts(data);
        })
        .catch(err => console.log(err));

    }, [])
    return {
        loading,
        posts
    }
}