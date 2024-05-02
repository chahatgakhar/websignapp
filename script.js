const canvas = document.getElementById('signatureCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let penColor = '#000';
let fontSize = '14px';
let backgroundColor = '#FFF';

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (event) => {
    penColor = event.target.value;
});

const fontSizeSelector = document.getElementById('fontSizeSelector');
fontSizeSelector.addEventListener('change', (event) => {
    fontSize = event.target.value + 'px';
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
    draw(event);
}

function draw(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    drawLine(x, y);
}

function stopDrawing() {
    isDrawing = false;
}

function startDrawingTouch(event) {
    event.preventDefault();
    isDrawing = true;
    drawTouch(event.touches[0]);
}

function drawTouch(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;

    drawLine(x, y);
}

function stopDrawingTouch() {
    isDrawing = false;
}

function drawLine(x, y) {
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = penColor;
    context.font = fontSize + ' Arial';

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
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
