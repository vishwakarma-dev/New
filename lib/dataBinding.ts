import { DataSource, EditorElement } from '../types';

// Data binding utilities for advanced components
export interface DataBinding {
  sourceId: string;
  field: string;
  transform?: (value: any) => any;
  format?: string;
}

export interface ComponentDataBinding {
  elementId: string;
  bindings: { [propKey: string]: DataBinding };
}

export class DataBindingManager {
  private bindings: Map<string, ComponentDataBinding> = new Map();
  private dataSources: Map<string, DataSource> = new Map();

  // Register a data source
  registerDataSource(dataSource: DataSource) {
    this.dataSources.set(dataSource.id, dataSource);
  }

  // Remove a data source
  removeDataSource(sourceId: string) {
    this.dataSources.delete(sourceId);
    // Remove all bindings that reference this data source
    this.bindings.forEach((binding, elementId) => {
      const updatedBindings = { ...binding.bindings };
      let hasChanges = false;
      
      Object.keys(updatedBindings).forEach(prop => {
        if (updatedBindings[prop].sourceId === sourceId) {
          delete updatedBindings[prop];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        if (Object.keys(updatedBindings).length === 0) {
          this.bindings.delete(elementId);
        } else {
          this.bindings.set(elementId, { ...binding, bindings: updatedBindings });
        }
      }
    });
  }

  // Bind a component property to a data source field
  bindProperty(
    elementId: string, 
    propKey: string, 
    sourceId: string, 
    field: string,
    transform?: (value: any) => any,
    format?: string
  ) {
    const existingBinding = this.bindings.get(elementId) || { elementId, bindings: {} };
    
    existingBinding.bindings[propKey] = {
      sourceId,
      field,
      transform,
      format
    };

    this.bindings.set(elementId, existingBinding);
  }

  // Unbind a component property
  unbindProperty(elementId: string, propKey: string) {
    const binding = this.bindings.get(elementId);
    if (binding && binding.bindings[propKey]) {
      delete binding.bindings[propKey];
      
      if (Object.keys(binding.bindings).length === 0) {
        this.bindings.delete(elementId);
      } else {
        this.bindings.set(elementId, binding);
      }
    }
  }

  // Get all bindings for an element
  getElementBindings(elementId: string): ComponentDataBinding | undefined {
    return this.bindings.get(elementId);
  }

  // Get resolved data for an element
  getElementData(elementId: string): { [propKey: string]: any } {
    const binding = this.bindings.get(elementId);
    if (!binding) return {};

    const resolvedData: { [propKey: string]: any } = {};

    Object.entries(binding.bindings).forEach(([propKey, dataBinding]) => {
      const dataSource = this.dataSources.get(dataBinding.sourceId);
      if (dataSource && dataSource.data && dataSource.status === 'success') {
        let value = this.getNestedValue(dataSource.data, dataBinding.field);
        
        if (dataBinding.transform) {
          value = dataBinding.transform(value);
        }

        if (dataBinding.format && typeof value === 'string') {
          value = this.formatValue(value, dataBinding.format);
        }

        resolvedData[propKey] = value;
      }
    });

    return resolvedData;
  }

  // Apply data bindings to element props
  applyBindings(element: EditorElement): EditorElement {
    const boundData = this.getElementData(element.id);
    if (Object.keys(boundData).length === 0) {
      return element;
    }

    return {
      ...element,
      props: {
        ...element.props,
        ...boundData
      }
    };
  }

  // Get all elements that use a specific data source
  getElementsUsingDataSource(sourceId: string): string[] {
    const elements: string[] = [];
    
    this.bindings.forEach((binding, elementId) => {
      const usesSource = Object.values(binding.bindings).some(
        dataBinding => dataBinding.sourceId === sourceId
      );
      if (usesSource) {
        elements.push(elementId);
      }
    });

    return elements;
  }

  // Get available fields from a data source
  getDataSourceFields(sourceId: string): string[] {
    const dataSource = this.dataSources.get(sourceId);
    if (!dataSource || !dataSource.data) return [];

    return this.extractFields(dataSource.data);
  }

  // Helper to extract nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  // Helper to format values
  private formatValue(value: string, format: string): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(parseFloat(value));
      case 'percentage':
        return `${parseFloat(value)}%`;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'capitalize':
        return value.charAt(0).toUpperCase() + value.slice(1);
      default:
        return value;
    }
  }

