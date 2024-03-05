import { useContext, useEffect, useState } from 'react';
import './styles.css';
import { ThemeContext } from '../../App';

//useState
//useReducer -> complex state

const Search = (props) => {
    console.log(props);
    const {theme} = useContext(ThemeContext)
    const {getDataFromSearchComponent, apiCalledSuccess, setApiCalledSuccess} = props;

    const [inputValue, setInputValue] = useState(''); //initial value

    const handleInputValue = (event)=>{
        const{value} = event.target;
        //set the updated state
        setInputValue(value);
    }

    console.log(inputValue);

    const handleSubmit = (event) =>{
        event.preventDefault();
        getDataFromSearchComponent(inputValue);
        setInputValue(''); //chatgpt
    }

    useEffect(()=>{
        if(apiCalledSuccess){
            setInputValue('');
            setApiCalledSuccess(false);
        }

    },[apiCalledSuccess,setApiCalledSuccess]) //the second dependancy recommended by chatgpt

    return (
        <form onSubmit={handleSubmit} className="Search">
            <input name="search" onChange={handleInputValue} value={inputValue} placeholder="Search Recipes" id="search" />
            <button style={theme ? {backgroundColor : "#12343b"} : {}} type="submit">Search</button>
        </form>
    );
};
export default Search;