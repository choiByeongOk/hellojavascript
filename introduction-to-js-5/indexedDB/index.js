// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function() {
    // Open our database; it is created if it doesn't already exist
    // (see onupgradeneeded below)
    let request = window.indexedDB.open('notes_db', 1);
};

// onerror handler signifies that the database didn't open successfully
request.onerror = function() {
    console.log('Database failed to open');
};

// onsuccess handler signifies that the database opened successfully
request.onsuccess = function() {
    console.log('Database opened successfully');

    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;

    // Run the displayData() function to display the notes already in the IDB
    displayData();
};

// Setup the database tables if this has not already been done
request.onupgradeneeded = function(e) {
    // Grab a reference to the opened database
    let db = e.target.result;

    // Create an objectStore to store our notes in (basically like a single table)
    // including a auto-incrementing key
    let objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement:true });

    // Define what data items the objectStore will contain
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('body', 'body', { unique: false });

    console.log('Database setup complete');
};

form.onsubmit = addData;

// Define the addData() function
function addData(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let newItem = { title: titleInput.value, body: bodyInput.value };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(['notes_os'], 'readwrite');

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore('notes_os');

    // Make a request to add our newItem object to the object store
    let request = objectStore.add(newItem);
    request.onsuccess = function() {
        // Clear the form, ready for adding the next entry
        titleInput.value = '';
        bodyInput.value = '';
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function() {
        console.log('Transaction completed: database modification finished.');

        // update the display of data to show the newly added item, by running displayData() again.
        displayData();
    };

    transaction.onerror = function() {
        console.log('Transaction not opened due to error');
    };
}

// Define the deleteItem() function
function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying it use it with IDB; IDB key
    // values are type-sensitive.
    let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

    // open a database transaction and delete the task, finding it using the id we retrieved above
    let transaction = db.transaction(['notes_os'], 'readwrite');
    let objectStore = transaction.objectStore('notes_os');
    let request = objectStore.delete(noteId);

    // report that the data item has been deleted
    transaction.oncomplete = function() {
        // delete the parent of the button
        // which is the list item, so it is no longer displayed
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log('Note ' + noteId + ' deleted.');

        // Again, if list item is empty, display a 'No notes stored' message
        if(!list.firstChild) {
            let listItem = document.createElement('li');
            listItem.textContent = 'No notes stored.';
            list.appendChild(listItem);
        }
    };
}