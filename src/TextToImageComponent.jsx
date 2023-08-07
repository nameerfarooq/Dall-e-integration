import axios from "axios";
import React, { useEffect, useState } from "react";

const TextToImageComponent = () => {
  const [imageUrls, setImageUrls] = useState([]);

  const textToImage = async () => {
    const url =
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image";

    const headers = {
      Accept: "application/json",
      Authorization:
        "Bearer sk-aMcRl2qX0ZORayil29IhMdcvxkLZv7qYUV7uR4C5yjpPun16",
    };

    const body = {
      width: 512,
      height: 512,
      steps: 50,
      seed: 0,
      cfg_scale: 7,
      samples: 2,
      style_preset: "anime",
      text_prompts: [
        {
          text: "a bird in snow",
          weight: 1,
        },
      ],
    };

    try {
      const response = await axios.post(url, body, { headers });

      const urls = response.data.artifacts.map((image) => {
        const byteCharacters = atob(image.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });

        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(blob);
      });
      console.log(response, "data");

      setImageUrls(urls);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log(imageUrls, "images array");
  }, [imageUrls]);

  return (
    <div>
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Image ${index + 1}`} />
        ))
      ) : (
        <>
          <div>Generating images...</div>
          <button onClick={textToImage}>generate</button>
        </>
      )}
    </div>
  );
};

export default TextToImageComponent;
