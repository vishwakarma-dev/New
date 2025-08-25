
import { Type } from "@google/genai";
import { ElementType } from "../types";

const propsSchema = {
    type: Type.OBJECT,
    properties: {
        children: { type: Type.ARRAY, items: { type: Type.STRING } },
        direction: { type: Type.STRING },
        justify: { type: Type.STRING },
        align: { type: Type.STRING },
        gap: { type: Type.NUMBER },
        padding: { type: Type.NUMBER },
        backgroundColor: { type: Type.STRING },
        borderRadius: { type: Type.NUMBER },
        shadow: { type: Type.NUMBER },
        content: { type: Type.STRING },
        fontSize: { type: Type.STRING },
        fontWeight: { type: Type.STRING },
        color: { type: Type.STRING },
        text: { type: Type.STRING },
        variant: { type: Type.STRING },
    },
};

const updateElementPropAction = {
    type: Type.OBJECT,
    properties: {
        actionName: { type: Type.STRING, enum: ["updateElementProp"] },
        payload: {
            type: Type.OBJECT,
            properties: {
                elementId: { type: Type.STRING, description: "The ID of the element to update." },
                prop: { type: Type.STRING, description: "The name of the property to update." },
                value: { type: Type.ANY, description: "The new value for the property." },
            },
            required: ["elementId", "prop", "value"]
        }
    },
    required: ["actionName", "payload"]
};

const addElementAction = {
    type: Type.OBJECT,
    properties: {
        actionName: { type: Type.STRING, enum: ["addElement"] },
        payload: {
            type: Type.OBJECT,
            properties: {
                parentId: { type: Type.STRING, description: "The ID of the container element to add the new element to." },
                elementType: { type: Type.STRING, enum: Object.values(ElementType), description: "The type of the new element to add." },
                index: { type: Type.INTEGER, description: "The position to insert the new element at in the parent's children array." },
                props: { ...propsSchema, description: "Optional initial props for the new element." }
            },
            required: ["parentId", "elementType"]
        }
    },
    required: ["actionName", "payload"]
};

const deleteElementAction = {
    type: Type.OBJECT,
    properties: {
        actionName: { type: Type.STRING, enum: ["deleteElement"] },
        payload: {
            type: Type.OBJECT,
            properties: {
                elementId: { type: Type.STRING, description: "The ID of the element to delete." }
            },
            required: ["elementId"]
        }
    },
    required: ["actionName", "payload"]
};

const selectElementAction = {
    type: Type.OBJECT,
    properties: {
        actionName: { type: Type.STRING, enum: ["selectElement"] },
        payload: {
            type: Type.OBJECT,
            properties: {
                elementId: { type: Type.STRING, description: "The ID of the element to select in the editor." }
            },
            required: ["elementId"]
        }
    },
    required: ["actionName", "payload"]
};


export const aiActionSchema = {
    type: Type.OBJECT,
    properties: {
        actions: {
            type: Type.ARRAY,
            description: "A list of actions to perform on the editor canvas.",
            items: {
                oneOf: [
                    updateElementPropAction,
                    addElementAction,
                    deleteElementAction,
                    selectElementAction
                ]
            }
        }
    },
    required: ["actions"]
};
