import json

class ModelProvisioningHelper:
    """
    A ComfyUI node that allows users to input model metadata via a UI.
    No output is provided.
    """
    # Define no outputs
    RETURN_TYPES = ()
    FUNCTION = "execute"
    CATEGORY = "utils"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "hidden": {
                "models_data": "STRING"  # Stores serialized JSON from the frontend
            }
        }

    def execute(self, models_data):
        # Parse the JSON string back into a list of dicts
        try:
            models = json.loads(models_data) if models_data else []
        except json.JSONDecodeError:
            models = []
        
        # Here you could add logic to save 'models' to a file, database, etc.
        # For now, it just processes the input.
        
        # Return empty tuple to indicate no output
        return ()

# Register the node
NODE_CLASS_MAPPINGS = {
    "ModelProvisioningHelper": ModelProvisioningHelper
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ModelProvisioningHelper": "Model Provisioning Helper"
}

# Tell ComfyUI where to find the JavaScript files
WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
