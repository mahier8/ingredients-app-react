import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientList from './IngredientList'; //used below int he IngredientsForm
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

//gets two arguments passed in, the state(can be named anything) and an action
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('We should not get here!');
  }
};

const Ingredients = () => {
  // useReducer takes our reducer function and an optional sect argument(the starting state)
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading, 
    error, 
    data, 
    sendRequest, 
    reqExtra, 
    reqIdentifier, 
    clear
  } = useHttp();

  // const [ userIngredients, setUserIngredients ] = useState([]);
  // he used an empty array in the useState because we will output a list 
  // const [isLoading, setIsLoading ] = useState(false);
  // // the state is orignally false, so that when we want to create an experience it becomes true
  // const [error, setError] = useState();
  // nothing is passed in because we have no error

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra})
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: {id: data.name, ...reqExtra}
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      'https://react-ingredients-app-51469-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json', 
      'POST', 
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
      );
    }, [sendRequest]);
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-ingredients-app-51469-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json', {
    // method: 'POST',
    // body: JSON.stringify(ingredient),
    // headers: { 'Content-Type': 'application/json' }
    // })
    // .then(response => {
    //   dispatchHttp({type: 'RESPONSE'});
    //   return response.json();    
    // })
    // .then(responseData => {
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients, 
    //   //   {id: responseData.name, ...ingredient}
    //   // ]);
    //   disapatch({type: 'ADD',
    //    ingredient: {id: responseData.name, ...ingredient}
    //   });
    // });  
 

  const removeIngredientsHandler = useCallback(
    (ingredientId) => {
    sendRequest(
      `https://react-ingredients-app-51469-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingredientId}.json`, 
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
  }, 
  [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
    <IngredientList 
    ingredients={userIngredients} //this prop comes from the IngredientsList, which was imported 
    onRemoveItem={removeIngredientsHandler}
    />
    );
  }, [userIngredients, removeIngredientsHandler]);

  return (
    <div className="App">
    {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm 
      onAddIngredient={addIngredientHandler}
      loading={isLoading}
      />   

      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
