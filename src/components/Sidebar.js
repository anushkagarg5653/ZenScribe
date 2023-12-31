import React from "react"

export default function Sidebar(props) {
    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div
                
                className={`title ${
                    note.id === props.currentNote.id ? "selected-note" : ""
                }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet"> {note.body.split("/n")[0]} </h4>
                <button 
                    className="delete-btn"
                    
                    // LOCAL STORAGE CODE
                    // onClick={(event) => props.deleteNote(event, note.id)}

                    // FIREBASE CODE
                    onClick={() => props.deleteNote(note.id)}
                ><i className="gg-trash trash-icon"></i></button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>ZenScribe</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}

//  whatever function we pass to eventHandler will
// revceive the event as its parameter and in order 
// to pass something else along with that we can call it
// as anonymous function