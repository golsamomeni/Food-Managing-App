
import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import Search from "../../components/search";
import './styles.css';
import RecipeItem from "../../components/recipe-item";
import FavoriteItem from "../../components/favorite-item";
import ThemeButton from "../../components/theme-button";
import { ThemeContext } from "../../App";


const dummydata = 'dummydata';

const reducer = (state, action) => {
    switch (action.type) {
        case "filterFavorites":
            console.log(action);
            return {
                ...state,
                filteredValue: action.value,
            };

        default:
            return state;
    }
}

const initialState = {
    filteredValue: ''
}

const Homepage = () => {
    //loading state 
    const [loadingState, setLoadingState] = useState(false);
    //save results that we receive from api
    const [recipes, setRecipes] = useState([]);

    //favorites data state

    const [favorites, setFavorites] = useState([]);

    //state for api is successful or not

    const [apiCalledSucess, setApiCalledSuccess] = useState(false);

    //use reducer functionality 

    const [filteredState, dispatch] = useReducer(reducer, initialState);

    const { theme } = useContext(ThemeContext)


    const getDataFromSearchComponent = (getData) => {
        //keep the loading state as true before we are calling the api
        setLoadingState(true);
        //console.log(getData, 'getdata');

        //calling the api
        async function getRecipes() {
            const apiResponse = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=5645eb9dedc24a999ef5c90f0bff4e81&query=${getData}`
            );
            const result = await apiResponse.json();
            const { results } = result;

            if (results && results.length > 0) {
                //set loading state as false again
                //set the recipes state 
                setLoadingState(false);
                setRecipes(results);
                setApiCalledSuccess(true);
            }

            //console.log(result);
        }

        getRecipes();
    };

    //console.log(loadingState, recipes, 'loadingState', 'recipes');

    const addToFavorites = useCallback((getCurrentRecipeItem) => {
        let cpyFavorites = [...favorites];

        const index = cpyFavorites.findIndex(item => item.id === getCurrentRecipeItem.id);
        //console.log(index);
        if (index === -1) {
            cpyFavorites.push(getCurrentRecipeItem);
            setFavorites(cpyFavorites);
            //save the favorites in local storage
            localStorage.setItem('favorites', JSON.stringify(cpyFavorites));
            window.scrollTo({top : '0', behavior : 'smooth'})
        } else {
            alert('Item is already present in favorites');
        }
    }, [favorites])



    //console.log(favorites);

    const removeFromFavorites = (getCurrentId) => {
        let cpyFavorites = [...favorites];
        cpyFavorites = cpyFavorites.filter(item => item.id !== getCurrentId);

        setFavorites(cpyFavorites);
        localStorage.setItem('favorites', JSON.stringify(cpyFavorites));

    }
    useEffect(() => {
        const extractFavoritesFromLocalStorageOnPageLoad = JSON.parse(localStorage.getItem('favorites'));
        setFavorites(extractFavoritesFromLocalStorageOnPageLoad);

    }, [])

    console.log(filteredState, 'filteredState');

    //filter the favorites

    const filteredFavoritesItems = favorites.filter(item =>
        item.title.toLowerCase().includes(filteredState.filteredValue)
    );

    const renderRecipes = useCallback(() => {

        if (recipes && recipes.length > 0) {
            return (
                recipes.map((item) => (
                    < RecipeItem
                        addToFavorites={() => addToFavorites(item)}
                        id={item.id}
                        image={item.image}
                        title={item.title}
                    />
                ))
            )
        }
    }, [recipes, addToFavorites]);

    return (
        <div className="homepage">
            <Search
                getDataFromSearchComponent={getDataFromSearchComponent}
                dummydatacopy={dummydata}
                apiCalledSucess={apiCalledSucess}
                setApiCalledSuccess={setApiCalledSuccess}
            />

            <div className="favorites-wrapper">
                <h1 style={theme ? { color: "#12343b" } : {}} className="favorites-title">Favorites</h1>

                <div className="search-favorites">
                    <input
                        onChange={(event) =>
                            dispatch({ type: 'filterFavorites', value: event.target.value })
                        }
                        value={filteredState.filteredValue}

                        name="searchfavorites"
                        placeholder="Search Favorites" />
                </div>




                <div className="favorites">
                    {
                        !filteredFavoritesItems.length && <div style={{display : 'flex', width : "100%", justifyContent : 'center'}} className="no-items">No favorites are found</div>
                    }
                    {
                        filteredFavoritesItems && filteredFavoritesItems.length > 0 ?
                            filteredFavoritesItems.map(item => (
                                <FavoriteItem
                                    removeFromFavorites={() => removeFromFavorites(item.id)}
                                    id={item.id}
                                    image={item.image}
                                    title={item.title}
                                />
                            ))
                            : null}
                </div>
            </div>



            {loadingState && (
                <div className="loading">Loading Recipes! Please wait.</div>
            )}

            <div className="items">
                {/*renderRecipes()*/}

                {
                    useMemo(
                        () =>
                            !loadingState && recipes && recipes.length > 0 ?
                                recipes.map((item) => (
                                    < RecipeItem
                                        addToFavorites={() => addToFavorites(item)}
                                        id={item.id}
                                        image={item.image}
                                        title={item.title}
                                    />
                                ))
                                : null,
                        [loadingState, recipes, addToFavorites])
                }


                {/*recipes && recipes.length > 0
                    ? recipes.map((item) => (
                        < RecipeItem
                            addToFavorites={() => addToFavorites(item)}
                            id={item.id}
                            image={item.image}
                            title={item.title}
                        />
                    ))
                    : null*/}
            </div>

            {
                !loadingState && !recipes.length && <div className="no-items">No recipes are found</div>
            }
        </div>
    );
};

export default Homepage;
