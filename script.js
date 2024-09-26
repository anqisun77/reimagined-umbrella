const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

function search(str) {
	let results = [];
	const lowerStr = str.toLowerCase();

	results = fruit.filter(fruitItem => fruitItem.toLowerCase().includes(lowerStr));

	return results;
}

function searchHandler(e) {
	const inputVal = e.target.value;
	const results = search(inputVal);

	if (inputVal.length > 0) {
		showSuggestions(results, inputVal);
	} else {
		suggestions.innerHTML = '';
	}
}

function showSuggestions(results, inputVal) {
	suggestions.innerHTML = '';

	if (results.length === 0) {
		suggestions.innerHTML = '<li>No results found</li>';
        return;
	}

	results.forEach(fruitItem => {
		const suggestionItem = document.createElement('li');
		suggestionItem.innerHTML = fruitItem;
		suggestions.appendChild(suggestionItem);
	});
}

function useSuggestion(e) {
	if (e.target.tagName === 'LI') {
		input.value = e.target.innerText;
		suggestions.innerHTML = '';
	}
}

input.addEventListener('keyup', searchHandler);
suggestions.addEventListener('click', useSuggestion);