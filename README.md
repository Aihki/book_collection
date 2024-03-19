  # book_collection
Tämä on suuniteltu mobile fist.Applikaation perus idea on että voit katsoa esim mitä numeroita tiestysta sarjakuvasta omistat jo tai mitkä kirjat tiestystä sarjasta omistat. Samalla pystyt laittamaan kirjan missä tilassa kirja on statuksen avulla(esim. olet lukenut jo tietin kirjan).

## linkki sovellukseen
[BookCollection](http://10.120.32.88/)

## apidoc

* [auth-api](https://10.120.32.88/auth-api/)
* [upload-api](https://10.120.32.88/upload-api/)
* [graphql](https://github.com/Aihki/book_collection/blob/main/graphql_documentation.md)

## BackEnd
* [Auth](http://10.120.32.88/auth-api/api/v1)
* [Upload](http://10.120.32.88/upload-api/api/v1)
* [Graphql](http://10.120.32.88/graphql/graphql)
* [Graphql](http://10.120.32.88/graphql/)

## Toimminnalisuudet

* Perus kirjautuminen , rekisteröinti sekä ulos kirjautuminen
* kirjan lisääminen. Kirjasta pitää lisää kirjan nimi, sarjan nimi(jos ei ole sarja laita miscellaneous), kirjan genre sekä pieni kuvaus kirjasta(tähän sopii hyvin kirjan takana oleva kuvaus) sekä kirjan kansikuvan
* etsivu on feed missä näkee lisätytkirja kaikilta käyttäjiltä, kun klikkaat kirjaa pääset katsomaan sitä tarkemmin single näkymään.
* single näkymässä voit tykätä toisen lisäämästä kirja postista, voit arvostella kirjan kirjallisesti sekä tähdillä(1-5) sekä voit vaihtaa kirjan tilaa(esimerkiksi olet lukenut kirjan voit laitaan sen read statukselle)
* your book list näet lisäämäsi kirjasi(käyttäjä siis näkee vain lisäämänsä kirjat). Ne ovat jaoteltu sarjojen mukaan ja väri koodit kertovat nopeasti kirjan sen hetkisen statujsen. Pääset tätä kautta myös single näkymään jossa voit tehdä ylhäällä manitut asiat.
* light ja dark mode tulevat käyttäjän selaimen teema asetuksian mukaan.(Tämäkin tein näin koska halusin testata uutta tailwindin kanssa)
* pienen popup tulee kun rekisteröityy tai lisää kirjan

## lisä ideat joita en ehtinyt totoeuttamaan

* voit lisätä toisen käyttäjän kaveriksi.
* feedistä voisi tehdä global ja kaverisi feedin.
* stauksen vaihto tapahtuisi popupissa.
* adminille olisi oma sivu sekä oikeudet resetoida numerollisen arvostelun jos käyttäjä haluaa vaihtaa sitä.


## bugit

* jos lataa uusiksi esimerkiksi ip/login niin se ei lataa uudelleen sivua.
* like nappia voi joutua painamaan muutaman kerran että se rekisteröityy.
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
* [home dark theme](https://github.com/Aihki/book_collection/blob/main/screenshots/home_dark_theme.jpg)
* [home light theme](https://github.com/Aihki/book_collection/blob/main/screenshots/home_light_theme.jpg)
* [log dark theme](https://github.com/Aihki/book_collection/blob/main/screenshots/login_dark_theme.jpg)
* [log light theme](https://github.com/Aihki/book_collection/blob/main/screenshots/login_light_theme.jpg)
* [reg dark theme](https://github.com/Aihki/book_collection/blob/main/screenshots/reg_dark_theme.jpg)
* [reg light theme](https://github.com/Aihki/book_collection/blob/main/screenshots/reg_light_theme.jpg)
* [single dark theme 1](https://github.com/Aihki/book_collection/blob/main/screenshots/single_dark_theme.jpg)
* [single dark theme 2](https://github.com/Aihki/book_collection/blob/main/screenshots/single_dark_theme2.jpg)
* [single light theme 1](https://github.com/Aihki/book_collection/blob/main/screenshots/single_light_theme1.jpg)
* [single light theme 2](https://github.com/Aihki/book_collection/blob/main/screenshots/single_light_theme2.jpg)
* [upload dark theme 1](https://github.com/Aihki/book_collection/blob/main/screenshots/upload_dark_theme1.jpg)
* [upload dark theme 2](https://github.com/Aihki/book_collection/blob/main/screenshots/upload_dark_theme2.jpg)
* [upload light theme 1](https://github.com/Aihki/book_collection/blob/main/screenshots/upload_light_theme1.jpg)
* [upload light theme 2](https://github.com/Aihki/book_collection/blob/main/screenshots/upload_light_theme2.jpg)
* [boolist dark theme 1](https://github.com/Aihki/book_collection/blob/main/screenshots/booklist_dark_theme1.jpg)
* [boolist dark theme 2](https://github.com/Aihki/book_collection/blob/main/screenshots/bookList_dark_theme2.jpg)
* [boolist dark theme 3](https://github.com/Aihki/book_collection/blob/main/screenshots/bookList_dark_theme3.jpg)
* [boolist light theme 1](https://github.com/Aihki/book_collection/blob/main/screenshots/bookList_light_theme1.jpg)
* [boolist light theme 2](https://github.com/Aihki/book_collection/blob/main/screenshots/bookList_light_theme2.jpg)
* [boolist light theme 3](https://github.com/Aihki/book_collection/blob/main/screenshots/bookList_light_theme3.jpg)
  
## Tutoriaalit ja paketit
* [react-toastify](https://www.npmjs.com/package/react-toastify)




