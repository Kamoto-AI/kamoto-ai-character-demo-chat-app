import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function App() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const chatWindowRef = useRef();
  const [lastCharacterMessageIndex, setLastCharacterMessageIndex] = useState(
    -1
  );

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    setWaitingForResponse(true);

    const newUserMessage = { role: "user", content: userInput };
    setChatHistory((prevChat) => [...prevChat, newUserMessage]);

    try {
      const postUrl = "https://api.kamoto.ai/v1/chat-completions";

      //loading Chanakya's AI Character
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "576799f8-05eb-47ac-a9e9-ea0f987d6c2d",
        "x-personality-id": "7342e580-b59d-44a9-93c8-e60a5e013eab",
      };

      const body = {
        messages: [...chatHistory, newUserMessage],
      };
      const response = await axios.post(postUrl, body, { headers });

      const KamotoAIMessageResponse = response.data.data.choices[0].message.content;

      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "character", content: KamotoAIMessageResponse },
      ]);

      setLastCharacterMessageIndex(chatHistory.length); // Record the index of the last character message
      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setWaitingForResponse(false); // Set waitingForResponse to false after the response is received
    }
  };

  // Scroll to the bottom of the chat window whenever chatHistory updates
  useEffect(() => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Kamoto.AI Character Chat App Demo
      </h1>
      <div
        ref={chatWindowRef}
        style={{
          width: "600px",
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "0.375rem",
          padding: "1rem",
          maxHeight: "900px",
          minHeight: "900px",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "0.5rem",
              padding: "0.5rem",
              borderRadius: "0.375rem",
              backgroundColor: message.role === "user" ? "#3b82f6" : "#d1d5db",
              color: message.role === "user" ? "#ffffff" : "#000000",
              textAlign: message.role === "user" ? "right" : "left",
              position: "relative", // Add this position property
            }}
          >
            {message.content}
            {message.role === "character" &&
              index === lastCharacterMessageIndex && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {waitingForResponse && (
                    <ClipLoader color="#d1d5db" size={20} />
                  )}
                </div>
              )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSendMessage();
              setUserInput("");
            }
          }}
          placeholder="Type your message..."
          style={{
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            width: "540px",
            pointerEvents: waitingForResponse ? "none" : "auto",
            opacity: waitingForResponse ? 0.6 : 1,
          }}
          disabled={waitingForResponse}
        />
        <button
          onClick={() => {
            handleSendMessage();
            setUserInput("");
          }}
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            borderRadius: "0.375rem",
            cursor: "pointer",
            pointerEvents: waitingForResponse ? "none" : "auto",
            opacity: waitingForResponse ? 0.6 : 1,
          }}
          disabled={waitingForResponse}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
