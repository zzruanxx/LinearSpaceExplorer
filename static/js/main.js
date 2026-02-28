// Configuração do canvas 2D
let canvas, ctx;
let scale = 80; // Escala de pixels por unidade
let rotation = { angleX: 0, angleY: 0 };
let vectors = {
    i: { x: 1, y: 0, z: 0, color: '#ff0000', label: 'i' },
    j: { x: 0, y: 1, z: 0, color: '#00ff00', label: 'j' },
    k: { x: 0, y: 0, z: 1, color: '#0000ff', label: 'k' }
};
let targetVectors = null;
let animationProgress = 1;

// Inicializar a cena 2D
function initScene() {
    const container = document.getElementById('canvas-container');
    
    // Criar canvas
    canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.background = '#f5f5f5';
    container.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    
    // Configurar rotação inicial para visualização 3D
    rotation.angleX = Math.PI / 6; // 30 graus
    rotation.angleY = Math.PI / 4; // 45 graus
    
    // Controles de interação
    setupControls();
    
    // Iniciar loop de renderização
    animate();
    
    // Ajustar ao redimensionar janela
    window.addEventListener('resize', onWindowResize);
}

// Projeção 3D para 2D (perspectiva isométrica)
function project3D(x, y, z) {
    // Rotação em torno do eixo Y
    const cosY = Math.cos(rotation.angleY);
    const sinY = Math.sin(rotation.angleY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    
    // Rotação em torno do eixo X
    const cosX = Math.cos(rotation.angleX);
    const sinX = Math.sin(rotation.angleX);
    const y1 = y * cosX - z1 * sinX;
    
    // Projeção para 2D
    const screenX = canvas.width / 2 + x1 * scale;
    const screenY = canvas.height / 2 - y1 * scale;
    
    return { x: screenX, y: screenY };
}

// Desenhar grid
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    const gridSize = 5;
    
    // Grid no plano XZ
    for (let i = -gridSize; i <= gridSize; i++) {
        // Linhas paralelas ao eixo X
        const start = project3D(-gridSize, 0, i);
        const end = project3D(gridSize, 0, i);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        // Linhas paralelas ao eixo Z
        const start2 = project3D(i, 0, -gridSize);
        const end2 = project3D(i, 0, gridSize);
        ctx.beginPath();
        ctx.moveTo(start2.x, start2.y);
        ctx.lineTo(end2.x, end2.y);
        ctx.stroke();
    }
}

// Desenhar eixos de referência
function drawAxes() {
    const axisLength = 2;
    
    // Eixo X (cinza claro)
    drawLine(0, 0, 0, axisLength, 0, 0, '#cccccc', 1);
    
    // Eixo Y (cinza claro)
    drawLine(0, 0, 0, 0, axisLength, 0, '#cccccc', 1);
    
    // Eixo Z (cinza claro)
    drawLine(0, 0, 0, 0, 0, axisLength, '#cccccc', 1);
}

// Desenhar linha 3D
function drawLine(x1, y1, z1, x2, y2, z2, color, width) {
    const start = project3D(x1, y1, z1);
    const end = project3D(x2, y2, z2);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

// Desenhar vetor como seta
function drawVector(vec) {
    const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    if (length < 0.01) return;
    
    // Desenhar linha do vetor
    drawLine(0, 0, 0, vec.x, vec.y, vec.z, vec.color, 3);
    
    // Desenhar ponta da seta
    const arrowSize = 0.15;
    const dir = { x: vec.x / length, y: vec.y / length, z: vec.z / length };
    
    // Calcular vetores perpendiculares para a ponta da seta
    const perpX = { x: -dir.y, y: dir.x, z: 0 };
    const perpY = { x: -dir.z, y: 0, z: dir.x };
    
    const arrowBase = {
        x: vec.x - dir.x * arrowSize * 2,
        y: vec.y - dir.y * arrowSize * 2,
        z: vec.z - dir.z * arrowSize * 2
    };
    
    // Desenhar cone da seta
    const tip = project3D(vec.x, vec.y, vec.z);
    const base1 = project3D(
        arrowBase.x + perpX.x * arrowSize,
        arrowBase.y + perpX.y * arrowSize,
        arrowBase.z + perpX.z * arrowSize
    );
    const base2 = project3D(
        arrowBase.x - perpX.x * arrowSize,
        arrowBase.y - perpX.y * arrowSize,
        arrowBase.z - perpX.z * arrowSize
    );
    
    ctx.fillStyle = vec.color;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(base1.x, base1.y);
    ctx.lineTo(base2.x, base2.y);
    ctx.closePath();
    ctx.fill();
    
    // Desenhar label
    const labelPos = project3D(vec.x * 1.2, vec.y * 1.2, vec.z * 1.2);
    ctx.fillStyle = vec.color;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(vec.label, labelPos.x + 5, labelPos.y);
}

// Controles de interação
function setupControls() {
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let wheelTimeout = null;
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        
        rotation.angleY += deltaX * 0.01;
        rotation.angleX += deltaY * 0.01;
        
        // Limitar rotação vertical
        rotation.angleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.angleX));
        
        lastX = e.clientX;
        lastY = e.clientY;
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Debounced wheel event handler for better performance
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (wheelTimeout) {
            clearTimeout(wheelTimeout);
        }
        
        wheelTimeout = setTimeout(() => {
            scale *= (e.deltaY > 0) ? 0.95 : 1.05;
            scale = Math.max(20, Math.min(150, scale));
        }, 10);
    });
}

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Animar transformação se necessário
    if (targetVectors && animationProgress < 1) {
        animationProgress += 0.02;
        animationProgress = Math.min(1, animationProgress);
        
        // Interpolação suave (easing)
        const t = easeInOutQuad(animationProgress);
        
        for (const key in vectors) {
            vectors[key].x = lerp(vectors[key].startX, targetVectors[key].x, t);
            vectors[key].y = lerp(vectors[key].startY, targetVectors[key].y, t);
            vectors[key].z = lerp(vectors[key].startZ, targetVectors[key].z, t);
        }
    }
    
    // Desenhar cena
    drawGrid();
    drawAxes();
    
    // Desenhar vetores (ordem: k, j, i para melhor visualização)
    drawVector(vectors.k);
    drawVector(vectors.j);
    drawVector(vectors.i);
}

