import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BookAPI from './BooksAPI';
import { DebounceInput } from 'react-debounce-input';
import PropTypes from 'prop-types';
import './App.css';

class SearchBooks extends Component {
    state = {
        query: '',
        books: []
    };
    

    /**
     * @description - updates query in state whenever it changes
     * @param {Event} e - onChange event to get query to search books 
     */
    handleQuery = (e) => {
        const { value } = e.target;
        this.setState(() => ({
            query: value
        }));
        
        const { query } = this.state;
        if(query.length > 2 ) {
            this.searchBooks(query);
        } else {
            this.setState({books: []});
        }
    };


    /**
     * @description - Fetches books from BooksAPI based on user input
     * @param {string} query - user input to search book
     */
    searchBooks = (query) => {
        BookAPI.search(query)
            .then((books) => {
                const { Books } = this.props;
                if(!books.items) {
                    books.forEach((book) => {
                        book.shelf = 'none';
                    });
                    this.addShelf(books, Books);
                } else {
                    this.setState({books: []})
                }
                return books;
            });
    };

    /**
     * @description - Adds shelf property when user moves resulted search book into one of the shelf
     * @param {Array} books - books resulated from search query
     * @param {Array} Books - books from props 
     */
    addShelf = (books, Books) => {
        Books.forEach((cbook) => {
            books.forEach((book) => {
                if(book.id === cbook.id) {
                    book.shelf = cbook.shelf
                }
            }); 
        });

        this.setState(() => ({
            books: books
        }));

    };


    /**
     * @description: Calls updateshelfstate func in App.js
     * @param {event} e - onChange event to get value of to which shelf the book should move
     * @param {object} book - The book which shelf needs to be updated
    */
    handleChange = (e, book) => {
        const { value } = e.target;

        if(value !== book.shelf) {
          this.props.updateShelfState(book, value);
        } else {
          alert(`book is already in the ${value}. Please chose another option`)
        }

    };

    render() {
        const { query, books } = this.state;   
        const { bookShelves } = this.props;
        const option = Object.keys(bookShelves).map((key, i) => {
            return key
          });    
        return(
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className="close-search" >Close</Link>
                    <div className="search-books-input-wrapper">
                            <DebounceInput
                                minLength={2}
                                debounceTimeout={300} 
                                type="text" 
                                placeholder="Search by title or author" 
                                value={query} 
                                onChange={(e) => this.handleQuery(e)} 
                            />
                    </div>
                </div>

                 <div className="search-books-results">
                    <ol className="books-grid">
                        {books.map((cBook) => (
                            <li key={cBook.id}>
                                <div className="book">
                                    <div className="book-top">
                                        <div className="book-cover" style={ {width: 128, height: 193, backgroundImage:`url(${cBook.imageLinks && cBook.imageLinks.thumbnail?`${cBook.imageLinks.thumbnail}`:`http://via.placeholder.com/128x193?text=No%20Cover`})`} }></div>
                                            <div className="book-shelf-changer">
                                                <select defaultValue={cBook.shelf} onChange={(e) => this.handleChange(e, cBook)}>
                                                    <option value="move" disabled>Move to...</option>
                                                    {option.map((key, i) => (
                                                        <option value={key} key={i}>{key}</option>
                                                    ))}
                                                    <option value="none">none</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="book-title">{cBook.title}</div>
                                        <div className="book-authors">{Array.isArray(cBook.authors) ? cBook.authors.join(', '):''}</div>
                                </div>
                            </li>
                        ))}
                    </ol>       
                </div> 
            </div>
        )
    }
}

SearchBooks.propTypes = {
    Books: PropTypes.array.isRequired,
    bookShelves: PropTypes.object.isRequired,
    updateShelfState: PropTypes.func.isRequired
  }

export default SearchBooks;