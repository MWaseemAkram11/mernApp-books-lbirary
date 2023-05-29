import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./cards.css";

function BasicExample() {
  return (
    <div>
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
          </Card.Text>
          <div class="dropdown">
            <button class="dropbtn">Click to Update</button>
            <div class="dropdown-content">
              <a href="#">add to complete</a>
              <a href="#">add to plan toRead</a>
              <a href="#">add to reading</a>
            </div>
          </div>
          {/* <Button variant="primary">Go somewhere</Button> */}
        </Card.Body>
        </Card>
    </div>
  );
}

export default BasicExample;