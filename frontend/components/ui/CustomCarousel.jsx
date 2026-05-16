import { Carousel } from "react-bootstrap"

function CustomCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        <img className="d-block w-100" src="https://via.placeholder.com/800x300" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src="https://via.placeholder.com/800x300" />
      </Carousel.Item>
    </Carousel>
  )
}

export default CustomCarousel