# 🔷 Linear Space Explorer

Um visualizador interativo de transformações lineares que combina álgebra linear com visualização 3D em tempo real.

## 📖 Sobre o Projeto

O Linear Space Explorer é uma aplicação web educacional que permite visualizar transformações lineares no espaço 3D. Através de uma interface intuitiva, você pode inserir matrizes de transformação e ver como elas afetam os vetores da base canônica (i, j, k), além de receber interpretações geométricas sobre o que cada transformação representa.

### Funcionalidades

- 🎯 Visualização 3D interativa usando Three.js
- 🔢 Cálculo de determinante e interpretação geométrica
- 🎨 Animações suaves das transformações
- 📊 Transformações pré-definidas (escala, rotação, cisalhamento, reflexão)
- 🎮 Controles de câmera interativos (rotação e zoom)
- 📱 Interface responsiva e moderna

## 🏗️ Arquitetura

### Backend (Python/Flask)
- Servidor Flask que serve a aplicação web
- Endpoint `/calcular` que processa matrizes
- Cálculos matemáticos usando NumPy
- Interpretações geométricas automáticas

### Frontend (HTML/CSS/JavaScript)
- Interface com Three.js para renderização 3D
- Animações com GSAP
- Comunicação assíncrona com o backend via fetch API
- Visualização de vetores da base canônica transformados

## 🚀 Como Executar

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/zzruanxx/LinearSpaceExplorer.git
cd LinearSpaceExplorer
```

2. Instale as dependências Python:
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python app.py
```

4. Abra seu navegador e acesse:
```
http://localhost:5000
```

## 💻 Como Usar

1. **Inserir Matriz**: Digite os valores da matriz 3×3 nos campos de entrada
2. **Transformar**: Clique no botão "🔄 Transformar" para aplicar a transformação
3. **Ver Interpretação**: Leia a interpretação geométrica gerada automaticamente
4. **Usar Presets**: Experimente transformações pré-definidas clicando nos botões de preset
5. **Resetar**: Clique em "↺ Resetar" para voltar à matriz identidade
6. **Interagir com a Cena**: 
   - Arraste com o mouse para rotacionar a câmera
   - Use a roda do mouse para zoom

## 🎓 Conceitos de Álgebra Linear

### Vetores da Base Canônica
- **i (vermelho)**: Vetor unitário no eixo X = (1, 0, 0)
- **j (verde)**: Vetor unitário no eixo Y = (0, 1, 0)
- **k (azul)**: Vetor unitário no eixo Z = (0, 0, 1)

### Interpretação do Determinante
- **det = 0**: Colapso do espaço (perda de dimensão)
- **det > 0**: Preservação da orientação
- **det < 0**: Inversão da orientação
- **|det|**: Fator de escala do volume

## 🛠️ Tecnologias Utilizadas

- **Backend**: Python 3, Flask, NumPy
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualização**: Three.js
- **Animação**: GSAP
- **Estilo**: CSS Grid, Flexbox, Gradientes

## 📝 Estrutura do Projeto

```
LinearSpaceExplorer/
├── app.py                 # Servidor Flask e API
├── requirements.txt       # Dependências Python
├── templates/
│   └── index.html        # Template HTML principal
└── static/
    ├── css/
    │   └── style.css     # Estilos da aplicação
    └── js/
        └── main.js       # Lógica Three.js e interações
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como um projeto educacional para visualização de transformações lineares.