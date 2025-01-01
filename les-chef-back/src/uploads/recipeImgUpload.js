const multer = require('multer');
const path = require('path');

const categoryTrans = (category) => {
    switch (category) {
        case '한식':
            return 'korean';
        case '일식':
            return 'japanese';
        case '중식':
            return 'chinese';
        case '양식':
            return 'western';
        case '기타':    
            return 'other';
        default:
            break;
    }
}

const generateUniqueFileName = (originalName) => {
    const extensionIndex = originalName.lastIndexOf('.');
    const fileName = originalName.substring(0, extensionIndex);
    const fileExtension = originalName.substring(extensionIndex);
    
    return `${fileName}-${Date.now()}${fileExtension}`;
};

// const recipeImgStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const recipeInfo = JSON.parse(req.body.recipeInfo);
//         const { majorCategory } = recipeInfo;
//         const category = categoryTrans(majorCategory);
//         cb(null, path.join(__dirname, `../../public/Image/RecipeImage/ListImg/${category}`));
//     },
//     filename: function (req, file, cb) {
//         const recipeInfo = JSON.parse(req.body.recipeInfo);
//         const { majorCategory } = recipeInfo;
//         const category = categoryTrans(majorCategory);
//         const uniqueName = generateUniqueFileName(file.originalname);
        
//         cb(null, uniqueName);
//         file.newPath = `/Image/RecipeImage/ListImg/${category}/${uniqueName}`
//         console.log('에러확인1');
//     }
// });

// const recipeStepImgStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const recipeInfo = JSON.parse(req.body.recipeInfo);
//         const { majorCategory } = recipeInfo;
//         const category = categoryTrans(majorCategory);

//         cb(null, path.join(__dirname, `../../public/Image/RecipeImage/InfoImg/step/${category}`)); 
//     },
//     filename: function (req, file, cb) {
//         const recipeInfo = JSON.parse(req.body.recipeInfo);
//         const { majorCategory } = recipeInfo;
//         const category = categoryTrans(majorCategory);
//         const uniqueName = generateUniqueFileName(file.originalname);

//         file.newPath = `/Image/RecipeImage/InfoImg/step/${category}/${uniqueName}`;
//         cb(null, uniqueName);
//         console.log('에러확인2');
//     }
// });

// const recipeImgUpload = multer({ storage: recipeImgStorage }).single('recipeImgFile');
// const recipeStepImgUpload = multer({ storage: recipeStepImgStorage }).array('recipeStepImgFiles');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const recipeInfo = JSON.parse(req.body.recipeInfo);
            const { majorCategory } = recipeInfo;
            const category = categoryTrans(majorCategory);

            if (file.fieldname === 'recipeImgFile') {
                cb(null, path.join(__dirname, `../../public/Image/RecipeImage/ListImg/${category}`));
            } else if (file.fieldname === 'recipeStepImgFiles') {
                cb(null, path.join(__dirname, `../../public/Image/RecipeImage/InfoImg/step/${category}`));
            }
        },
        filename: function (req, file, cb) {
            const recipeInfo = JSON.parse(req.body.recipeInfo);
            const { majorCategory } = recipeInfo;
            const category = categoryTrans(majorCategory);
            const uniqueName = Buffer.from(generateUniqueFileName(file.originalname), "latin1").toString("utf8");

            if (file.fieldname === 'recipeImgFile') {
                file.newPath = `/Image/RecipeImage/ListImg/${category}/${uniqueName}`;
            } else if (file.fieldname === 'recipeStepImgFiles') {
                file.newPath = `/Image/RecipeImage/InfoImg/step/${category}/${uniqueName}`;
            }

            cb(null, uniqueName);
        }
    })
}).fields([
    { name: 'recipeImgFile', maxCount: 1 },
    { name: 'recipeStepImgFiles', maxCount: 10 }
]);

module.exports = { upload };