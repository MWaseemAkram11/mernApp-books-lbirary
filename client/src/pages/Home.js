import React from 'react'
import Completed from '../components/Completed/Completed'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import PlanToRead from '../components/PlantoRead/PlanToRead'
import Reading from '../components/Reading/Reading'

const Home = () => {
  return (
    <div>
      <Header/>
      <PlanToRead/>
      <Reading/>
      <Completed/>
      <Footer/>
    </div>
  )
}

export default Home
