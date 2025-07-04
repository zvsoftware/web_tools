import react from 'react';
import { useEffect } from 'react';


function convertImage(image, format, quality = 0.8) {
   return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
            if (blob) {
                    resolve(blob);
            } else {
                    reject(new Error('Conversion failed'));
            }
            }, `image/${format}`, quality);
        };

        img.onerror = () => reject(new Error('Image loading failed'));
        img.src = URL.createObjectURL(image);
   });
}


function ImageConverter() {

    async function handleSubmit(event) {
        event.preventDefault();
        const images = event.target.elements['image-input'].files;
        const format = event.target.elements['format-select'].value;
        const quality = parseFloat(event.target.elements['quality-range'].value);

        for (const image of images) {
            try {
                const convertedBlob = await convertImage(image, format, quality);
                const url = URL.createObjectURL(convertedBlob);
                const resultDiv = document.getElementById('result');
                const link = document.createElement('a');
                link.href = url;
                link.download = `${image.name.split('.')[0]}.${format}`;
                link.textContent = `Download ${image.name} as ${format}`;
                resultDiv.appendChild(link);
                resultDiv.appendChild(document.createElement('br'));
            } catch (error) {
                resultDiv.innerHTML = `<p>Error converting ${image.name}: ${error.message}</p>`;
                console.error(error);
            }
        }
    }

    return (
    <>
        <h1>Image Converter</h1>
        <p>Convert images from one format to another.</p>


        <form id="image-converter-form" onSubmit={ handleSubmit }>
            <input type="file" id="image-input" accept="image/*" multiple/>
            <input type="number" id="quality-range" min="0" max="1" step="0.1" defaultValue="0.8"/>

            <select id="format-select">
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
            </select>
            <button type="submit">Convert</button>
        </form>
        <div id="result"></div>
    </>
    );
}

export default ImageConverter;