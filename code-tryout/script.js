const canvas = document.getElementById("cubeCanvas");
const ctx = canvas.getContext("2d");
const size = 60;

// rotation angles
let rotX = 35 * Math.PI/180;
let rotY = 45 * Math.PI/180;
let rotZ = 0;

// cube vertices (±1, ±1, ±1)
const verts = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];

// faces: each made of 4 vertex indices
const faces = [
  [0,1,2,3], // back
  [4,5,6,7], // front
  [0,1,5,4], // bottom
  [3,2,6,7], // top
  [1,2,6,5], // right
  [0,3,7,4]  // left
];

// rotation helpers
function rotateX([x, y, z], a) {
  return [x, y*Math.cos(a) - z*Math.sin(a), y*Math.sin(a) + z*Math.cos(a)];
}
function rotateY([x, y, z], a) {
  return [x*Math.cos(a) + z*Math.sin(a), y, -x*Math.sin(a) + z*Math.cos(a)];
}
function rotateZ([x, y, z], a) {
  return [x*Math.cos(a) - y*Math.sin(a), x*Math.sin(a) + y*Math.cos(a), z];
}

// orthographic projection: ignore z
function project([x, y, z]) {
  return [x, y];
}

function drawCube() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // rotate all vertices
  const rotated = verts.map(v => {
    let r = rotateX(v, rotX);
    r = rotateY(r, rotY);
    r = rotateZ(r, rotZ);
    return r;
  });

  // sort faces by average z (far → near)
  const sortedFaces = faces.slice().sort((a,b) => {
    const za = a.map(i => rotated[i][2]).reduce((s,z)=>s+z)/4;
    const zb = b.map(i => rotated[i][2]).reduce((s,z)=>s+z)/4;
    return zb - za;
  });

  for (const face of sortedFaces) {
    const pts = face.map(i => {
      const [x,y,z] = rotated[i];
      const [px, py] = project([x,y,z]);
      return [
        canvas.width/2 + px * size,
        canvas.height/2 - py * size
      ];
    });

    // fake lighting (based on average z)
    const avgZ = face.map(i => rotated[i][2]).reduce((s,z)=>s+z)/4;
    const brightness = 120 + avgZ * 60;
    ctx.fillStyle = `rgb(0,${Math.max(0,Math.min(255,brightness))},0)`;

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

drawCube();

// controls: rotate orthographically
window.addEventListener("keydown", e => {
  const step = 0.1;
  if (e.key === "ArrowUp") rotX -= step;
  if (e.key === "ArrowDown") rotX += step;
  if (e.key === "ArrowLeft") rotY -= step;
  if (e.key === "ArrowRight") rotY += step;
  if (e.key === "q") rotZ -= step;
  if (e.key === "e") rotZ += step;
  drawCube();
});