// Funções de interpolação
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Redimensionar canvas
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// Aplicar transformação com animação
function applyTransformation(matrix) {
    // Salvar posições iniciais
    for (const key in vectors) {
        vectors[key].startX = vectors[key].x;
        vectors[key].startY = vectors[key].y;
        vectors[key].startZ = vectors[key].z;
    }
    
    // Calcular novos vetores (multiplicação de matriz)
    targetVectors = {
        i: {
            x: matrix[0][0],
            y: matrix[1][0],
            z: matrix[2][0]
        },
        j: {
            x: matrix[0][1],
            y: matrix[1][1],
            z: matrix[2][1]
        },
        k: {
            x: matrix[0][2],
            y: matrix[1][2],
            z: matrix[2][2]
        }
    };
    
    // Resetar progresso da animação
    animationProgress = 0;
}

// Resetar para identidade
function resetTransformation() {
    // Resetar vetores diretamente
    vectors = {
        i: { x: 1, y: 0, z: 0, color: '#ff0000', label: 'i' },
        j: { x: 0, y: 1, z: 0, color: '#00ff00', label: 'j' },
        k: { x: 0, y: 0, z: 1, color: '#0000ff', label: 'k' }
    };
    
    targetVectors = null;
    animationProgress = 1;
    
    // Resetar inputs
    document.getElementById('m00').value = 1;
    document.getElementById('m01').value = 0;
    document.getElementById('m02').value = 0;
    document.getElementById('m10').value = 0;
    document.getElementById('m11').value = 1;
    document.getElementById('m12').value = 0;
    document.getElementById('m20').value = 0;
    document.getElementById('m21').value = 0;
    document.getElementById('m22').value = 1;
    
    // Limpar info
    document.getElementById('info').innerHTML = `
        <h3>📊 Interpretação Geométrica</h3>
        <p>Matriz identidade restaurada. Nenhuma transformação aplicada.</p>
    `;
}

// Ler matriz dos inputs
function readMatrixFromInputs() {
    return [
        [
            parseFloat(document.getElementById('m00').value),
            parseFloat(document.getElementById('m01').value),
            parseFloat(document.getElementById('m02').value)
        ],
        [
            parseFloat(document.getElementById('m10').value),
            parseFloat(document.getElementById('m11').value),
            parseFloat(document.getElementById('m12').value)
        ],
        [
            parseFloat(document.getElementById('m20').value),
            parseFloat(document.getElementById('m21').value),
            parseFloat(document.getElementById('m22').value)
        ]
    ];
}

// Preencher inputs com matriz
function fillMatrixInputs(matrix) {
    document.getElementById('m00').value = matrix[0][0];
    document.getElementById('m01').value = matrix[0][1];
    document.getElementById('m02').value = matrix[0][2];
    document.getElementById('m10').value = matrix[1][0];
    document.getElementById('m11').value = matrix[1][1];
    document.getElementById('m12').value = matrix[1][2];
    document.getElementById('m20').value = matrix[2][0];
    document.getElementById('m21').value = matrix[2][1];
    document.getElementById('m22').value = matrix[2][2];
}

// Enviar matriz para backend e aplicar transformação
async function transformar() {
    const matriz = readMatrixFromInputs();
    
    try {
        // Enviar para o backend
        const response = await fetch('/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matriz: matriz })
        });
        
        const data = await response.json();
        
        if (data.erro) {
            alert('Erro: ' + data.erro);
            return;
        }
        
        // Atualizar interpretação
        document.getElementById('info').innerHTML = `
            <h3>📊 Interpretação Geométrica</h3>
            <p><strong>${data.interpretacao}</strong></p>
            <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                Determinante: ${data.determinante.toFixed(4)}
            </p>
        `;
        
        // Aplicar transformação visual
        applyTransformation(matriz);
        
    } catch (error) {
        console.error('Erro ao comunicar com backend:', error);
        alert('Erro ao calcular. Verifique se o servidor está rodando.');
    }
}

// Presets de transformações
const presets = {
    scale: [
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, 2]
    ],
    rotation: [
        [Math.cos(Math.PI/4), -Math.sin(Math.PI/4), 0],
        [Math.sin(Math.PI/4), Math.cos(Math.PI/4), 0],
        [0, 0, 1]
    ],
    shear: [
        [1, 0.5, 0],
        [0, 1, 0],
        [0, 0, 1]
    ],
    reflection: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, -1]
    ]
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar cena
    initScene();
    
    // Botão transformar
    document.getElementById('transformBtn').addEventListener('click', transformar);
    
    // Botão resetar
    document.getElementById('resetBtn').addEventListener('click', resetTransformation);
    
    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.getAttribute('data-preset');
            const matrix = presets[presetName];
            fillMatrixInputs(matrix);
            transformar();
        });
    });
});
