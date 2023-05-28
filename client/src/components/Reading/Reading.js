import React from 'react';
import "./Reading.css";
import Cards from "../Cards"

const Reading = () => {
  return (
    <div className='slider-parent'>
      <div className="slider">
        <div className='slider-a'>
          <span>Reading Books</span> <button>+</button>
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

export default Reading
