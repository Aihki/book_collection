# book_collection
Tämä on suuniteltu mobile fist.

## linkki sovellukseen
[BookCollection](http://10.120.32.88/)

## apidoc

* [auth-api](https://10.120.32.88/auth-api/)
* [upload-api](https://10.120.32.88/upload-api/)
* [graphql](https://github.com/Aihki/book_collection/blob/main/graphql_documentation.md)

## BackEnd
* [Auth](https://10.120.32.88/auth-api/api/v1)
* [Upload](https://10.120.32.88/upload-api/api/v1)
* [Graphql](http://10.120.32.88/graphql/graphql)
* [Graphql](http://10.120.32.88/graphql/)

## Toimminnalisuudet

* Perus kirjautuminen , rekisteröinti sekä ulos kirjautuminen
* kirjan lisääminen. Kirjasta pitää lisää kirjan nimi, sarjan nimi(jos ei ole sarja laita miscellaneous), kirjan genre sekä pieni kuvaus kirjasta(tähän sopii hyvin kirjan takana oleva kuvaus) sekä kirjan kansikuvan
* kotisivu on feed missä näkee lisätytkirja
* single näkymässä voit tykätä toisen lisäämästä kirja postista, voit arvostella kirjan kirjallisesti sekä tähdillä(1-5) sekä voit vaihtaa kirjan tilaa(esimerkiksi olet lukenut kirjan voit laitaan sen read statukselle)
* your book list näet lisäämäsi kirjasi. Ne ovat jaoteltu sarjojen mukaan ja väri koodit kertovat nopeasti kirjan sen hetkisen statujsen. Pääset tätä kautta myös single näkymään jossa voi vaihtaa statusta.
* light ja dark mode tulevat käyttäjän selaimen teema asetuksian mukaan
* pien popup tulee kun rekisteröityy tai lisää kirjan

## lisä ideat joita en ehtinyt totoeuttamaan

* voit lisätä toisen käyttäjän kaveriksi
* feedistä voisi tehdä global ja kaverisi feedin
* stauksen vaihto tapahtuisi popupissa
* adminille olisi oma sivu sekä oikeudet resetoida numerollisen arvostelun jos käyttäjä haluaa vaihtaa sitä


## bugit

* jos lataa uusiksi esimerkiksi ip/login niin se ei lataa uudelleen sivua.
* like nappia voi joutua painamaan muutaman kerran että se rekisteröityy
* descriptioniin on tietty merkkimäärä pidemmissä se tuottaa ongelmaa. Elikkä tällä hetkellä kannattaa laittaa lyhennetty descriptioniin.

## Database
[![Database Diagram](https://github.com/Aihki/book_collection/blob/main/screenshots/database-diagram.png)](https://github.com/Aihki/book_collection/blob/main/screenshots/database-diagram.png)
```sql
-- Drop the database if it exists and then create it
  DROP DATABASE IF EXISTS BookCollection;
  CREATE DATABASE BookCollection;
  USE BookCollection;

  -- Create the tables

  CREATE TABLE UserLevels (
      level_id INT AUTO_INCREMENT PRIMARY KEY,
      level_name VARCHAR(50) NOT NULL
  );

  CREATE TABLE Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      user_level_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
  );

  CREATE TABLE Collection (
      book_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      series_name VARCHAR(255),
      book_genre VARCHAR(255) NOT NULL,
      media_type VARCHAR(255) NOT NULL,
      filesize INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
  );


  CREATE TABLE Ratings (
      rating_id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      user_id INT NOT NULL,
      rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES Collection(book_id),
      FOREIGN KEY (user_id) REFERENCES Users(user_id)

  );

  CREATE TABLE Likes (
      like_id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES Collection(book_id),
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
  );

  CREATE TABLE Reviews (
      review_id INT AUTO_INCREMENT PRIMARY KEY,
      book_id INT NOT NULL,
      user_id INT NOT NULL,
      review_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES Collection(book_id),
      FOREIGN KEY (user_id) REFERENCES Users(user_id)

  );
  CREATE TABLE Status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
  );


  CREATE TABLE BookStatus (
      book_id INT NOT NULL,
      status_id INT NOT NULL,
      PRIMARY KEY (book_id, status_id),
      FOREIGN KEY (book_id) REFERENCES Collection(book_id),
      FOREIGN KEY (status_id) REFERENCES Status(status_id)
  );

  INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');

  INSERT INTO Status (status_name) VALUES ('Reading'), ('Read'), ('Dropped'), ('Want to Read'), ('paused');
```

## Screenshots
[![home page without books](https://github.com/Aihki/book_collection/blob/main/screenshots/home_without_books.png)
[![home page book add](https://github.com/Aihki/book_collection/blob/main/screenshots/home_with_book.png)
[![Reg](https://github.com/Aihki/book_collection/blob/main/screenshots/reg.png)
[![LogIn](https://github.com/Aihki/book_collection/blob/main/screenshots/log.png)
[![your book list](https://github.com/Aihki/book_collection/blob/main/screenshots/your_book_list.png)
[![upload](https://github.com/Aihki/book_collection/blob/main/screenshots/upload_v1.png)


## Tutoriaalit ja paketit
* [react-toastify](https://www.npmjs.com/package/react-toastify)




