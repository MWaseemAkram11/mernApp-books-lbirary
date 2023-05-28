import React from 'react';
import "./plantoread.css";
import Cards from "../Cards"

const PlanToRead = () => {
  return (
    <div className='slider-parent'>
      <div className="slider">
        <div className='slider-a'>
          <span>Plan to Read Books</span> <button>+</button>
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

export default PlanToRead
