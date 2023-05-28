import React from 'react';
import Cards from "../Cards"

const Completed = () => {
  return (
    <div className='slider-parent'>
      <div className="slider">
        <div className='slider-a'>
          <span>Completed Books</span> <button>+</button>
        </div>
        <div className="slide cards-parent">
          <div className='cards-child'>
            <Cards/>
          </div>
          <div className='cards-child'>
            <Cards/>
          </div>
          <div className='cards-child'>
            <Cards/>
          </div>
          <div className='cards-child'>
            <Cards/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Completed