  // Helper to extract field names from data object
  private extractFields(obj: any, prefix = ''): string[] {
    const fields: string[] = [];
    
    if (Array.isArray(obj)) {
      if (obj.length > 0) {
        return this.extractFields(obj[0], prefix);
      }
      return fields;
    }

    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Nested object - recursively get fields
          fields.push(...this.extractFields(value, fieldPath));
        } else {
          // Primitive value or array
          fields.push(fieldPath);
        }
      });
    }

    return fields;
  }

  // Export bindings for serialization
  exportBindings(): ComponentDataBinding[] {
    return Array.from(this.bindings.values());
  }

  // Import bindings from serialized data
  importBindings(bindings: ComponentDataBinding[]) {
    this.bindings.clear();
    bindings.forEach(binding => {
      this.bindings.set(binding.elementId, binding);
    });
  }
}

// State management helpers for advanced components
export interface ComponentState {
  elementId: string;
  state: { [key: string]: any };
}

export class StateManager {
  private states: Map<string, { [key: string]: any }> = new Map();
  private listeners: Map<string, ((state: any) => void)[]> = new Map();

  // Set state for a component
  setState(elementId: string, newState: { [key: string]: any }) {
    const currentState = this.states.get(elementId) || {};
    const updatedState = { ...currentState, ...newState };
    
    this.states.set(elementId, updatedState);
    this.notifyListeners(elementId, updatedState);
  }

  // Get state for a component
  getState(elementId: string): { [key: string]: any } {
    return this.states.get(elementId) || {};
  }

  // Subscribe to state changes
  subscribe(elementId: string, listener: (state: any) => void): () => void {
    const elementListeners = this.listeners.get(elementId) || [];
    elementListeners.push(listener);
    this.listeners.set(elementId, elementListeners);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(elementId) || [];
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(elementId, listeners);
      }
    };
  }

  // Notify listeners of state changes
  private notifyListeners(elementId: string, state: any) {
    const listeners = this.listeners.get(elementId) || [];
    listeners.forEach(listener => listener(state));
  }

  // Clear state for element
  clearState(elementId: string) {
    this.states.delete(elementId);
    this.listeners.delete(elementId);
  }

  // Export state for serialization
  exportState(): ComponentState[] {
    const states: ComponentState[] = [];
    this.states.forEach((state, elementId) => {
      states.push({ elementId, state });
    });
    return states;
  }

  // Import state from serialized data
  importState(states: ComponentState[]) {
    this.states.clear();
    this.listeners.clear();
    states.forEach(({ elementId, state }) => {
      this.states.set(elementId, state);
    });
  }
}

// Component interaction handlers
export const createInteractionHandlers = (stateManager: StateManager) => ({
  // Handle form submissions
  handleFormSubmit: (elementId: string, formData: FormData) => {
    const data: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    stateManager.setState(elementId, { formData: data, lastSubmitted: Date.now() });
  },

  // Handle input changes
  handleInputChange: (elementId: string, field: string, value: any) => {
    const currentState = stateManager.getState(elementId);
    stateManager.setState(elementId, {
      ...currentState,
      [field]: value
    });
  },

  // Handle selection changes
  handleSelectionChange: (elementId: string, selection: any) => {
    stateManager.setState(elementId, { selectedValue: selection });
  },

  // Handle tab changes
  handleTabChange: (elementId: string, activeTab: number) => {
    stateManager.setState(elementId, { activeTab });
  },

  // Handle modal open/close
  handleModalToggle: (elementId: string, isOpen: boolean) => {
    stateManager.setState(elementId, { isOpen });
  },

  // Handle stepper navigation
  handleStepperNext: (elementId: string) => {
    const currentState = stateManager.getState(elementId);
    const currentStep = currentState.activeStep || 0;
    stateManager.setState(elementId, { activeStep: currentStep + 1 });
  },

  handleStepperPrev: (elementId: string) => {
    const currentState = stateManager.getState(elementId);
    const currentStep = currentState.activeStep || 0;
    stateManager.setState(elementId, { activeStep: Math.max(0, currentStep - 1) });
  }
});

// Default data binding manager instance
export const dataBindingManager = new DataBindingManager();
export const stateManager = new StateManager();
export const interactionHandlers = createInteractionHandlers(stateManager);
