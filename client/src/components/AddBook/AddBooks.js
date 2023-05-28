import React from 'react'

const AddBooks = () => {
  return (
    <div className="signup">
        <h2>Add-Books</h2>
        <form>
            <div className='form-childs'>
                <span>Book Name:</span>
                <input
                type="text"
                placeholder="book name"
                />
            </div>
            <div className='form-childs'>
                <span>Author Name:</span>
                <input
                type="input"
                placeholder="author name"
                />
            </div>
            <div className='form-childs'>
                <span>
                    Upload Book Image:
                </span>
                <input type='file' />
            </div>
            <div className='form-childs'>
                <span>Description</span>
                <textarea style={{resize:"none", height:"100px", width:"300px"}} placeholder='description here'/>
            </div>
            <div className='form-childs'>
                <button className='btn' type="button" >
                    Add Book
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddBooks