import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "ModelProvisioningHelper",

    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "ModelProvisioningHelper") return;

        // Initialize default state
        nodeType.prototype.onAdded = function() {
            this.models = [];
            this.updateModelsUI();
        };

        // Build the UI dynamically based on current models list
        nodeType.prototype.updateModelsUI = function() {
            // 1. Clear ALL widgets completely to prevent stale bindings
            this.widgets = [];

            // 2. Rebuild widgets based on the CURRENT state of this.models
            this.models.forEach((model, index) => {
                const prefix = `model_${index}_`;
                
                // Name Input
                this.addWidget("text", `${prefix}name`, model.name, 
                    (v) => { this.models[index].name = v; }, 
                    { serialize: false }
                );
                
                // URL Input
                this.addWidget("text", `${prefix}url`, model.url, 
                    (v) => { this.models[index].url = v; }, 
                    { serialize: false }
                );
                
                // Directory Input
                this.addWidget("text", `${prefix}dir`, model.directory, 
                    (v) => { this.models[index].directory = v; }, 
                    { serialize: false }
                );

                // Remove Button
                // 'name' is the label shown on the button
                this.addWidget("button", "🗑️", null, () => {
                    // Remove from data array
                    this.models.splice(index, 1);
                    // Rebuild UI to re-index everything correctly
                    this.updateModelsUI();
                    this.onSerializeChanged();
                });
            });

            // Add "Add Model" button at the bottom
            this.addWidget("button", "➕ Add Model", null, () => {
                this.models.push({ name: "", url: "", directory: "" });
                this.updateModelsUI();
                this.onSerializeChanged();
            });
        };

        // Hook into serialization to save state to workflow JSON
        const originalSerialize = nodeType.prototype.serialize;
        nodeType.prototype.serialize = function(data) {
            const result = originalSerialize.call(this, data);
            
            // Save to inputs.models_data
            if (!result.inputs) result.inputs = {};
            result.inputs.models_data = JSON.stringify(this.models);
            
            return result;
        };

        // Hook into loading to restore state from workflow JSON
        const originalLoadGraphData = nodeType.prototype.onLoadGraphData;
        nodeType.prototype.onLoadGraphData = function(data) {
            if (data.inputs?.models_data) {
                try {
                    this.models = JSON.parse(data.inputs.models_data);
                } catch (e) {
                    this.models = [];
                }
            } else {
                this.models = [];
            }
            this.updateModelsUI();
            
            return originalLoadGraphData.call(this, data);
        };
    }
});
