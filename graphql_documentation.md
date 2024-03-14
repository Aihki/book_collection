# MediaItem Type
Defines the structure of a media item.

- `book_id: ID!`: The unique identifier of the book.
- `user_id: ID!`: The unique identifier of the user who owns the media item.
- `owner: User!`: The user who owns the media item.
- `filename: String!`: The filename of the media item.
- `book_genre: String!`: The genre of the book associated with the media item.
- `thumbnail: String!`: The URL to the thumbnail image of the media item.
- `filesize: Int!`: The size of the media item file.
- `media_type: String!`: The type of media (e.g., image, video).
- `title: String!`: The title of the media item.
- `description: String!`: The description of the media item.
- `created_at: String!`: The timestamp indicating when the media item was created.
- `likes: [Like]`: A list of likes associated with the media item.
- `series_name: String`: The name of the series associated with the media item.
- `review: Review`: The review associated with the media item.
- `rating: Rating`: The rating associated with the media item.
- `likes_count: Int!`: The number of likes the media item has received.
- `status: Status`: The status of the media item.

# Query Type
Defines the available queries for retrieving media items.

### mediaItems
Retrieve a list of all media items.

### mediaItem
Retrieve a single media item by its unique identifier.

### mediaItemsByTag
Retrieve a list of media items by a specific tag.

### ownBookList
Retrieve a list of media items owned by a specific user.

# MediaItemInput Input Object
Input object for creating a new media item.

- `user_id: ID!`: The unique identifier of the user creating the media item.
- `filename: String!`: The filename of the media item.
- `filesize: Int!`: The size of the media item file.
- `media_type: String!`: The type of media.
- `title: String!`: The title of the media item.
- `description: String!`: The description of the media item.
- `book_genre: String!`: The genre of the book associated with the media item.
- `series_name: String`: The name of the series associated with the media item.

# MediaItemUpdateInput Input Object
Input object for updating an existing media item.

- `title: String!`: The updated title of the media item.
- `description: String!`: The updated description of the media item.

# Mutation Type
Defines the available mutations for creating, updating, and deleting media items.

### createMediaItem
Create a new media item.

### updateMediaItem
Update an existing media item.

### deleteMediaItem
Delete a media item by its unique identifier.


# Examples




# Like
Defines the structure of a like.

- `like_id: ID!`: The unique identifier of the like.
- `book: MediaItem!`: The media item that the like is associated with.
- `user: User!`: The user who made the like.
- `created_at: String!`: The timestamp when the like was created.

# Query
Defines the available queries for retrieving likes.

## likes
Retrieve a list of all likes.

## likesByBookID(book_id: ID!)
Retrieve a list of likes for a specific book by its unique identifier.

## likesByUserID(user_id: ID!)
Retrieve a list of likes made by a specific user by their unique identifier.

## myLikes
Retrieve a list of likes made by the authenticated user.

# Mutation
Defines the available mutations for creating and deleting likes.

## createLike(book_id: ID!)
Create a new like for a book identified by its unique identifier.

## deleteLike(like_id: ID!)
Delete a like by its unique identifier.

# Examples


# Rating
Defines the structure of a rating given by a user to a media item.

- `rating_id: ID!`: The unique identifier of the rating.
- `book: MediaItem!`: The media item that the rating is associated with.
- `user: User!`: The user who made the rating.
- `rating_value: Int!`: The rating value given by the user, constrained between 1 and 5.
- `created_at: String!`: The timestamp when the rating was created.

# Query
Defines the available queries for retrieving ratings.

## rating(book_id: ID!)
Retrieve ratings for a specific book by its unique identifier.

# Mutation
Defines the available mutation for adding a rating to a media item.

## addRating(book_id: ID!, rating_value: Int!)
Add a rating to a book identified by its unique identifier. The `rating_value` must be between 1 and 5.

# Examples


# Review
Defines the structure of a review given by a user for a media item.

- `review_id: ID!`: The unique identifier of the review.
- `book: MediaItem!`: The media item that the review is associated with.
- `user: User!`: The user who made the review.
- `review_text: String!`: The text content of the review.
- `created_at: String!`: The timestamp when the review was created.

# Query
Defines the available queries for retrieving reviews.

## review(book_id: ID!)
Retrieve reviews for a specific book by its unique identifier.

# Mutation
Defines the available mutation for adding a review to a media item.

## addReview(book_id: ID!, review_text: String!)
Add a review to a book identified by its unique identifier. The `review_text` parameter contains the text content of the review.


# Examples



# Status
Represents the status of a book by `status_name`.

- `status_id: ID!`: The unique identifier of the status.
- `status_name: String!`: The name of the status.

# BookStatus
Represents the status of a book.

- `book_id: ID!`: The unique identifier of the book.
- `status_id: ID!`: The unique identifier of the status.
- `user_id: ID!`: The unique identifier of the user associated with the book status.

# BookStatusResponse
Represents the response after updating the status of a book.

- `message: String!`: A message indicating the result of the operation.
- `status: Status!`: The updated status of the book.

# Query
Defines the available queries for retrieving statuses.

## status
Query to retrieve all statuses.

# Mutation
Defines the available mutation for updating the status of a book.

## updateBookStatus(input: BookStatusInput!, book_id: ID!)
Update the status of a book identified by its unique identifier.

### Input
- `status_id: ID`: The new status identifier for the book.

# Esmaples




# User
Represents a user.

- `user_id: ID!`: The unique identifier of the user.
- `username: String!`: The username of the user.
- `email: String!`: The email address of the user.
- `level_name: String!`: The level name of the user.
- `created_at: String!`: The timestamp when the user was created.

# Query
Defines the available queries for user-related operations.

## users
Retrieve a list of all users.

## user(user_id: ID!)
Retrieve a user by their unique identifier.

## getUser
Retrieve the currently authenticated user.

## checkUsername(username: String!)
Check the availability of a username.

## checkEmail(email: String!)
Check the availability of an email address.

## checkToken
Check the validity of the authentication token.

# InputUser
Input object for creating or updating a user.

- `username: String!`: The username of the user. Constraints: Minimum length of 3 characters, maximum length of 255 characters.
- `email: String!`: The email address of the user. Constraints: Must be in a valid email format.
- `password: String!`: The password of the user. Constraints: Minimum length of 5 characters, must contain at least one uppercase letter.

# Mutation
Defines the available mutations for user-related operations.

## createUser(input: InputUser!)
Create a new user with the provided input data.

## login(username: String!, password: String!)
Login a user with the provided username and password.

## updateUser(input: InputUser!, user_id: ID!)
Update an existing user with the provided input data.

## deleteUser
Delete the currently authenticated user.

# LoginResponse
Response type for the login mutation.

- `token: String!`: The authentication token for the logged-in user.

# Message
A simple message response.
