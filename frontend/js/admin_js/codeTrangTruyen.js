const mongoose = require('mongoose');
const Comic = require('/backend/mongodb/models/comics_model'); // Đường dẫn đến model Comic
require('dotenv').config(); // Sử dụng thư viện dotenv để load các biến môi trường từ file .env

// Lấy URL của MongoDB từ file .env
const mongoUrl = process.env.MONGO_URL;

// Kết nối tới MongoDB sử dụng URL từ file .env
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Hàm lấy danh sách các truyện
async function getComics() {
    try {
        const comics = await Comic.find().lean().exec();
        return comics;
    } catch (error) {
        console.error('Error fetching comics:', error);
        return [];
    }
}

// Hàm tạo HTML từ dữ liệu truyện
function generateHTML(comics) {
    let html = '';
    comics.forEach(comic => {
        html += `
        <div class="col-md-6 col-lg-4 col-xl-3 p-2">
            <div class="collection-img position-relative">
                <img src="${comic.image}" class="w-100 img-fluid custom-img">
                <span class="position-absolute bg-primary text-white d-flex align-items-center justify-content-center">Hot</span>
            </div>
            <div class="text-center">
                <div class="rating mt-3">
                    ${generateRatingStars(comic.rating)}
                </div>
                <div class="text-center">
                    <p class="text-capitalize fw-bold">${comic.title}</p>
                    <span class="fw-bold d-block">
                        <a href="doc_ngay.html?comicId=${comic._id}" class="btn btn-primary mt-3">Đọc ngay</a>
                        <a href="#" class="btn btn-primary mt-3"><i class="fa-regular fa-heart"></i></a>
                    </span>
                </div>
            </div>
        </div>`;
    });
    return html;
}

// Hàm tạo rating sao
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<span class="text-primary"><i class="fas fa-star"></i></span>';
        } else {
            stars += '<span class="text-primary"><i class="fa-regular fa-star"></i></span>';
        }
    }
    return stars;
}

// Hàm chính để chạy
async function main() {
    const comics = await getComics();
    const htmlContent = generateHTML(comics);
    console.log(htmlContent); // Ở đây bạn có thể lưu hoặc sử dụng htmlContent theo nhu cầu của bạn
}

main();
