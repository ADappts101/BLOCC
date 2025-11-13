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

// each face uses 4 vertices (in order)
const faces = [
  [0,1,2,3], // back
  [4,5,6,7], // front
  [0,1,5,4], // bottom
  [3,2,6,7], // top
  [1,2,6,5], // right
  [0,3,7,4]  // left
];

// rotation helpers
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

// orthographic projection
function project([x,y,z]) {
  return [x, y];
}

function drawCube() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // rotate all vertices
  const rotated = verts.map(v => {
    let r = rotateY(v, rotY);
    r = rotateX(r, rotX);
    return r;
  });

  // sort faces back-to-front using average z
  const sortedFaces = faces.slice().sort((a,b) => {
    const za = a.map(i => rotated[i][2]).reduce((s,z)=>s+z)/4;
    const zb = b.map(i => rotated[i][2]).reduce((s,z)=>s+z)/4;
    return zb - za; // draw far → near
  });

  // draw faces
  for (const face of sortedFaces) {
    const pts = face.map(i => {
      const [x,y,z] = rotated[i];
      const [px, py] = project([x,y,z]);
      return [
        canvas.width/2 + px * size,
        canvas.height/2 - py * size
      ];
    });

    // brightness based on average z (fake lighting)
    const avgZ = face.map(i => rotated[i][2]).reduce((s,z)=>s+z)/4;
    const brightness = 120 + avgZ * 60; // tweak
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

// camera preset keys
window.addEventListener("keydown", e => {
  if (e.key === "1") { rotX = 35.264 * Math.PI / 180; rotY = 45 * Math.PI / 180; } // iso
  if (e.key === "2") { rotX = 0; rotY = 0; }   // front
  if (e.key === "3") { rotX = 90 * Math.PI / 180; rotY = 0; }  // top
  if (e.key === "4") { rotX = 0; rotY = 90 * Math.PI / 180; }  // right
  drawCube();
});
