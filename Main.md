<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BBD (Big Bite Dinner) Resturant & Cafe</title>
  <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
  text-transform: none; /* prevent forced all caps */
}

body {
  background-color: #0d0d0d;
  color: #fff;
  line-height: 1.6;
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  word-wrap: break-word;
}
.menu {
  width: 90%;
  max-width: 900px;
  margin: auto;
}


header {
  padding: 40px 20px;
  background: url('https://images.unsplash.com/photo-1606788075761-5bdf23c1d730?auto=format&fit=crop&w=1350&q=80') 
    no-repeat center center/cover;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

header h1 {
  font-size: 3rem;
  letter-spacing: 3px;
  margin: 15px 0;
  font-style: italic;
}

header h2 {
  font-size: 1rem;
  letter-spacing: 2px;
  font-weight: normal;
  font-style: italic;
}

.buttons {
  margin-top: 20px;
}

.btn {
  border: 1px solid white;
  padding: 12px 24px;
  margin: 10px;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: bold;
  font-style: italic;
}

.btn:hover {
  background: white;
  color: black;
}

.scribble-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.scribble-line {
  position: absolute;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 6px 2px white;
  opacity: 0.1;
}

.cards-container {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  position: relative;
  width: 300px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  text-decoration: none;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 35px rgba(0,0,0,0.7);
}

.card:hover img {
  transform: scale(1.1);
}

.card .overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20px;
}

.card .overlay h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.section {
  margin-top: 75px;
}

.MENU {
  margin-top: 70px;
  margin: auto;
}

.social-icons {
  margin-top: 40px;
  display: flex;
  justify-content: center; /* center icons horizontally */
  align-items: center;
  gap: 15px;
  width: 100%;
}

.social-icons a {
  display: inline-block;
  width: 30px;
  height: 30px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.social-icons img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.slogan {
color: white;

.social-icons a:hover img {
  transform: scale(1.30);
}

@media (max-width: 768px) {
  .card {
    width: 90%;
    height: 400px;
  }
}
  </style>
</head>
<body>
   <div class="scribble-layer" id="scribble-layer"></div>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <header>
    <h2>Enjoy An Unforgettable Experience</h2>
    <h1>Fashkala Resturant & Cafe</h1>
    <br>
    <h3 class="slogan">"we dont just sell food... , we sell a delightful experience where every bite meets happiness and every sip meets a smile"<h3>
    <br><br><br><br>
    <div class="cards-container">
      <a href="menu.html" target="_self" class="card">
        <img src="menu.jpg" alt="Menu">
        <div class="overlay">
          <h3>Our Main Menu</h3>
        </div>
      </a>
      <a href="booking.html" target="_self" class="card">
        <img src="book.jpg" alt="Booking">
        <div class="overlay">
          <h3>Book Your Table</h3>
        </div>
      </a>
    </div>
  </header>

  <section class="section">
    <p>
     BBD, founded in 2025, is dedicated to all those who love to wander far and wide. 
      We invite you on a wholesome culinary adventure, where you’ll explore undiscovered gourmet experiences.
    </p>
    <p>
      Thank you for creating lasting memories with us.
    </p>
    <p>
      For more information visit our social media accounts. If you have any problems please contact us through them.
    </p>
  </section>

  <div class="social-icons">
    <a href="https://facebook.com" target="_blank">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook">
    </a>
    <a href="https://instagram.com" target="_blank">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram">
    </a>
    <a href="https://twitter.com" target="_blank">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter">
    </a>
    <a href="https://wa.me/123456789" target="_blank">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp">
    </a>
  </div>  

  <script>
    const scribbleContainer = document.getElementById('scribble-layer');
    const numLines = 120; 

    for (let i = 0; i < numLines; i++) {
      const line = document.createElement('div');
      line.classList.add('scribble-line');

      const width = Math.random() * 150 + 30;
      const height = Math.random() * 3 + 2;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotation = Math.random() * 360;

      line.style.width = `${width}px`;
      line.style.height = `${height}px`;
      line.style.top = `${top}%`;
      line.style.left = `${left}%`;
      line.style.transform = `rotate(${rotation}deg)`;
      line.style.opacity = Math.random() * 0.1 + 0.05;

      scribbleContainer.appendChild(line);
    }
  </script> 
</body>
</html>

