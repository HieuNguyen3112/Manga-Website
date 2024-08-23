const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URL;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("comic_db");

        // Cập nhật tất cả các users để thêm trường favoriteComics nếu nó chưa tồn tại
        await database.collection('users').updateMany(
            { favoriteComics: { $exists: false } }, // Điều kiện: nếu trường favoriteComics chưa tồn tại
            { $set: { favoriteComics: [] } } // Thêm trường favoriteComics với mảng rỗng
        );

        console.log("Đã cập nhật thành công tất cả các users với trường favoriteComics!");
    } catch (err) {
        console.error("Đã xảy ra lỗi khi cập nhật:", err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
