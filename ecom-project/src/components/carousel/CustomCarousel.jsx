import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
// Import the images (keeping these as they were the last accepted change)
import carouselclothes from '../../assets/images/carouselImages/carouselclothes.jpg'
import carouselelec from '../../assets/images/carouselImages/carouselelec.jpg';
import carouselfoot from '../../assets/images/carouselImages/carouselfoot.jpg';
import './CustomCarousel.css';


const CustomCarousel = () => { // Removed `className` prop
  return (
    <Carousel> {/* Removed `className={carouselClassName}` */}
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-fixed-height-img"
          src={carouselclothes}
          alt="First slide - Clothes"
        />
        <Carousel.Caption>
          <h5>Fashion Forward</h5>
          <p>Discover the latest trends in clothing.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carousel-fixed-height-img"
          src={carouselelec}
          alt="Second slide - Electronics"
        />
        <Carousel.Caption>
          <h5>Next-Gen Electronics</h5>
          <p>Explore cutting-edge gadgets and devices.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carousel-fixed-height-img"
          src={carouselfoot}
          alt="Third slide - Footwear"
        />
        <Carousel.Caption>
          <h5>Step in Style</h5>
          <p>Find your perfect pair of footwear.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CustomCarousel;