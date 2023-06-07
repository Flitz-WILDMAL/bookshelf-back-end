const nanoid = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid.nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;


    if(readPage === pageCount) {
        finished = true;
    }

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    if(!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    
    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id). length > 0;

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
                books
            }
        });
        response.code(201);
        return response;
    }
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;

}

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    if(!name && !reading && !finished) {
        const response = h.response ({
            status: 'success',
            data: {
                books: books.map((b) => ({
                    id: b.id,
                    name: b.name,
                    publisher: b.publisher,
                })),
            }
        })
        response.code(200);
        return response;
    }
    let filteredBook = books;
        if(name !== undefined) {
            filteredBook = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
        }

        if(reading !== undefined) {
            filteredBook = books.filter((b) => b.reading === (reading === true),
          );
        } else if(reading === '0') {
            filteredBook = books.filter((b) => !b.reading);
        }

        if(finished !== undefined) {
            filteredBook = books.filter((b) => b.finished === (finished === '1'),
            );
        } else if(finished === '0'){
            filteredBook = books.filter((b) => !b.finished);
        }

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBook.map((b) => (
                    {
                        id: b.id,
                        name: b.name,
                        publisher: b.publisher
                    }
                )),
            },
        },
        );
        response.code(200);
        return response;
};

const getBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if(book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
}

const updateBookByIdHandler = (request, h) => {
    const { name, year, author, summary, publisher, reading, readPage, pageCount} = request.payload;
        if (!name) {
            const response = h.response ({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        if(readPage > pageCount) {
            const response = h.response ({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        const { bookId } = request.params;
        const index = books.findIndex((b) => b.id === bookId);
        if(index === -1) {
            const response = h.response ({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const updatedAt = new Date().toISOString();
            books[index] = {
                ...books[index],
                name,
                readPage,
                pageCount,
                year,
                author,
                summary,
                publisher,
                reading,
                updatedAt,
            }

            const response = h.response ({
                status: 'success',
                message: 'Buku berhasil diperbarui',
                data: {
                    books,
                },
            });
            response.code(200);
            return response;
    }

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    
    const index = books.findIndex((b) => b.id === bookId);

    if(index !== -1) {
        books.splice(index, 1);

        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;


}

module.exports = { addBooksHandler, getAllBooksHandler, getBooksByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };