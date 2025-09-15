<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Elite Trio Cafe</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #111;
      color: white;
      padding: 60px 20px 80px;
      /* Background Effect */
      background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0), radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0);
      background-size: 40px 40px;
      background-position: 0 0, 20px 20px;
      /* Subtle dark overlay for better contrast */
      background-color: #111;
    }
        /* Scribble Background Layer */
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
      opacity: 0.1; /* More visible */
    }
    .menu-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    h1 {
      font-size: 2.8em;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .hours {
      color: #ccc;
      font-size: 1.1em;
      margin-bottom: 50px;
    }

    /* Tabs */
    .tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 50px;
      gap: 20px;
    }

    .tabs label {
      padding: 12px 30px;
      border: 2px solid #333;
      border-radius: 30px;
      cursor: pointer;
      color: white;
      background-color: transparent;
      transition: background 0.3s, transform 0.3s ease;
      font-size: 1em;
    }

    .tabs label:hover {
      background-color: #222;
      transform: scale(1.05);
    }

    input[type="radio"] {
      display: none;
    }

    input[type="radio"]:checked + label {
      background-color: #e60000;
      border-color: #e60000;
    }

    .tab-content {
      display: none;
    }

    #food-tab:checked ~ .content-wrapper #food-content,
    #drinks-tab:checked ~ .content-wrapper #drinks-content {
      display: block;
    }

    /* Menu Grid: exactly 4 columns in one row */
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      margin-bottom: 60px;
    }

    .menu-column {
      background-color: #1a1a1a;
      padding: 25px 20px;
      border-radius: 12px;
      text-align: left;
    }

    .menu-column h3 {
      border-bottom: 1px solid #333;
      padding-bottom: 12px;
      margin-bottom: 20px;
      font-size: 1.25em;
      text-align: center;
    }

    .menu-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 1em;
      padding: 10px 12px;
      border-radius: 6px;
      transition: background-color 0.3s ease, transform 0.3s ease;
      cursor: pointer;
    }

    .menu-item:hover {
      background-color: #222;
      transform: scale(1.03);
    }

    .menu-item span {
      color: #ccc;
    }

    footer {
      text-align: center;
      font-size: 0.95em;
      color: #666;
      border-top: 1px solid #222;
      padding-top: 25px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <!-- Background Layer -->
   <div class="scribble-layer" id="scribble-layer"> 
   </div>

  <div class="menu-wrapper">
    <h1>Elite Trio Cafe</h1>
    <p class="hours">Open Daily 10 AM – 10 PM</p>

    <input type="radio" name="tab" id="food-tab" checked>
    <label for="food-tab"></label>

    <input type="radio" name="tab" id="drinks-tab">
    <label for="drinks-tab"></label>

    <div class="tabs">
      <label for="food-tab">Food</label>
      <label for="drinks-tab">Drinks</label>
    </div>

    <div class="content-wrapper">

      <div class="tab-content" id="food-content">
        <div class="menu-grid">

          <div class="menu-column">
            <h3>Burgers</h3>
            <div class="menu-item"><div>Classic Cheeseburger</div><span>$5.99</span></div>
            <div class="menu-item"><div>Chicken Burger</div><span>$5.49</span></div>
            <div class="menu-item"><div>Veggie Burger</div><span>$4.99</span></div>
            <div class="menu-item"><div>BBQ Bacon Burger</div><span>$6.49</span></div>
          </div>

          <div class="menu-column">
            <h3>Fries & Sides</h3>
            <div class="menu-item"><div>French Fries</div><span>$2.99</span></div>
            <div class="menu-item"><div>Onion Rings</div><span>$3.49</span></div>
            <div class="menu-item"><div>Cheese Fries</div><span>$3.99</span></div>
            <div class="menu-item"><div>Chicken Nuggets</div><span>$4.49</span></div>
          </div>

          <div class="menu-column">
            <h3>Wraps</h3>
            <div class="menu-item"><div>Grilled Chicken Wrap</div><span>$5.49</span></div>
            <div class="menu-item"><div>Beef Wrap</div><span>$5.99</span></div>
            <div class="menu-item"><div>Falafel Wrap</div><span>$4.99</span></div>
          </div>

          <div class="menu-column">
            <h3>Desserts</h3>
            <div class="menu-item"><div>Strawberry Waffle</div><span>$4.00</span></div>
            <div class="menu-item"><div>Cinnamon Roll</div><span>$4.00</span></div>
            <div class="menu-item"><div>Lemon Pie</div><span>$4.00</span></div>
            <div class="menu-item"><div>Croissant</div><span>$4.00</span></div>
            <div class="menu-item"><div>Chocolate Waffle</div><span>$4.00</span></div>
          </div>

        </div>
      </div>

      <div class="tab-content" id="drinks-content">
        <div class="menu-grid">

          <div class="menu-column">
            <h3>Espresso</h3>
            <div class="menu-item"><div>Americano</div><span>$4.00</span></div>
            <div class="menu-item"><div>Cappuccino</div><span>$4.00</span></div>
            <div class="menu-item"><div>Latte</div><span>$4.00</span></div>
            <div class="menu-item"><div>Double Espresso</div><span>$4.00</span></div>
            <div class="menu-item"><div>Macchiato</div><span>$4.00</span></div>
            <div class="menu-item"><div>Mocha</div><span>$4.00</span></div>
            <div class="menu-item"><div>Long Black</div><span>$4.00</span></div>
            <div class="menu-item"><div>Flat White</div><span>$4.00</span></div>
          </div>

          <div class="menu-column">
            <h3>Non-Coffee</h3>
            <div class="menu-item"><div>Caramel</div><span>$4.00</span></div>
            <div class="menu-item"><div>Coffee Jelly</div><span>$4.00</span></div>
            <div class="menu-item"><div>Hazelnut Mocha</div><span>$4.00</span></div>
            <div class="menu-item"><div>Matcha Cream</div><span>$4.00</span></div>
            <div class="menu-item"><div>Strawberry Cream</div><span>$4.00</span></div>
            <div class="menu-item"><div>Vanilla Bean</div><span>$4.00</span></div>
            <div class="menu-item"><div>Milkshake</div><span>$4.00</span></div>
            <div class="menu-item"><div>Milk Tea</div><span>$4.00</span></div>
          </div>

          <div class="menu-column">
            <h3>Tea</h3>
            <div class="menu-item"><div>Hot Tea</div><span>$4.00</span></div>
            <div class="menu-item"><div>Ice Tea</div><span>$4.00</span></div>
            <div class="menu-item"><div>Lemon Tea</div><span>$4.00</span></div>
            <div class="menu-item"><div>Green Tea</div><span>$4.00</span></div>
            <div class="menu-item"><div>Jasmine Tea</div><span>$4.00</span></div>
          </div>

          <div class="menu-column">
            <h3>Smoothies</h3>
            <div class="menu-item"><div>Strawberry Smoothie</div><span>$5.00</span></div>
            <div class="menu-item"><div>Mango Smoothie</div><span>$5.00</span></div>
            <div class="menu-item"><div>Banana Smoothie</div><span>$5.00</span></div>
            <div class="menu-item"><div>Mixed Berry Smoothie</div><span>$5.00</span></div>
          </div>

        </div>
      </div>
    <script>
    const scribbleContainer = document.getElementById('scribble-layer');
    const numLines = 120; // slightly more lines

    for (let i = 0; i < numLines; i++) {
      const line = document.createElement('div');
      line.classList.add('scribble-line');

      const width = Math.random() * 150 + 30;  // 30–180px
      const height = Math.random() * 3 + 2;    // 2–5px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotation = Math.random() * 360;

      line.style.width = `${width}px`;
      line.style.height = `${height}px`;
      line.style.top = `${top}%`;
      line.style.left = `${left}%`;
      line.style.transform = `rotate(${rotation}deg)`;
      line.style.opacity = Math.random() * 0.1 + 0.05; // More visible

      scribbleContainer.appendChild(line);
    }
    </script>
    </div>

    <footer>
      © 2025 Elite Trio Cafe • All rights reserved
    </footer>
  </div>
