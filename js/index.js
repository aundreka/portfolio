const carousel = document.querySelector(".piano-carousel");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");

let currentIndex = 0;
const totalPianos = pianos.length;
const angleStep = 360 / totalPianos;
const radius = 520;
const heightFactor = 60;
const offsetFactor = 60;
const duration = 800;
const colors = ["red", "blue", "green", "yellow", "purple"];

// Set colors dynamically for each piano
pianos.forEach((piano, index) => {
  piano.addEventListener("load", async () => {
    const model = piano.model;
    const materials = model.materials;
    if (!materials || materials.length === 0) return;

    const material = materials[0];
    const colorFactor = getColorFactor(colors[index]);

    if (material.pbrMetallicRoughness) {
      material.pbrMetallicRoughness.setBaseColorFactor(colorFactor);
      material.pbrMetallicRoughness.baseColorTexture = null; 
    }

    if (material.alphaMode) {
      material.alphaMode = "OPAQUE"; 
    }
  });
});

function getColorFactor(color) {
  const colorMap = {
    "red": [1, 0.9, 0.9, 1],    
    "blue": [0.9, 0.95, 1, 1],  
    "green": [0.9, 1, 0.9, 1],  
    "yellow": [1, 1, 0.9, 1],    
    "purple": [0.9, 0.9, 1, 1]  
  };
  return colorMap[color] || [1, 1, 1, 1]; 
}

pianos.forEach((piano) => {
  piano.style.transition = `transform ${duration}ms ease-out`;
});

function getCenterPiano() {
  return [...pianos].reduce((closest, piano) => {
    const orbit = piano.getAttribute("camera-orbit").split(" ");
    const orbitX = parseFloat(orbit[0]); 
    return Math.abs(orbitX) < Math.abs(closest.orbitX) ? { piano, orbitX } : closest;
  }, { piano: pianos[0], orbitX: 999 }).piano;
}

function updateIcons() {
  pianos.forEach((piano) => {
    const angle = getPianoAngle(piano);
    const icon = piano.querySelector(".icon-label");

    if (!icon) return;

    if (Math.abs(angle) < 15) {
      // Center piano (angle near 0°) → Make icon bigger
      icon.style.transform = `translate(-50%, -50%) scale(1.5)`;
      icon.style.left = "50%";
      icon.style.top = "50%";
      icon.style.display = "block";
    } else if (Math.abs(angle) >= 15 && Math.abs(angle) <= 45) {
      // Side pianos (angle between 15° and 45°) → Move icon to back
      icon.style.transform = `translate(-50%, -50%) rotateY(180deg)`;
      icon.style.left = "85%"; // Adjust for positioning at the back
      icon.style.top = "50%";
      icon.style.display = "block";
    } else {
      // Back pianos (angle > 45°) → Hide icon
      icon.style.display = "none";
    }
  });
}

function getPianoAngle(piano) {
  const style = window.getComputedStyle(piano);
  const matrix = new DOMMatrix(style.transform);
  const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
  return angle;
}

function animateRotation(targetIndex) {
  let targetAngle = targetIndex * angleStep;

  pianos.forEach((piano, index) => {
    let baseAngle = index * angleStep;
    let effectiveAngle = (baseAngle - targetAngle) % 360;
    let rad = effectiveAngle * (Math.PI / 180);

    let x = Math.sin(rad) * radius;
    let z = Math.cos(rad) * radius;
    let y = (1 - Math.abs(Math.cos(rad))) * heightFactor;
    let offsetX = Math.sin(rad) * offsetFactor;

    if (Math.abs(effectiveAngle) < 30) {
      y = -30;
      offsetX = 0;
    }

    let orbitX = -effectiveAngle;
    piano.setAttribute("camera-orbit", `${orbitX}deg 90deg 90deg`);
    piano.style.transform = `translateX(${x + offsetX}px) translateZ(${z}px) translateY(${-y}px)`;

    let depth = Math.cos(rad);
    piano.style.zIndex = Math.round((depth + 1) * 100);

    
    
  });

  currentIndex = targetIndex % totalPianos;
}

nextBtn.addEventListener("click", () => {
  animateRotation((currentIndex + 1) % totalPianos);
});

prevBtn.addEventListener("click", () => {
  animateRotation((currentIndex - 1 + totalPianos) % totalPianos);
});

animateRotation(0);

// Drag controls
let isDragging = false;
let startX = 0, startY = 0;
let lastOrbitX = 90, lastOrbitY = 90;

function startDrag(event) {
  isDragging = true;
  startX = event.clientX || event.touches[0].clientX;
  startY = event.clientY || event.touches[0].clientY;

  let centerPiano = getCenterPiano();
  let orbit = centerPiano.getAttribute("camera-orbit").split(" ");
  lastOrbitX = parseFloat(orbit[0]);
  lastOrbitY = parseFloat(orbit[1]);

  event.preventDefault();
}

function drag(event) {
  if (!isDragging) return;
  
  let clientX = event.clientX || event.touches[0].clientX;
  let clientY = event.clientY || event.touches[0].clientY;
  
  let deltaX = clientX - startX;
  let deltaY = clientY - startY;

  let sensitivityX = 0.2;
  let sensitivityY = 0.15;

  let newOrbitX = lastOrbitX - deltaX * sensitivityX;
  let newOrbitY = lastOrbitY - deltaY * sensitivityY;
  newOrbitY = Math.max(75, Math.min(105, newOrbitY));
  newOrbitX = Math.max(-30, Math.min(30, newOrbitX));

  let centerPiano = getCenterPiano();
  centerPiano.setAttribute("camera-orbit", `${newOrbitX}deg ${newOrbitY}deg 90deg`);
}

function stopDrag() {
  isDragging = false;
  setTimeout(() => {
    let centerPiano = getCenterPiano();
    centerPiano.setAttribute("camera-orbit", "0deg 90deg 90deg");
  }, 500);
}

carousel.addEventListener("mousedown", startDrag);
carousel.addEventListener("touchstart", startDrag);

window.addEventListener("mousemove", drag);
window.addEventListener("touchmove", drag);
window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchend", stopDrag);
