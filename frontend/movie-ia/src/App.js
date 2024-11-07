import React, { useState } from 'react';
import './App.css';  // Asegúrate de tener los estilos para el chat

function App() {
  const [consulta, setConsulta] = useState("");  // Estado para la consulta del usuario
  const [mensajes, setMensajes] = useState([]);  // Estado para los mensajes del chat
  const [bloqueado, setBloqueado] = useState(false);  // Estado para saber si el chat está bloqueado

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();  // Evitar el refresco de la página

    // Añadir el mensaje del usuario al chat
    const nuevoMensajeUsuario = { role: "user", content: consulta };
    setMensajes((prevMensajes) => [...prevMensajes, nuevoMensajeUsuario]);

    // Bloquear el chat mientras se obtiene la respuesta
    setBloqueado(true);

    // Llamada al backend para obtener la respuesta
    try {
      const response = await fetch("https://tarea-3-clementestreeter.onrender.com/generar_respuesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consulta }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      var respuestaLLM = data.respuesta;

      if (data.message) { 
        respuestaLLM = "I'm sorry, an error occurred. It apears the server is overloaded. Please try again later."; 
      }

      // Añadir la respuesta del asistente al chat
      const nuevoMensajeRespuesta = { role: "assistant", content: respuestaLLM };
      setMensajes((prevMensajes) => [...prevMensajes, nuevoMensajeRespuesta]);
    } catch (error) {
      const mensajeError = { role: "assistant", content: `Error al obtener la respuesta: ${error.message}` };
      setMensajes((prevMensajes) => [...prevMensajes, mensajeError]);
    }

    // Limpiar el campo de consulta y desbloquear el chat
    setConsulta("");
    setBloqueado(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat MOVIE</h1>
        <h5>This chat can anwser questions about American Psycho - Basic Instinct - Catch Me If You Can - Dead Poets Society - Gladiator - Inception - Indiana Jones And The Last Crusade - Mission Impossible - No Country For Old Men - The Godfather</h5>
        <div className="chat-container">
          <div className="messages">
            {mensajes.map((mensaje, index) => (
              <div key={index} className={`message ${mensaje.role}`}>
                <div className="message-content">{mensaje.content}</div>
              </div>
            ))}
          </div>
          {bloqueado && <div className="loading-message">Generando respuesta...</div>} {/* Indicador de carga */}
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Escribe tu mensaje..."
              required
              disabled={bloqueado}  // Deshabilitar mientras se espera la respuesta
            />
            <button type="submit" disabled={bloqueado}>Enviar</button>  {/* Deshabilitar mientras se espera la respuesta */}
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
