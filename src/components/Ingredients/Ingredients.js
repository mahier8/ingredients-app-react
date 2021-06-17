import React, {useState, useEffect, useCallback} from 'react';

import IngredientList from './IngredientList'; //used below int he IngredientsForm
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  // he used an empty array in the useState because we will output a list 

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-ingredients-app-51469-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json', {
    method: 'POST',
    body: JSON.stringify(ingredient),
    headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      return response.json();    
    })
    .then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name, ...ingredient}
      ]);
    });  
  };

  const removeIngredientsHandler = (ingredientId) => {
    setUserIngredients(prevIngredients => 
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
      );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />   
      <section>
        <Search 
          onLoadedIngredients={filteredIngredientsHandler}
        />
        <IngredientList 
        ingredients={userIngredients} //this prop comes from the IngredientsList, which was imported 
        onRemoveItem={removeIngredientsHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
