import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadedIngredients,  } = props;
  const [enteredFilter, setenteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = 
        enteredFilter.length === 0 
        ? '' 
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch('https://react-ingredients-app-51469-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json' + query)
    .then(response => response.json())
    .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
      onLoadedIngredients(loadedIngredients);
      });
      }
      }, 500);
      return () => {
        clearTimeout(timer);
      };
  }, [enteredFilter, onLoadedIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          ref={inputRef}
          type="text" 
          value={enteredFilter} 
          onChange={event => setenteredFilter(event.target.value)}           
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

