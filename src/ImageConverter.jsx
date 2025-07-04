import { useState } from 'react';
import JSZip from 'jszip';

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
                if (blob) resolve(blob);
                else reject(new Error('Conversion failed'));
            }, `image/${format}`, quality);
        };

        img.onerror = () => reject(new Error('Image loading failed'));
        img.src = URL.createObjectURL(image);
   });
}

// I don't like how this works. 
// Find a way to pass the blobs and the image names to the zip creation function.
function createZipFile(blobsData) {
    return new Promise((resolve, reject) => {
        const zip = new JSZip();
        const promises = blobsData.map(({ blob, name }) => zip.file(name, blob));
        Promise.all(promises)
            .then(() => zip.generateAsync({ type: 'blob' }))
            .then(zipBlob => resolve(zipBlob))
            .catch(error => reject(error));
    });
}

function ImageConverterForm() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [format, setFormat] = useState('webp');
    const [quality, setQuality] = useState(0.8); 
    const [result, setResult] = useState([]);
    const [zipFile, setZipFile] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [convertedCount, setConvertedCount] = useState(0);

    const handleFormatChange = (event) => setFormat(event.target.value);
    const handleQualityChange = (event) => setQuality(event.target.value);
    const handleFileChange = (event) => setSelectedImages(event.target.files);

    function resetForm() {
        setResult([]);
        setZipFile(null);
        setError(null);
        setIsLoading(false);
        setConvertedCount(0);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        resetForm();

        if (selectedImages.length === 0) {
            setError('Please select at least one image.');
            return;
        } 

        const resultArray = []; // Hold the image URLs when ready for downloading
        const blobsArray = []; // Array to hold blobs for ZIP file creation

        for (const image of selectedImages) {
            try {
                // Convert and get a downloadable URL
                const convertedBlob = await convertImage(image, format, quality);
                const url = URL.createObjectURL(convertedBlob);
                const download = `${image.name.split('.')[0]}.${format}`;

                resultArray.push({ url, name: download });
                blobsArray.push({ blob: convertedBlob, name: download });

                setConvertedCount(prevCount => prevCount + 1);
            } catch (error) {
                console.error('Error converting image:', error);
                setError(`Error converting ${image.name}: ${error.message}`);
                continue;
            }
        }
        setResult(resultArray);

        // Create a ZIP file, if possible
        if (resultArray.length > 0) {
            try {
                const zipBlob = await createZipFile(blobsArray);
                setZipFile(URL.createObjectURL(zipBlob));

            } catch (error) {
                console.error('Error creating ZIP file:', error);
                setError(`Error creating ZIP file: ${error.message}`);
            }
        }

        setIsLoading(false);
    }

    return (
    <>
    <form onSubmit={ handleSubmit } id="image-converter-form" className="flex flex-col gap-4 m-auto ">
        <fieldset>
            <label htmlFor="image-input" className="btn btn-secondary text-center mb-4">Select Images (JPEG, PNG, WEBP)</label>
            <input className="hidden" type="file" id="image-input" accept="image/*" multiple 
                onChange={ handleFileChange }
            />
            <p className="text-center">Selected {selectedImages.length} images</p>
        </fieldset>

        <fieldset>
            <label htmlFor="quality-range">Quality (0.0 - 1.0):</label>
            <input type="number" id="quality-range" class='ml-4' min="0" max="1" step="0.1" 
                defaultValue={ quality } 
                onChange={ handleQualityChange }
            />
        </fieldset>
        
        <fieldset>
            <label htmlFor="format-select">Select Output Format:</label>
            <select id="format-select" className="ml-4" 
                onChange={ handleFormatChange } 
                value={ format }
            >
                <option value="webp">WEBP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
            </select>
        </fieldset>

        <input type="submit" className='btn w-64 m-auto mb-4' value="Convert"/>
    </form>


    <div id="result" className="flex flex-col justify-center">
        {isLoading && <p>Loading...</p>}

        {convertedCount > 0 && <p>Converted {convertedCount} images</p>}

        {zipFile && (
            <a href={zipFile} download="converted_images.zip" className='btn btn-action mb-4'>Download ZIP File</a>
        )}

        <div className="results-gallery flex flex-wrap m-auto gap-4">
            {result.length > 0 && result.map((item, index) => (
                <a key={index} href={item.url} download={item.name} className='block text-center'>
                    {item.name}
                    <img src={item.url} alt={item.name} className='m-auto w-64 aspect-square object-cover'/>
                </a>
            ))}
        </div>
        
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
    
    </>
    )
}

function ImageConverter() {

    return (
    <>
        <h1>Image Converter</h1>
        <ImageConverterForm />
    </>
    );
}

export default ImageConverter;