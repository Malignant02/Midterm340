import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react';

import './App.css';

 

function App() {

  const [user, setUser] = useState(null);

  const [notes, setNotes] = useState([]);

  const [searchedNotes, setSearchedNotes] = useState(null);

  const firstNameRef = useRef(null);

  const lastNameRef = useRef(null);

  const noteRef = useRef(null);

  const searchRef = useRef(null);

 

  useEffect(() => {

    if (user) {

      fetchNotes(user.id);

    }

  }, [user]);

 

  function createUser() {

    axios

      .post(`http://hyeumine.com/newuser.php`, {

        firstname: firstNameRef.current.value,

        lastname: lastNameRef.current.value,

      }, {

        headers: {

          'Content-Type': 'application/x-www-form-urlencoded',

        },

      })

      .then((response) => {

        if (!(response.status === 200 && response.statusText === 'OK')) {

          throw new Error('Network response was not ok');

        }

 

        const userId = response.data.id;

        setUser({ id: userId });

        firstNameRef.current.value = '';

        lastNameRef.current.value = '';

      })

      .catch((error) => {

        console.error('There was a problem with the fetch operation:', error);

      });

  }

 

  function createNote() {

    if (!user) {

      alert('You must create a user first.');

      return;

    }

 

    const noteText = noteRef.current.value;

    if (!noteText) {

      alert('Please enter a note before creating it.');

      return;

    }

 

    const currentDate = new Date().toLocaleString();

    const noteData = {

      id: user.id,

      note: noteText,

      date: currentDate,

    };

 

    axios

      .post(`http://hyeumine.com/newnote.php`, noteData, {

        headers: {

          'Content-Type': 'application/x-www-form-urlencoded',

        },

      })

      .then((response) => {

        if (!(response.status === 200 && response.statusText === 'OK')) {

          throw new Error('Network response was not ok');

        }

 

        noteRef.current.value = '';

 

        setNotes([noteData, ...notes]);

        // Automatically update the notes when a new note is created

        fetchNotes(user.id);

      })

      .catch((error) => {

        console.error('There was a problem with the fetch operation:', error);

      });

  }

 

  function fetchNotes(userId) {

    axios

      .get(`http://hyeumine.com/mynotes.php`, {

        params: {

          id: userId,

        },

      })

      .then((response) => {

        if (Array.isArray(response.data)) {

          setSearchedNotes(response.data);

        }

      })

      .catch((error) => {

        console.error('There was a problem with the fetch operation:', error);

      });

  }

 

  function handleSearchInputChange() {

    const searchTerm = searchRef.current.value;

    if (searchTerm) {

      const matchingNotes = notes.filter((note) => note.id === parseInt(searchTerm));

      if (matchingNotes.length > 0) {

        setSearchedNotes(matchingNotes);

      } else {

        setSearchedNotes([]);

      }

    } else {

      setSearchedNotes(null);

    }

  }

 

  return (

    <div className='main'>

      <h1>My Notes</h1>

      <div className='center'>

        <div className='newUser'>

          <h3>Create New User</h3>

          <p>Enter first name:</p>

          <input type='text' id='fname' placeholder='Input first name' ref={firstNameRef}></input>

          <p>Enter last name:</p>

          <input type='text' id='lname' placeholder='Input last name' ref={lastNameRef}></input>

          <br />

          <button onClick={() => createUser()}>Create User</button>

        </div>

        <div className='newNote'>

          <h3>Create New Note</h3>

          <p>Enter text:</p>

          <textarea

            placeholder='Input text here'

            ref={noteRef}

          ></textarea>

          <br />

          <button onClick={() => createNote()} disabled={!user}>

            Create Note

          </button>

        </div>

        <div className='notes'>

          <h3>Notes</h3>

          <p>

            {user ? `id: ${user.id}` : 'Not signed in'}

          </p>

          <p>Search id:</p>

          <input

            type='text'

            placeholder='ex. 10142'

            id='search'

            ref={searchRef}

            onInput={handleSearchInputChange}

          ></input>

          <p>Notes: </p>

          <div className='note-container'>

            {searchedNotes !== null ? (

              searchedNotes.length > 0 ? (

                searchedNotes.map((note, index) => (

                  <div key={index} className='note'>

                    <p><strong>{note.date}:</strong></p>

                    <div className='note-content'>{note.note}</div>

                  </div>

                ))

              ) : (

                <p>No notes found</p>

              )

            ) : (

              notes.map((note, index) => (

                <div key={index} className='note'>

                  <p><strong>{note.date}:</strong></p>

                  <div className='note-content'>{note.note}</div>

                </div>

              )).reverse()

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

 

export default App;

 