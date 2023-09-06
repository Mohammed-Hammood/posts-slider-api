import useFetch from "./components/get-posts";
import './styles/main.scss';
import './styles/app.scss';
import { useState, useEffect } from "react";
import SVG from "./components/svg";

function App() {
  const {posts, loading} = useFetch();
  const [sortedPosts, setSortedPosts] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);
  const [currentSort, setCurrentSort] = useState('id');
  const [sortById, setSortById] = useState('id');
  const [sortByTitle, setSortByTitle] = useState("t");
  const [sortByDescription, setSortByDescription] = useState("d");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalSortedPosts, setTotalSortedPosts] = useState(0);
  
  useEffect(()=> {
        let postsArr = [];
    
        ((searchValue.length > 0)?searchedPosts:posts).forEach((value, index) => {if(index >= min && index < max){
          
          if(sortById==='-id' && currentSort === 'id'){
            postsArr.push(value);
          }
          else if(sortById==='id' && currentSort === 'id'){
            postsArr.unshift(value);
          }
          else  {
            postsArr.push(value);
          }
        }
        });
        if(searchValue.length > 0){
          const totalPages = Math.ceil(searchedPosts.length/10);
          setTotalPages(totalPages || 1);
          setTotalSortedPosts(searchedPosts.length);
          
          if(currentPage > totalPages){
            setCurrentPage(1);
            setMax(10);
            setMin(0);
          }
        }else {
          setTotalPages(Math.ceil(posts.length/10));
          setTotalSortedPosts(posts.length);
        }
        
        function Sort(direction){
          for(let i =0; i < postsArr.length; i++){
            let index = i;
            for(let j=i; j < postsArr.length; j++){
              
              if(postsArr[j].title < postsArr[index].title && direction === '-t'){
                index = j;
              }
              else if(postsArr[j].title > postsArr[index].title && direction === 't'){
                index = j;
              }
              else if(postsArr[j].body < postsArr[index].body && direction === '-d'){
                index = j;
              }
              else if(postsArr[j].body > postsArr[index].body && direction === 'd'){
                index = j;
              }
            }
            let temp = postsArr[i];
            postsArr[i] = postsArr[index];
            postsArr[index] = temp; 
          }
        }
        if(currentSort==='t'){
          Sort(sortByTitle);
        }
        else if(currentSort==='d'){
          Sort(sortByDescription);
        }
        if(postsArr.length < 10){
          const emptyPost = {
            id:null,
            userId:null,
            title:null,
            body:null
          }
          while(postsArr.length < 10){
            postsArr.push(emptyPost);
          }
        }
        setSortedPosts(postsArr);
  }, [searchedPosts, currentPage, posts, loading, sortById, sortByTitle, sortByDescription, currentSort, max, min, searchValue])
  const pagginationPagesArr = ()=> {
      let pagesArr = [];
      for(let i=0; i < totalPages; i++)
        pagesArr.push(i+1);
    return pagesArr;
  }
  const handlePageSwitch = (direction)=> {
    if(direction==='next'){
      if(currentPage >= totalPages){
        setCurrentPage(totalPages)
      }
      else{
        setMax(max=>max+10);
        setMin(min=>min+10);
        setCurrentPage(currentPage => currentPage + 1);
      }
    }
    else if(direction==='previous'){
      if(currentPage <= 1){
        setCurrentPage(1);
        setMax(10);
        setMin(0);
      }
      else{
        setMax(max=>max-10);
        setMin(min=>min-10);
        setCurrentPage(currentPage => currentPage - 1);
      }
    }else {
      setMax(direction*10);
      setMin(direction*10 - 10);
      setCurrentPage(direction);
    }
  }
  const setSortType = (orderType)=> {
    //t  = title, d = body 'description'
    if(orderType==='id'){
      if(sortById==='id'){
        setSortById('-id');
        setCurrentSort('id');
      }
      else {
        setSortById('id');
        setCurrentSort('id');
      }
    }else if(orderType==='t'){
      if(sortByTitle ==='t'){
        setSortByTitle('-t');
        setCurrentSort('t');
      }
      else {
        setSortByTitle('t');
        setCurrentSort('t');
      }
    }else if(orderType==='d'){
      if(sortByDescription==='d'){
        setSortByDescription('-d');
        setCurrentSort('d');
      }
      else {
        setSortByDescription('d');
        setCurrentSort('d');
      }
    }
  }
 
const handleSearch = (e)=> {
  if(e.target.value.trim().length > 0){
    const q = e.target.value.trim();
    let Arr = [];
      for(let i=0; i< posts.length; i++){
        if(posts[i].title.includes(q) || posts[i].body.includes(q)){
          Arr.push(posts[i]);
        }
      }
      setSearchedPosts(Arr);
  }else {
    setSearchedPosts([]);
  }
}
  return (
    <div className="App">
      {loading?<div className='loader'><span></span></div>:null}
        <div className="container">
          <div className="main-container">
          {(posts.length > 0)?<>
            <div className='search-container'>
              <div className="input-container">
                <input type='search' placeholder="Поиск" name="search" id='input-search' onInput={(e)=> {setSearchValue(e.target.value);handleSearch(e)}} />
              </div>
              <div onClick={(e)=> handleSearch(e)}>
                <SVG name='search' />
              </div>
              <span style={{color:'black'}} className='posts-count'> Posts: {totalSortedPosts}</span>
            </div>
            <div className='posts-container'>
              <div className="header">
                  <div className="id" title="Sort by id">
                    <span className={(currentSort==='id')?"active":null}>ID</span>
                    <button type='button' onClick={()=>setSortType('id')}>
                      {sortById === '-id' ? <SVG name='angle-down' />:<SVG name='angle-up' />}
                    </button>
                  </div>
                  <div className="title" title="Sort by title">
                    <span className={(currentSort==='t')?"active":null}>Заголовок</span>
                    <button type='button' onClick={()=>setSortType('t')}>
                      {sortByTitle ==='-t'?<SVG name='angle-down' />:<SVG name='angle-up' />}
                    </button>
                  </div>
                  <div className="description" title="Sort by description">
                    <span className={(currentSort==='d')?"active":null}>Описание</span>
                    <button type="button" onClick={()=>{setSortType('d')}}>
                      {sortByDescription ==='-d'?<SVG name='angle-down' />:<SVG name='angle-up' />}
                    </button>
                  </div>
              </div>
              <div className="posts">
                    {sortedPosts.map((post, index)=> {return (<div className="post" key={index}>
                      <div className='id'>{post.id}</div>
                      <div className='title'>{post.title}</div>
                      <div className='description'>{post.body }</div>
                    </div>)
                    })}
              </div>
            </div>
            <div className="paggination-container">
                    <div>
                      <button onClick={()=> handlePageSwitch('previous')} type='button'>Назад</button>
                    </div>
                    <div className="pages">
                      {pagginationPagesArr().map((item, index)=> {return (<button onClick={()=> handlePageSwitch(item)} className={(currentPage===item)?"paggination-numbers active":"paggination-numbers"} key={index}> {item} </button>)})}
                    </div>
                    <div>
                      <button type='button' onClick={()=> handlePageSwitch('next')}>Далее</button>
                    </div>
            </div>
          </>:null}
          </div>
      </div>
    </div>
  );
}

export default App;
