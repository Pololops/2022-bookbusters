const bookDataMapper = require('../models/book');
const { ApiError } = require('../middlewares/handleError');
const bookMW = require('../middlewares/getBookInformation');
const debug = require('debug')('bookController');

module.exports = {
    /**
     * Product controller to get all books in donation.
     * ExpressMiddleware signature
     * @param {object} req Express req.object (not used)
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    async getAllInDonation(req, res) {
        debug('GetAllInDonation')
        let books = await bookDataMapper.findAllInDonation();
        if(req.body.user){
            debug('user connecté')
            books = await bookMW.getBookInformation(books, req.body.user.userId);
        }
        else {
            debug('user non connecté')
            books = await bookMW.getBookInformation(books);
        }
        return res.json(books);
    },

    async getOneBookById(req, res) {
        const bookId = req.params.id;
        let book = await bookDataMapper.findOneBookById(bookId);
        if (!book) {
            throw new ApiError('Book not found', { statusCode: 404 });
        }
        if(req.body.user){
            book = await bookMW.getBookInformation([book], req.body.user.userId);
        }
        else {
            book = await bookMW.getBookInformation([book]);
        }
        return res.json(book);
    },

    /**
     * Book controller to add a book
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    async addBook(req, res) {
        const savedUserHasBook = await bookDataMapper.updateOrInsert(req.body);

        let book = await bookDataMapper.findOneBookById(savedUserHasBook.book_id);
        if(req.body.user){
            book = await bookMW.getBookInformation([book], req.body.user.userId);
        }
        else {
            book = await bookMW.getBookInformation([book]);
        }
        return res.json(book);
    },

    /**
     * Book controller to add a book
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    async getBooksIdsAroundMe(req, res) {
        const books = await bookDataMapper.findBooksIdAround(req.body.location, req.body.radius);
        return res.json(books);
    },

    async getBooksWithIds(req, res) {
        debug('Req.query.books = ', req.query.books);
        let bookIds = req.query.books
        bookIds = bookIds.substr(1).substr(0, bookIds.length - 2).split(',');
        debug('après traitement', bookIds);

        const promiseToSolve = [];
        bookIds.forEach(element => {
            promiseToSolve.push(bookDataMapper.findOneBookById(Number(element)));
        });


        //TODO : question : what happened si une promesse échoue ??
        debug('Je lance les promesses pour trouver les livres')
        let books = await Promise.all(promiseToSolve);
        debug('Les livres trouvés sont', books);
        //Without books undefined
        let newBooks=[];
        books.forEach(book=>{
            if(book) {
                newBooks.push(book);
        }
        });
        books=newBooks;


        debug('Les livres trouvés sans les undefined', books);

        debug('Je complete les infos avec API');
        if(req.body.user){
            debug('user connecté')
            books = await bookMW.getBookInformation(books, req.body.user.userId);
        }
        else {
            debug('user non connecté')
            books = await bookMW.getBookInformation(books);
        }
        debug('Livres complets', books);

       return res.json(books);

    }
};
