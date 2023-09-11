import React, { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore"
import {notesCollection, db} from "./firebase"
import "./App.css"

export default function App() {

    const [notes, setNotes] = useState(
        // () => JSON.parse(localStorage.getItem("notes"))  || 
        []) 
        // to access the notes we again change it back to js array
     //lazy initialization with arrow function so that it runs only once

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0]?.id) || ""
    )
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    useEffect(() => {

        //LOCAL STORAGE CODE

        //     localStorage.setItem("notes", JSON.stringify(notes)) // to save in localStorage we covert it into string
        // },[notes]

        // FIREBASE CODE
        const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
        const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id:doc.id
       }))
       setNotes(notesArr)
    })
    return unsubscribe
    }, [])

    // function createNewNote() {
    //     const newNote = {
    //         id: nanoid(),
    //         body: "# Type your markdown note's title here"
    //     }
    //     setNotes(prevNotes => [newNote, ...prevNotes])
    //     setCurrentNoteId(newNote.id)
    // }

    async function createNewNote() {
        const newNote = {
            body : "# type your markdown note's title here"
        }
        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id); 
    }
    
    function updateNote(text) {
        setNotes(oldNotes => {
            const newNote = [];
            for(let i =0; i<oldNotes.length; i++) {
                const oldNote = oldNotes[i];
                if(oldNote.id === currentNoteId){
                    newNote.unshift({...oldNote, body:text });
                }
                else{
                    newNote.push(oldNote);
                }
            }
            return newNote;
        })
    }
    
     //LOCAL STORAGE CODE

    // function deleteNote(event, noteId) {
    //     event.stopPropagation();
    //     setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    // }

    //FIREBASE CODE
    async function deleteNote(noteId) {
        const docRef = doc(db, "zenscribe", noteId);
        await deleteDoc(docRef)
    }
   
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote = {deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={currentNote} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>Write down your thoughts</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Scribble here
                </button>
            </div>
            
        }
        </main>
    )
}

