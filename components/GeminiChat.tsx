import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Typography, TextField, IconButton, Paper, Stack, CircularProgress, Backdrop } from '@mui/material';
import { Send, Close } from '@mui/icons-material';
import { GoogleGenAI } from "@google/genai";
import { projectSchema } from '../lib/geminiSchema';

interface GeminiChatProps {
    open: boolean;
    onClose: () => void;
    onProjectGenerated: (projectData: any) => void;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '700px',
  height: '85vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column'
};

const AITypingIndicator = () => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{p: 1.5, pl: 2}}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">AI is thinking...</Typography>
    </Stack>
);

const GeminiChat: React.FC<GeminiChatProps> = ({ open, onClose, onProjectGenerated }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [ai, setAi] = useState<GoogleGenAI | null>(null);

    useEffect(() => {
        const apiKey = process.env.API_KEY;
        if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            try {
                setAi(new GoogleGenAI({ apiKey }));
            } catch (error) {
                console.error('Failed to initialize GoogleGenAI:', error);
                setAi(null);
            }
        }
    }, []);

    useEffect(() => {
        if (open) {
            setMessages([{ sender: 'ai', text: "Hello! Describe the website you'd like to create. For example, 'a portfolio for a photographer' or 'a landing page for a new mobile app'." }]);
            setInput('');
            setIsLoading(false);
        }
    }, [open]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userMessage.text,
                config: {
                    systemInstruction: "You are an expert web designer. Based on the user's request, generate the JSON structure for a complete website project. The project should contain multiple pages, each with relevant components and content. Ensure the design is modern and user-friendly. Adhere strictly to the provided JSON schema. Ensure all element IDs are unique strings.",
                    responseMimeType: "application/json",
                    responseSchema: projectSchema,
                },
            });
            
            let jsonText = response.text.trim();
            // Handle cases where the AI might wrap the JSON in markdown code blocks
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.substring(7, jsonText.length - 3).trim();
            } else if (jsonText.startsWith('```')) {
                 jsonText = jsonText.substring(3, jsonText.length - 3).trim();
            }

            const generatedProject = JSON.parse(jsonText);
            
            onProjectGenerated(generatedProject);

            setMessages(prev => [...prev, { sender: 'ai', text: `I've created the project "${generatedProject.name}". The modal will close now.`}]);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error("Error generating project:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again or rephrase your request.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Box sx={modalStyle}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" component="h2">Create a Project with AI</Typography>
                    <IconButton onClick={onClose} aria-label="close chat"><Close /></IconButton>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    <Stack spacing={2}>
                        {messages.map((msg, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {msg.text}
                            </Paper>
                        ))}
                        {isLoading && <AITypingIndicator />}
                        <div ref={chatEndRef} />
                    </Stack>
                </Box>
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            placeholder="Type your message..."
                            variant="outlined"
                            size="small"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            disabled={isLoading}
                        />
                        <IconButton color="primary" onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default GeminiChat;
