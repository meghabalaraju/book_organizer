import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';

class ListBooks extends Component {

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
          alert(`You have already added the book to ${value} section. Please chose another option`)
      }
      
    };

    render() {
        const { bookShelves } = this.props;
        const option = Object.keys(bookShelves).map((key, i) => {
          return key
        });
        
        return(
            <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {Object.keys(bookShelves).map((key, i) => (
                    <div className="bookshelf" key={i}>
                      <h2 className="bookshelf-title">{key}</h2>
                      <div className="bookshelf-books">
                          <ol className="books-grid">
                              {bookShelves[key].map((cBook)=> (
                                  <li key={cBook.id}>
                                      <div className="book">
                                          <div className="book-top">
                                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${cBook.imageLinks.thumbnail})` }}></div>
                                              <div className="book-shelf-changer">
                                                  <select className="select" defaultValue={'move'} onClick={(e) => this.handleChange(e, cBook)}>
                                                      <option value="move"  disabled>Move to...</option>
                  
                                                      {option.map((key, i) => (
                                                        <option className={[key === cBook.shelf]} value={key} key={i}>{key}</option>
                                                      ))}
                                                      
                                                      <option value="none">None</option>
                                                  </select>
                                              </div>
                                          </div>
                                          <div className="book-title">{cBook.title}</div>
                                          {cBook.authors ? (
                                                  <div className="book-authors">{cBook.authors}</div>
                                              ) : (
                                                  <div className="book-authors" style={{color: "#a37955"}}>Author unknown</div>
                                              )}
                                      </div>
                                  </li>
                              ))}
                          </ol>
                      </div>

                    </div>
                ))}
              </div>
            </div>
            <div className="open-search">
              <Link to='/search' className="open-search button" >Add a book</Link>
            </div>
          </div>
        )
    }
}

ListBooks.propTypes = {
  bookShelves: PropTypes.object.isRequired,
  updateShelfState: PropTypes.func.isRequired
};

export default ListBooks;