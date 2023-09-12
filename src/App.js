import React, { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import {notesCollection, db} from "./firebase"
import "./App.css"

export default function App() {

    const [notes, setNotes] = useState(
        // () => JSON.parse(localStorage.getItem("notes"))  || 
        []) 
        // to access the notes we again change it back to js array
     //lazy initialization with arrow function so that it runs only once

    const [currentNoteId, setCurrentNoteId] = React.useState(
        // (notes[0]?.id) || 
        ""
    )
    const [tempNoteText, setTempNoteText] = useState('')

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    const sortedNotes  = notes.sort((a,b) => b.updateAt - a.updateAt)

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

    useEffect(() => {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    useEffect(() => {
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    // Debouncing logic
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if(tempNoteText !== currentNote.body){
                 updateNote(tempNoteText)
            }
        },500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    //LOCAL STORAGE CODE
    // function createNewNote() {
    //     const newNote = {
    //         id: nanoid(),
    //         body: "# Type your markdown note's title here"
    //     }
    //     setNotes(prevNotes => [newNote, ...prevNotes])
    //     setCurrentNoteId(newNote.id)
    // }

    // FIREBASE CODE
    async function createNewNote() {
        const newNote = {
            body : "# type your markdown note's title here",
            createdAt : new Date(),
            updateAt : new Date()
        }
        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id); 
    }
    
    //LOCAL STORAGE CODE

    // function updateNote(text) {
    //  
    //     setNotes(oldNotes => {
    //         const newNote = [];
    //         for(let i =0; i<oldNotes.length; i++) {
    //             const oldNote = oldNotes[i];
    //             if(oldNote.id === currentNoteId){
    //                 newNote.unshift({...oldNote, body:text });
    //             }
    //             else{
    //                 newNote.push(oldNote);
    //             }
    //         }
    //         return newNote;
    //     })
    // }
    
    // FIRESTORE CODE
    async function updateNote(text){
        const docRef = doc(db, "zenscribe", currentNoteId);
        await setDoc(docRef, {body : text, updateAt: Date.now()}, {merge : true})
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
                    // notes={notes}
                    notes = {sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote = {deleteNote}
                />
                {/* {
                    currentNoteId && 
                    notes.length > 0 && */}
                    <Editor 
                        // currentNote={currentNote} 
                       // updateNote={updateNote}  
                       tempNoteText = {tempNoteText}
                        setTempNoteText = {setTempNoteText}
                    />
                {/* } */}
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

