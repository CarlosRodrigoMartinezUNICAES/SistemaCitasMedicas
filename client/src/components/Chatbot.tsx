import React from "react";
import ChatBot from "react-chatbotify";
//import "react-chatbotify/dist/react-chatbotify.css";

const MyChatbot: React.FC = () => {
    const flow = {
        start: {
            message: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?",
            options: () => ["Quiero agendar una cita", "Quiero ver mis citas", "Tengo otra pregunta"],
            path: "process_option",
        },
        process_option: {
            path: (params: { userInput: string }) => {
                switch (params.userInput) {
                    case "Quiero agendar una cita":
                        // Original logic, without handleRedirect
                        window.location.href = "/agendar-cita";
                        return "end";
                    case "Quiero ver mis citas":
                        // Original logic, without handleRedirect
                        window.location.href = "/citas";
                        return "end";
                    case "Tengo otra pregunta":
                        return "otra_pregunta";
                    default:
                        return "start"; // Fallback to start
                }
            },
        },
        otra_pregunta: {
            message: "Puedes contactarnos a través de nuestro correo electrónico de soporte: support@example.com",
            path: "end",
        },
        end: {
            message: "Ha sido un placer ayudarte. ¡Vuelve pronto!",
            end: true,
        },
    };

    const settings = {
        header: {
            title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>🤖</span>
                    <span>Asistente Virtual</span>
                </div>
            ),
        },
        chatInput: {
            enabledPlaceholderText: "Escribe tu mensaje aquí...",
        },
    };

    return (
        <ChatBot flow={flow} settings={settings} />
    );
};

export default MyChatbot;