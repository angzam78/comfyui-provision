/**
 * Extension Name: ComfyUI Context Menu - Set Model Download URL
 * Author: Peer Collaborator
 * Description: Adds a context menu item ("🔗 Set Download URL...") to all ComfyUI nodes.
 *              This allows you to attach a direct download URL directly into the node's 
 *              internal 'properties' object. When the workflow is saved, exported, or
 *              embedded into a PNG, this metadata travels with it. The extension 
 *              'ComfyUI-Workflow-Models-Downloader' reads this property to auto-resolve 
 *              and download missing models instantly.
 * 
 * Installation Instructions:
 * 1. Navigate to your ComfyUI installation directory.
 * 2. Go to the web extensions folder: `ComfyUI/web/extensions/`
 * 3. Create a new file named `add_download_url.js`
 * 4. Paste this entire code block into that file and save it.
 * 5. Refresh your ComfyUI browser tab (No command-line restart required!).
 */

import { app } from "../scripts/app.js";

app.registerExtension({
    name: "Custom.AddDownloadURL",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Intercept and store the native context menu generator function
        const originalGetExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
        
        // Override the context menu rendering to inject our custom button
        nodeType.prototype.getExtraMenuOptions = function(canvas, options) {
            // Execute the original context menu items first so we don't break other nodes
            if (originalGetExtraMenuOptions) {
                originalGetExtraMenuOptions.apply(this, arguments);
            }

            // Push our custom interactive item to the bottom of the right-click menu list
            options.push({
                content: "🔗 Set Download URL...",
                callback: () => {
                    // Pull the existing URL if one is already saved, default to empty string
                    const currentUrl = this.properties?.url || "";
                    
                    // Trigger a native browser prompt text box for the user
                    const url = prompt("Enter the direct download URL for this model node:", currentUrl);
                    
                    // If the user didn't hit 'Cancel'
                    if (url !== null) {
                        // Initialize the properties object if it doesn't exist yet on this node
                        this.properties = this.properties || {};
                        
                        // Clean whitespace and bind the URL directly to the node data layer
                        this.properties.url = url.trim();
                        
                        // Mark the canvas as modified so ComfyUI knows there are changes to save
                        app.canvas.setDirtyCanvas(true, true);
                        
                        console.log(`[Metadata Injection] Attached URL to Node ID ${this.id}: ${this.properties.url}`);
                    }
                }
            });
        };
    }
});
