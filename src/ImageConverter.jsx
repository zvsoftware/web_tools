import react from 'react';
import { useEffect, useState } from 'react';


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

function ImageConverterForm() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [format, setFormat] = useState('jpeg');
    const [quality, setQuality] = useState(0.8); 
    const [result, setResult] = useState([]);
    const [error, setError] = useState(null);


    const handleFormatChange = (event) => setFormat(event.target.value);
    const handleQualityChange = (event) => setQuality(event.target.value);
    const handleFileChange = (event) => setSelectedImages(event.target.files);

    async function handleSubmit(event) {
        event.preventDefault();
        const resultArray = [];
        for (const image of selectedImages) {
            try {
                const convertedBlob = await convertImage(image, format, quality);
                const url = URL.createObjectURL(convertedBlob);
                const download = `${image.name.split('.')[0]}.${format}`;
                resultArray.push({ url, name: download });
            } catch (error) {
                console.error('Error converting image:', error);
                setError(`Error converting ${image.name}: ${error.message}`);
            }
        }

        setResult(resultArray);
    }

    return (
    <>
    <form id="image-converter-form" onSubmit={ handleSubmit }>
        <input type="file" id="image-input" accept="image/*" multiple 
            onChange={ handleFileChange }
        /><br/>

        <label htmlFor="quality-range">Quality (0.0 - 1.0):</label><br/>
        <input type="number" id="quality-range" min="0" max="1" step="0.1" 
            defaultValue={ quality } 
            onChange={ handleQualityChange }
        /><br/>
        
        <label htmlFor="format-select">Select Output Format:</label><br/>
        <select id="format-select" 
            onChange={ handleFormatChange } 
            value={ format }
        >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
        </select>

        <button type="submit">Convert</button>
    </form>
    <div id="result" class="flex flex-wrap m-auto gap-4">
        {result.length > 0 ? result.map((item, index) => (
            <a key={index} href={item.url} download={item.name} class='block text-center'>
                {item.name}
                <img src={item.url} alt={item.name} class='m-auto w-64 aspect-square object-cover'/>
            </a>
        )) : <p class="text-center m-auto">Select some images!</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
    </>
    )
}

function ImageConverter() {

    return (
    <>
        <h1>Image Converter</h1>
        <p>Convert images from one format to another.</p>
        <ImageConverterForm />
    </>
    );
}

export default ImageConverter;