
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
        customClass: { type: Type.STRING },
        xs: { type: Type.INTEGER },
        sm: { type: Type.INTEGER },
        md: { type: Type.INTEGER },
        lg: { type: Type.INTEGER },
        content: { type: Type.STRING },
        fontSize: { type: Type.STRING },
        fontWeight: { type: Type.STRING },
        color: { type: Type.STRING },
        text: { type: Type.STRING },
        variant: { type: Type.STRING },
        src: { type: Type.STRING },
        alt: { type: Type.STRING },
        height: { type: Type.NUMBER },
        placeholder: { type: Type.STRING },
        inputType: { type: Type.STRING },
        multiline: { type: Type.BOOLEAN },
        rows: { type: Type.INTEGER },
        spacing: { type: Type.NUMBER },
        columns: { type: Type.INTEGER },
        alignItems: { type: Type.STRING },
        justifyContent: { type: Type.STRING },
        summaryText: { type: Type.STRING },
        message: { type: Type.STRING },
        severity: { type: Type.STRING },
        href: { type: Type.STRING },
        dense: { type: Type.BOOLEAN },
        value: { type: Type.NUMBER },
        checked: { type: Type.BOOLEAN },
    },
};

const elementSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for this element." },
        name: { type: Type.STRING, description: "A human-readable name for the element." },
        type: { type: Type.STRING, enum: Object.values(ElementType), description: "The type of the element." },
        props: propsSchema
    },
    required: ["id", "name", "type", "props"]
};

const pageSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the page, e.g., 'Home' or 'About Us'." },
        rootElementId: { type: Type.STRING, description: "The ID of the root element for this page." },
        elements: {
            type: Type.ARRAY,
            description: "An array of all element objects that make up this page.",
            items: elementSchema,
        }
    },
    required: ["name", "rootElementId", "elements"]
};

export const projectSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the website project." },
        description: { type: Type.STRING, description: "A brief description of the project." },
        pages: {
            type: Type.ARRAY,
            description: "An array of page objects that make up the website.",
            items: pageSchema
        }
    },
    required: ["name", "description", "pages"]
};