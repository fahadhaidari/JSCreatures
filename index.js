window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const quads = [];
  const WINDOW_COLOR = '#111111';
  const draw = {
    quad: (x = 0, y = 0, width = 10, height = 10, color = 'orange') => {
      context.fillStyle = color;
      context.fillRect(x, y, width, height);
    },
    ellipse: (x = 0, y = 0, r, color = 'orange') => {
      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.fill();
    }
  };
  const canvasWidth = canvas.width = window.innerWidth;
  const canvasHeight = canvas.height = window.innerHeight * 0.97;

  const random = (min, max) => Math.random() * (max - min) + min;
  canvas.style.backgroundColor = WINDOW_COLOR;
  document.body.style.backgroundColor = WINDOW_COLOR;

  const step = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    quads.forEach(q => {
      q.chase();
      q.updateTrace();

      draw.quad(q.x, q.y, q.width, q.height, q.color);

      q.trace.forEach(t => {
        draw.quad(t.x + q.width / 3, t.y + q.height - 2, 5, 5, q.color);
      });
    });
  };

  const frame = () => {
    step();
    requestAnimationFrame(frame);
  };

  function Quad(x, y, width, height) {
    const size = random(30, 5);
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.speed = random(4, 2);
    this.maxTraceLength = random(80, 10);
    this.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    this.target = {
      x: random(canvasWidth, this.width),
      y: random(canvasHeight, this.height)
    };

    this.trace = [];
  };

  Quad.prototype.chase = function() {
    if (this.x < this.target.x) {
      this.x += this.speed;
    }
    if (this.x > this.target.x) {
      this.x -= this.speed;
    }
    if (this.y < this.target.y) {
      this.y += this.speed;
    }
    if (this.y > this.target.y) {
      this.y -= this.speed;
    }
  };

  Quad.prototype.updateTrace = function() {
    if (this.trace.length > this.maxTraceLength) {
      this.trace.splice(0, 1);
    }
    this.trace.push({
      x: this.x,
      y: this.y
    });

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.speed = distance / 50;

    if (distance < 10) {
      this.speed = random(4, 2);
      this.target.x = random(canvasWidth * 0.9, this.width);
      this.target.y = random(canvasWidth * 0.9, this.height);
    }
  }

  window.onclick = e => {
    const rect = canvas.getBoundingClientRect();
    quads.push(new Quad(e.clientX - rect.x, e.clientY - rect.y, 20, 20));
  }

  frame();
}
