let fields = [
    null, null, null,
    null , null, null,
    null, null, null
];

const width = 70;
const height = 70;
let isCircleTurn = true; // Um zu verfolgen, ob es an der Reihe ist, ein Kreis oder Kreuz zu platzieren

function init() {
    render();
}

function render() {
    const content = document.getElementById("content");
    let tableHTML = "<table>";

    for (let i = 0; i < 3; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG(width, height);
            } else if (fields[index] === 'cross') {
                symbol = generateXSVG(width, height);
            }
            tableHTML += `<td onclick="placeSymbol(${index})">${symbol}</td>`;
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</table>";

    content.innerHTML = tableHTML;
}

function generateCircleSVG(width, height) {
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${width / 2}" cy="${height / 2}" r="${(width - 10) / 2}" fill="transparent" stroke="#0b55b6" stroke-width="3">
                    <animate attributeName="r" from="0" to="${(width - 10) / 2}" dur="0.5s" fill="freeze" />
                    <animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze" />
                </circle>
            </svg>`;
}

function generateXSVG(width, height) {
    const strokeWidth = 3;

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <line x1="${strokeWidth}" y1="${strokeWidth}" x2="${width - strokeWidth}" y2="${height - strokeWidth}" stroke="#e7b23e" stroke-width="${strokeWidth}">
                    <animate attributeName="stroke-opacity" from="0" to="2" dur="4s" fill="freeze" />
                </line>
                <line x1="${width - strokeWidth}" y1="${strokeWidth}" x2="${strokeWidth}" y2="${height - strokeWidth}" stroke="#e7b23e" stroke-width="${strokeWidth}">
                    <animate attributeName="stroke-opacity" from="0" to="1" dur="3s" fill="freeze" />
                </line>
            </svg>`;
}

function placeSymbol(index) {
    const td = event.target;
    if (!fields[index]) { // Nur wenn das Feld leer ist
        const symbol = isCircleTurn ? generateCircleSVG(width, height) : generateXSVG(width, height);
        td.innerHTML = symbol;
        fields[index] = isCircleTurn ? 'circle' : 'cross';
        isCircleTurn = !isCircleTurn; // Wechselt zwischen Kreis und Kreuz

        const winner = checkWinner();
        if (winner) {
            drawWinningLine(winner);
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale
        [0, 4, 8], [2, 4, 6]             // Diagonale
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return pattern;
        }
    }

    return null;
}

function drawWinningLine(pattern) {
    const content = document.getElementById("content");
    const table = content.querySelector("table");
    const [a, b, c] = pattern;

    const tdA = table.rows[Math.floor(a / 3)].cells[a % 3];
    const tdB = table.rows[Math.floor(b / 3)].cells[b % 3];
    const tdC = table.rows[Math.floor(c / 3)].cells[c % 3];

    const rectA = tdA.getBoundingClientRect();
    const rectB = tdB.getBoundingClientRect();
    const rectC = tdC.getBoundingClientRect();

    const x1 = rectA.left + rectA.width / 2;
    const y1 = rectA.top + rectA.height / 2;
    const x2 = rectC.left + rectC.width / 2;
    const y2 = rectC.top + rectC.height / 2;

    const lineSVG = `<svg width="100%" height="100%" style="position:absolute; top:0; left:0; pointer-events:none;">
                        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="5"/>
                     </svg>`;

    content.insertAdjacentHTML('beforeend', lineSVG);
}
function resetGame() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    isCircleTurn = true;
    const content = document.getElementById("content");
    content.innerHTML = '';
    render();
}

init();