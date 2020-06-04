import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './Books'
import SearchBooks from './SearchBooks'
import GenericNotFound from './GenericNotFound'
import './App.css'

class BooksApp extends React.Component {
  state = {
      Books: [],
      bookShelf: {}
  };


  componentDidMount = () => {
    this.getAllBooks();
  };


  /**
   * @description Fetches all books from BooksAPI
   */
  getAllBooks = () => {
    BooksAPI.getAll()
      .then((Books) => {
        this.setState(() => ({
          Books: Books
        }));
        this.bookShelfing();
      });
    
  };


  /**
   * @description Categorizes all books into shelves (CurrentlyReading, WantToRead, Read)
   */
  bookShelfing = () => {
    const result = this.state.Books.reduce((pre, curr, i) => {
      pre[curr.shelf] = pre[curr.shelf] || [];
      pre[curr.shelf].push(curr);
      return pre;
    }, Object.create(null));

    this.setState(() => ({
      bookShelf: result,
    }));
  };


  /**
   * @description Updates book's shelf from one to another (currentlyReading to read based on user click)
   * @param {object} book - The book which shelf needs to be updated
   * @param {string} shelf - To which shelf the book is moving
   */
  updateStateShelf = (book, shelf) => {
    const { Books } = this.state;
    Books.map((cbook) => {
      if(cbook.id === book.id) {
        book.shelf = shelf
      }
      return cbook;
    });

    this.setState((curState) => ({
        Books: [...curState.Books]
    }));

    this.bookShelfing();
  };


  /**
   * @description: Updates book'S shelf in BooksAPI
   * @param {object} book - The book which shelf needs to be updated
   * @param {string} shelf - To which shelf the book is moving
  */
  updateShelf = (book, shelf) => {
    this.updateStateShelf(book, shelf); 
    BooksAPI.update(book, shelf)
      .then(()=> {
       this.getAllBooks();
    });
  };


  render() {
    const { Books, bookShelf } = this.state;
    return (
        <div className="app">
          <Switch>
              <Route exact path='/' render={()=> (
                  <ListBooks 
                    bookShelves={bookShelf}
                    updateShelfState={this.updateShelf}
                  />
              )}/>
       
              <Route path='/search' render={() => (
                <SearchBooks 
                  Books={Books}
                  bookShelves={bookShelf}
                  updateShelfState={this.updateShelf}
                />
              )}/>
              <Route component={GenericNotFound} />
          </Switch>
      </div>
    )
  }
}

export default BooksApp;
