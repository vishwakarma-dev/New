import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Stack, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { GoogleGenAI } from "@google/genai";
import { aiActionSchema } from '../../lib/aiActionSchema';
import { Page, AnyElementPropKey, EditorElement, ElementType } from '../../types';
import { AVAILABLE_COMPONENTS } from '../../constants';

interface AiChatPanelProps {
    page: Page;
    selectedElementId: string | null;
    onUpdateElementProp: (elementId: string, prop: AnyElementPropKey, value: any) => void;
    onDeleteElement: (elementId: string) => void;
    onAddElement: (parentId: string, element: EditorElement, index: number) => void;
    onSelectElement: (id: string) => void;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AITypingIndicator = () => (
    <Stack direction="row" spacing={1} alignItems="center">
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">AI is thinking...</Typography>
    </Stack>
);

const AiChatPanel: React.FC<AiChatPanelProps> = (props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKeyError, setApiKeyError] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Check if API key is available
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    let ai: GoogleGenAI | null = null;

    try {
        if (apiKey && apiKey !== 'DEMO_KEY_PLEASE_CONFIGURE') {
            ai = new GoogleGenAI({ apiKey });
        } else {
            setApiKeyError(true);
        }
    } catch (error) {
        console.error('Error initializing Google GenAI:', error);
        setApiKeyError(true);
    }

    // Set initial message based on API key availability
    useEffect(() => {
        if (apiKeyError) {
            setMessages([{
                sender: 'ai',
                text: "🤖 AI Assistant Setup Required\n\nTo enable AI features, you need a Google Gemini API key:\n\n1. Visit https://aistudio.google.com/app/apikey\n2. Create a new API key\n3. Set the GEMINI_API_KEY environment variable\n4. Restart the development server\n\nOnce configured, I'll help you build your website with natural language commands!"
            }]);
        } else {
            setMessages([{
                sender: 'ai',
                text: "Hello! I'm your AI assistant. Tell me what you'd like to change. \n\nFor example: 'Add a button' or 'Change the selected text to Hello World'."
            }]);
        }
    }, [apiKeyError]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
    // Function to simplify the page structure for the AI prompt
    const getPageContext = () => {
        const simplifiedElements = Object.values(props.page.elements).map(el => ({
            id: el.id,
            name: el.name,
            type: el.type,
            children: (el.props as any).children || [],
        }));

        return JSON.stringify({
            currentPageId: props.page.id,
            selectedElementId: props.selectedElementId,
            elements: simplifiedElements
        });
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Check if AI is available
        if (!ai || apiKeyError) {
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: 'AI Assistant is not available. Please configure the GEMINI_API_KEY environment variable.'
            }]);
            setIsLoading(false);
            return;
        }

        try {
            const pageContext = getPageContext();
            const prompt = `
                Page Context:
                ${pageContext}
                
                User Request: "${userMessage.text}"

                Based on the context and the user request, generate a JSON object with a list of actions to perform.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: "You are an expert web design assistant integrated into a no-code website builder. Your task is to translate user requests into a structured series of actions based on the provided JSON schema. You can add, update, and delete elements. Always use the `selectedElementId` from the context if the user refers to 'the selected element' or 'this item'. If a user wants to add an element but doesn't specify where, add it to the `selectedElementId` if it's a container, otherwise add it to the root element. Ensure all new element IDs are unique using `el-` followed by the current timestamp.",
                    responseMimeType: "application/json",
                    responseSchema: aiActionSchema,
                },
            });
            
            let jsonText = response.text.trim();
             if (jsonText.startsWith('```json')) {
                jsonText = jsonText.substring(7, jsonText.length - 3).trim();
            }

            const result = JSON.parse(jsonText) as { actions: any[] };

            if (result.actions && result.actions.length > 0) {
                 result.actions.forEach(action => {
                    const { actionName, payload } = action;
                    switch(actionName) {
                        case 'updateElementProp':
                            props.onUpdateElementProp(payload.elementId, payload.prop, payload.value);
                            break;
                        case 'addElement':
                            const componentDefinition = AVAILABLE_COMPONENTS.find(c => c.type === payload.elementType);
                            if (componentDefinition) {
                                const newElement: EditorElement = {
                                    id: `el-${Date.now()}`,
                                    name: componentDefinition.name,
                                    type: payload.elementType,
                                    props: { ...componentDefinition.defaultProps, ...payload.props },
                                };
                                props.onAddElement(payload.parentId, newElement, payload.index ?? 999);
                            }
                            break;
                        case 'deleteElement':
                            props.onDeleteElement(payload.elementId);
                            break;
                        case 'selectElement':
                            props.onSelectElement(payload.elementId);
                            break;
                        default:
                            console.warn(`Unknown AI action: ${actionName}`);
                    }
                });
                setMessages(prev => [...prev, { sender: 'ai', text: `Done! I've executed ${result.actions.length} action(s) for you.`}]);
            } else {
                 setMessages(prev => [...prev, { sender: 'ai', text: "I understood the request, but no specific actions were generated. Could you please rephrase?" }]);
            }

        } catch (error) {
            console.error("Error with AI assistant:", error);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
             <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <Stack spacing={2}>
                    {messages.map((msg, index) => (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: 3,
                                bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '90%',
                                ml: msg.sender === 'user' ? 'auto' : '0',
                                mr: msg.sender === 'user' ? '0' : 'auto',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            }}
                        >
                            {msg.text}
                        </Paper>
                    ))}
                    {isLoading && <AITypingIndicator />}
                    <div ref={chatEndRef} />
                </Stack>
            </Box>
            <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder={apiKeyError ? "AI Assistant unavailable" : "e.g., add a blue button"}
                        variant="outlined"
                        size="small"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        disabled={isLoading || apiKeyError}
                        sx={{
                             '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                            },
                        }}
                    />
                    <IconButton color="primary" onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
};

export default AiChatPanel;
