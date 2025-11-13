const canvas = document.getElementById("cubeCanvas");
const ctx = canvas.getContext("2d");
const size = 50;

let rotX = 35.264 * Math.PI / 180;
let rotY = 45 * Math.PI / 180;

// cube vertices (±1, ±1, ±1)
const verts = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];

// edges: connect vertex indices
const edges = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7]
];

function rotateY(v, a) {
  const [x,y,z] = v;
  return [
    x*Math.cos(a) + z*Math.sin(a),
    y,
    -x*Math.sin(a) + z*Math.cos(a)
  ];
}

function rotateX(v, a) {
  const [x,y,z] = v;
  return [
    x,
    y*Math.cos(a) - z*Math.sin(a),
    y*Math.sin(a) + z*Math.cos(a)
  ];
}

function project([x,y,z]) {
  // orthographic projection
  return [x, y];
}

function drawCube() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const projected = verts.map(v => {
    let r = rotateY(v, rotY);
    r = rotateX(r, rotX);
    const [px, py] = project(r);
    return [
      canvas.width/2 + px * size,
      canvas.height/2 - py * size
    ];
  });

  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [a,b] of edges) {
    const [x1,y1] = projected[a];
    const [x2,y2] = projected[b];
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
  }
  ctx.stroke();
}

drawCube();

window.addEventListener("keydown", e => {
  if (e.key === "1") { rotX = 35.264 * Math.PI / 180; rotY = 45 * Math.PI / 180; } // iso
  if (e.key === "2") { rotX = 0; rotY = 0; }   // front
  if (e.key === "3") { rotX = 90 * Math.PI / 180; rotY = 0; }  // top
  if (e.key === "4") { rotX = 0; rotY = 90 * Math.PI / 180; }  // right
  drawCube();
});
