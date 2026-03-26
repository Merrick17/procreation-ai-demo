import axios from "axios";

const COMFYUI_BASE_URL = process.env.COMFYUI_BASE_URL || "http://localhost:8188";

export const submitComfyJob = async (prompt: Record<string, unknown>) => {
  try {
    const response = await axios.post(`${COMFYUI_BASE_URL}/prompt`, {
      prompt: prompt,
    });
    return response.data.prompt_id;
  } catch (error) {
    console.error("ComfyUI Submit Error:", error);
    throw error;
  }
};

export const getComfyJobStatus = async (promptId: string) => {
  try {
    const response = await axios.get(`${COMFYUI_BASE_URL}/history/${promptId}`);
    const history = response.data[promptId];
    if (history) {
      return { status: "DONE", outputs: history.outputs };
    }
    return { status: "PENDING" };
  } catch (error) {
    console.error("ComfyUI Status Error:", error);
    throw error;
  }
};

export const getComfyImageUrl = (filename: string, subfolder: string, type: string) => {
  return `${COMFYUI_BASE_URL}/view?filename=${filename}&subfolder=${subfolder}&type=${type}`;
};
