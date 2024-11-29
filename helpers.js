const Jimp = require("jimp");

const isImageAndTransform = async (inputPath, outputPath) => {
    try {
        const image = await Jimp.read(inputPath);  
         console.log(image);
        image.resize(250, 250); 
        await image.writeAsync(outputPath);  
          console.log(outputPath);
        return true;
    } catch (err) {
         console.error(err);
        return false;
    }
}

module.exports = { isImageAndTransform };