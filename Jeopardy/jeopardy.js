// Constants
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

let categories = [];

/** Get NUM_CATEGORIES random category IDs from API.
 *
 * Returns array of category IDs.
 */
async function getCategoryIds() {
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
    // Select 6 random category IDs
    const categoryIds = _.sampleSize(response.data.map(cat => cat.id), 6);
    return categoryIds;
}
/** Get data for a category:
 *
 * Returns { title: "Math", clues: clue-array }
 *
 * Clue array is:
 *   [
 *      {question: "Question", answer: "Answer", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
    const clues = _.sampleSize(response.data.clues, NUM_QUESTIONS_PER_CAT);
    return {
        title: response.data.title,
        clues: clues.map(clue => ({
            question: clue.question,
            answer: clue.answer,
            showing: null,
        })),
    };
}

/** Fill the HTML table#jeopardy with categories & clues.
 *
 * - The <thead> should have one <tr> with a <th> for each category
 * - The <tbody> should have NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a <td> for each category
 *   (initially, all <td>s should have "?")
 */
async function fillTable() {
    const $thead = $('#jeopardy thead');
    const $tbody = $('#jeopardy tbody');
    
    $thead.empty();
    $tbody.empty();

    // Add category titles to the header row
    const $headerRow = $('<tr>');
    for (let category of categories) {
        $headerRow.append(`<th>${category.title}</th>`);
    }
    $thead.append($headerRow);

    // Add rows of clues to the body
    for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
        const $row = $('<tr>');
        for (let j = 0; j < NUM_CATEGORIES; j++) {
            const $cell = $('<td class="clue-cell">?</td>');
            $cell.data('clue', [j, i]); // Store category and clue indices
            $row.append($cell);
        }
        $tbody.append($row);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 */
function handleClick(evt) {
    const $cell = $(evt.target);
    const [catIdx, clueIdx] = $cell.data('clue');
    const clue = categories[catIdx].clues[clueIdx];

    if (clue.showing === null) {
        // Show the question
        $cell.text(clue.question);
        clue.showing = 'question';
    } else if (clue.showing === 'question') {
        // Show the answer
        $cell.text(clue.answer);
        clue.showing = 'answer';
    }
}

/** Show the loading spinner and disable the start button. */
function showLoadingView() {
    $('#loading').show();
    $('#start-button').prop('disabled', true);
}

/** Hide the loading spinner and enable the start button. */
function hideLoadingView() {
    $('#loading').hide();
    $('#start-button').prop('disabled', false);
}

/** Start game:
 *
 * - Get random category IDs
 * - Get data for each category
 * - Create HTML table
 */
async function setupAndStart() {
    showLoadingView();

    // Get category IDs and data for each category
    const catIds = await getCategoryIds();
    categories = [];
    for (let catId of catIds) {
        const category = await getCategory(catId);
        categories.push(category);
    }

    // Fill the game table
    await fillTable();

    hideLoadingView();
}

/** On page load:
 * - Add click handler for the start button
 * - Add click handler for clue cells
 */
$(async function () {
    // Start or restart the game when clicking the button
    $('#start-button').on('click', setupAndStart);

    // Handle clicking on clue cells
    $('#jeopardy').on('click', '.clue-cell', handleClick);
});
