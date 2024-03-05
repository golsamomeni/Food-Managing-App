import './style.css';
import '../../pages/homepage/index.jsx';
import { useContext } from 'react';
import { ThemeContext } from '../../App.js';

const RecipeItem = (props) => {

    const { id, image, title, addToFavorites} = props;
    const {theme} = useContext(ThemeContext)

    //console.log(props, 'recipe-item-props');
    return (
        <div key={id} className="recipe-item">
            <div>
                <img src={image} alt="image of recipe" />
            </div>
            <p style={theme ? {color : "#12343b"} : {}} >{title}</p>

            <button type="button" style={theme ? {backgroundColor : "#12343b"} : {}} onClick={addToFavorites}>Add to favorites</button>

        </div>
    );
};

export default RecipeItem;