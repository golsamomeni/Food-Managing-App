import './style.css';
import '../../pages/homepage/index.jsx';
import { useContext } from 'react';
import { ThemeContext } from '../../App.js';

const FavoriteItem = (props) => {

    const { id, image, removeFromFavorites, title} = props;
    const {theme} = useContext(ThemeContext);

    //console.log(props, 'recipe-item-props');
    return (
        <div key={id} className="favorite-item">
            <div>
                <img src={image} alt="image of recipe" />
            </div>
            <p style={theme ? {color : "#12343b"} : {}}>{title}</p>

            <button style={theme ? {backgroundColor : "#12343b"} : {}} type="button" onClick={removeFromFavorites}>Remove from favorites</button>

        </div>
    );
};

export default FavoriteItem;