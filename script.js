document.getElementById('layerCount').addEventListener('input', function() {
    const layerCount = parseInt(this.value);
    const unitsContainer = document.getElementById('unitsContainer');
    
    // Clear existing input fields
    unitsContainer.innerHTML = '';

    for (let i = 0; i < layerCount; i++) {
        const label = document.createElement('label');
        label.textContent = `Units in layer ${i + 1}:`;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.required = true;
        input.className = 'unitsInput';
        unitsContainer.appendChild(label);
        unitsContainer.appendChild(input);
        unitsContainer.appendChild(document.createElement('br'));
    }
});

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const unitsInputs = document.getElementsByClassName('unitsInput');
    const units = Array.from(unitsInputs).map(input => parseInt(input.value));
    const nodeColor = document.getElementById('nodeColor').value;
    const lineColor = document.getElementById('lineColor').value;
    const lineWidth = parseFloat(document.getElementById('lineWidth').value);
    const nodeRadius = parseFloat(document.getElementById('nodeRadius').value);
    const layerSpacing = parseFloat(document.getElementById('layerSpacing').value);
    const lineStart = document.getElementById('lineStart').value;
    
    drawNetwork(units, nodeColor, lineColor, lineWidth, nodeRadius, layerSpacing, lineStart);
});

function drawNetwork(units, nodeColor, lineColor, lineWidth, nodeRadius, layerSpacing, lineStart) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas with a transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dynamically set the canvas size
    const maxUnits = Math.max(...units);
    const nodeSpacing = nodeRadius * 2.5; // Set node spacing to 2.5 times the radius
    canvas.width = (units.length + 1) * layerSpacing; // Width based on layer spacing
    canvas.height = maxUnits * nodeSpacing + nodeRadius; // Height based on the number of units
    
    const layerCount = units.length;
    
    const nodePositions = [];

    // Calculate node positions for each layer
    for (let i = 0; i < layerCount; i++) {
        const layerX = (i + 1) * layerSpacing;
        const nodeCount = units[i];
        const positions = [];
        
        // Calculate node spacing
        const layerHeight = nodeCount * nodeSpacing;
        const offsetY = (canvas.height - layerHeight) / 2 + nodeRadius;
        
        for (let j = 0; j < nodeCount; j++) {
            const nodeY = offsetY + j * nodeSpacing;
            positions.push({ x: layerX, y: nodeY });
        }
        
        nodePositions.push(positions);
    }

    // Draw edges between nodes
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    for (let i = 1; i < layerCount; i++) {
        const currentLayer = nodePositions[i];
        const previousLayer = nodePositions[i - 1];
        
        for (const currentNode of currentLayer) {
            for (const previousNode of previousLayer) {
                ctx.beginPath();
                const startX = lineStart === 'center' ? previousNode.x : previousNode.x + nodeRadius;
                const startY = lineStart === 'center' ? previousNode.y : previousNode.y;
                const endX = lineStart === 'center' ? currentNode.x : currentNode.x - nodeRadius;
                const endY = lineStart === 'center' ? currentNode.y : currentNode.y;
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    for (const layer of nodePositions) {
        for (const node of layer) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
            ctx.fillStyle = nodeColor;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    }
}

// Automatically draw the default graph on page load
window.onload = function() {
    drawNetwork([3, 5, 4], '#ffffff', '#000000', 1, 20, 250, 'center');
};
