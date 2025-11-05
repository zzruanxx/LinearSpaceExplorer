from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

def interpretar_determinante(det, dimensao=3):
    """
    Interpreta geometricamente o determinante de uma matriz
    """
    if dimensao == 2:
        if abs(det) < 1e-10:
            return f"Determinante ≈ 0. A transformação colapsa o plano em uma linha ou ponto (sem área)."
        elif det > 0:
            return f"Determinante = {det:.2f}. A área foi multiplicada por {abs(det):.2f}. A orientação foi preservada."
        else:
            return f"Determinante = {det:.2f}. A área foi multiplicada por {abs(det):.2f}. A orientação foi invertida (reflexão)."
    else:  # dimensao == 3
        if abs(det) < 1e-10:
            return f"Determinante ≈ 0. A transformação colapsa o espaço 3D em um plano, linha ou ponto (sem volume)."
        elif det > 0:
            return f"Determinante = {det:.2f}. O volume foi multiplicado por {abs(det):.2f}. A orientação foi preservada (sistema destro permanece destro)."
        else:
            return f"Determinante = {det:.2f}. O volume foi multiplicado por {abs(det):.2f}. A orientação foi invertida (sistema destro vira canhoto)."

@app.route('/')
def index():
    """Serve a página principal"""
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular():
    """
    Endpoint para calcular propriedades da matriz
    Recebe: {"matriz": [[a, b, c], [d, e, f], [g, h, i]]}
    Retorna: {"determinante": valor, "interpretacao": texto, "autovetores": [], "autovalores": []}
    """
    try:
        data = request.get_json()
        matriz = np.array(data['matriz'])
        
        # Validar dimensões
        if matriz.shape[0] != matriz.shape[1]:
            return jsonify({"erro": "A matriz deve ser quadrada"}), 400
        
        dimensao = matriz.shape[0]
        
        # Calcular determinante
        det = np.linalg.det(matriz)
        
        # Interpretar geometricamente
        interpretacao = interpretar_determinante(det, dimensao)
        
        # Calcular autovalores e autovetores (opcional, para análise avançada)
        try:
            autovalores, autovetores = np.linalg.eig(matriz)
            autovalores_list = autovalores.tolist()
            autovetores_list = autovetores.tolist()
        except:
            autovalores_list = []
            autovetores_list = []
        
        return jsonify({
            "determinante": float(det),
            "interpretacao": interpretacao,
            "autovalores": autovalores_list,
            "autovetores": autovetores_list
        })
    
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
