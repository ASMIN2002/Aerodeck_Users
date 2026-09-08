const createImage = (url) => {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.addEventListener(
            "load",
            () => resolve(image)
        );

        image.addEventListener(
            "error",
            (error) => reject(error)
        );

        image.setAttribute(
            "crossOrigin",
            "anonymous"
        );

        image.src = url;

    });

};


// ============================================
// GET CROPPED IMAGE
// ============================================

const getCroppedImage = async (
    imageSrc,
    pixelCrop
) => {

    const image = await createImage(imageSrc);


    // Create canvas
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");


    // High quality support
    const pixelRatio =
        window.devicePixelRatio || 1;


    // Set final canvas size
    canvas.width =
        pixelCrop.width * pixelRatio;

    canvas.height =
        pixelCrop.height * pixelRatio;


    // Scale canvas for high resolution
    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    ctx.imageSmoothingQuality = "high";


    // Draw ONLY cropped area
    ctx.drawImage(

        image,

        pixelCrop.x,
        pixelCrop.y,

        pixelCrop.width,
        pixelCrop.height,

        0,
        0,

        pixelCrop.width,
        pixelCrop.height

    );


    // Convert canvas to Blob
    return new Promise((resolve, reject) => {

        canvas.toBlob(

            (blob) => {

                if (!blob) {

                    reject(
                        new Error(
                            "Failed to create cropped image"
                        )
                    );

                    return;
                }

                resolve(blob);

            },

            "image/jpeg",

            0.95

        );

    });

};


export default getCroppedImage;
