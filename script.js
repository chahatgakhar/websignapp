const canvas = document.getElementById('signatureCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let penColor = '#000';
let fontSize = '14px';
let backgroundColor = '#FFF';
let penSize = 2; // Default pen size

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (event) => {
    penColor = event.target.value;
});

const fontSizeSelector = document.getElementById('fontSizeSelector');
fontSizeSelector.addEventListener('change', (event) => {
    fontSize = event.target.value + 'px';
    // Adjust pen size based on font size
    penSize = parseInt(event.target.value) / 6; // You can adjust this scaling factor as needed
});

const backgroundPicker = document.getElementById('backgroundPicker');
backgroundPicker.addEventListener('input', (event) => {
    backgroundColor = event.target.value;
    canvas.style.background = backgroundColor;
});

canvas.style.background = backgroundColor;

// Event listeners for both mouse and touch events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawingTouch);
canvas.addEventListener('touchmove', drawTouch);
canvas.addEventListener('touchend', stopDrawingTouch);

function startDrawing(event) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = event.clientX - rect.left;
    lastY = event.clientY - rect.top;
    draw(event);
}

function draw(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    drawLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
}

function startDrawingTouch(event) {
    event.preventDefault();
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    drawTouch(touch);
}

function drawTouch(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;

    drawLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
}

function stopDrawingTouch() {
    isDrawing = false;
}

function drawLine(startX, startY, endX, endY) {
    context.lineWidth = penSize;
    context.lineCap = 'round';
    context.strokeStyle = penColor;
    context.font = fontSize + ' Arial';

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    lastX = 0;
    lastY = 0;
}

function downloadSignature() {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signature.png';
    link.click();
}

function retrieveSignature() {
    const savedSignature = localStorage.getItem('signature');
    if (savedSignature) {
        const img = new Image();
        img.src = savedSignature;
        context.clearRect(0, 0, canvas.width, canvas.height);
        img.onload = function() {
            context.drawImage(img, 0, 0);
        };
    } else {
        alert('No signature found in local storage.');
    }
}

// Save signature to local storage
canvas.addEventListener('mouseup', saveSignature);
canvas.addEventListener('touchend', saveSignature);

function saveSignature() {
    const url = canvas.toDataURL('image/png');
    localStorage.setItem('signature', url);
}

// Load signature from local storage
window.addEventListener('load', () => {
    const savedSignature = localStorage.getItem('signature');
    if (savedSignature) {
        const img = new Image();
        img.src = savedSignature;
        img.onload = function() {
            context.drawImage(img, 0, 0);
        };
    }
});
