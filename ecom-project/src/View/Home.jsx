import React from 'react'
import Navbar from '../components/navigation/NavigationBar'
import CustomCarousel from '../components/carousel/CustomCarousel'
import LandingBody from '../components/landingBody/landingBody'
import Footer from '../components/navigation/Footer'
import ViewMoreButton from '../components/Others/ViewMore'

const Home = () => {
  return (
    <>
    <Navbar />
    <CustomCarousel />
    <LandingBody />
    <ViewMoreButton />
    <Footer />
    </>
  )
}

export default Home