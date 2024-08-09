const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URL;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("comic_db");

        // Tạo collection
        await createAuthorsCollection(database);
        await createUsersCollection(database);
        await createComicsCollection(database);
        await createChaptersCollection(database);
        await createCategoriesCollection(database);
        await createStoryAuthorCollection(database);
        await createStoryCategoriesCollection(database);
        await createPasswordResetCollection(database);

        console.log("Tất cả các collection đã được tạo!");
    } finally {
        await client.close();
    }
}

async function createAuthorsCollection(database) {
    const authors = database.collection('authors');
    await authors.insertOne({});
    await authors.drop();

    await database.createCollection('authors', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ID", "name", "alias", "description"],
                properties: {
                    ID: { bsonType: "int" },
                    name: { bsonType: "string" },
                    alias: { bsonType: "string" },
                    description: { bsonType: "string" },
                    created_at: { bsonType: "date" },
                    updated_at: { bsonType: "date" }
                }
            }
        }
    });
}

async function createUsersCollection(database) {
    const users = database.collection('users');
    await users.insertOne({});
    await users.drop();

    await database.createCollection('users', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["username", "email", "password"],
                properties: {
                    username: { bsonType: "string" },
                    email: { bsonType: "string" },
                    password: { bsonType: "string" },
                    admin: { bsonType: "bool" },
                    createdAt: { bsonType: "date" },
                    updatedAt: { bsonType: "date" }
                }
            }
        }
    });
}

async function createComicsCollection(database) {
    const comics = database.collection('comics');
    await comics.insertOne({});
    await comics.drop();

    await database.createCollection('comics', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["comicId", "title", "views", "status", "content", "description", "creationDate", "updateDate", "author", "image", "category", "rating", "chapters"],
                properties: {
                    comicId: { bsonType: "int" },
                    title: { bsonType: "string" },
                    views: { bsonType: "int" },
                    status: { bsonType: "string" },
                    content: { bsonType: "string" },
                    description: { bsonType: "string" },
                    creationDate: { bsonType: "date" },
                    updateDate: { bsonType: "date" },
                    author: { bsonType: "string" },
                    image: { bsonType: "string" },
                    category: { bsonType: "string" },
                    rating: { bsonType: "int" },
                    chapters: { bsonType: "string" },
                    created_at: { bsonType: "date" },
                    updated_at: { bsonType: "date" }
                }
            }
        }
    });
}

async function createChaptersCollection(database) {
    const chapters = database.collection('chapters');
    await chapters.insertOne({});
    await chapters.drop();

    await database.createCollection('chapters', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ID", "name", "subname", "alias", "content", "view", "story_ID", "active"],
                properties: {
                    ID: { bsonType: "int" },
                    name: { bsonType: "string" },
                    subname: { bsonType: "string" },
                    alias: { bsonType: "string" },
                    content: { bsonType: "string" },
                    view: { bsonType: "int" },
                    story_ID: { bsonType: "int" },
                    active: { bsonType: "int" },
                    created_at: { bsonType: "date" },
                    updated_at: { bsonType: "date" }
                }
            }
        }
    });
}

async function createCategoriesCollection(database) {
    const categories = database.collection('categories');
    await categories.insertOne({});
    await categories.drop();

    await database.createCollection('categories', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ID", "name", "alias", "parent_ID", "keyword", "description"],
                properties: {
                    ID: { bsonType: "int" },
                    name: { bsonType: "string" },
                    alias: { bsonType: "string" },
                    parent_ID: { bsonType: "int" },
                    keyword: { bsonType: "string" },
                    description: { bsonType: "string" },
                    created_at: { bsonType: "date" },
                    updated_at: { bsonType: "date" }
                }
            }
        }
    });
}

async function createStoryAuthorCollection(database) {
    const story_author = database.collection('story_author');
    await story_author.insertOne({});
    await story_author.drop();

    await database.createCollection('story_author', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ID", "story_ID", "author_ID"],
                properties: {
                    ID: { bsonType: "int" },
                    story_ID: { bsonType: "int" },
                    author_ID: { bsonType: "int" },
                    created_at: { bsonType: "date" },
                    updated_at: { bsonType: "date" }
                }
            }
        }
    });
}

async function createStoryCategoriesCollection(database) {
    const story_categories = database.collection('story_categories');
    await story_categories.insertOne({});
    await story_categories.drop();

    await database.createCollection('story_categories', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ID", "story_ID", "category_ID"],
                properties: {
                    ID: { bsonType: "int" },
                    story_ID: { bsonType: "int" },
                    category_ID: { bsonType: "int" },
                    created_at: { bsonType: "date" },
                    updated_at: { bsonType: "date" }
                }
            }
        }
    });
}

async function createPasswordResetCollection(database) {
    const password_reset = database.collection('password_reset');
    await password_reset.insertOne({});
    await password_reset.drop();

    await database.createCollection('password_reset', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["email", "token"],
                properties: {
                    email: { bsonType: "string" },
                    token: { bsonType: "string" },
                    created_at: { bsonType: "date" }
                }
            }
        }
    });
}

main().catch(console.error);
