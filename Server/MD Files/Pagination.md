Perfect — this is a **MongoDB aggregation query** written in Node.js (Express) to **fetch all saved posts of a logged-in user** with pagination and sorting.

Let’s go through this **step by step in plain English** 👇

---

### 🧩 FUNCTION OVERVIEW

```js
const getAllSavedPost = asyncHandler(async (req, res) => {
```

* This defines an async Express controller function.
* It’s wrapped in `asyncHandler` so errors are automatically caught and passed to the error middleware.

---

### 👤 Extracting user and query info

```js
const userId = req.user?._id
const { page = 1, limit = 10, sortBy = "createdAt", sortType = "newest" } = req.query;
```

* Gets the logged-in user’s ID.
* Gets pagination and sorting details from the request query (with defaults).

---

### 🧮 Pagination setup

```js
const pageNo = Math.max(1, Number(page));
const maximumNoOfDocument = Math.min(50, Number(limit));
const offset = (pageNo - 1) * maximumNoOfDocument;
```

* Ensures the page number is at least 1.
* Limits the number of documents fetched per page to a max of 50.
* Calculates how many documents to skip (for pagination).

---

### 🔄 Normalizing sort type

```js
const normalizeSortType = String(sortType).toLowerCase();
```

* Converts the sort type to lowercase to avoid case mismatch.

---

### 🔢 Define allowed sort types

```js
const SORT_TYPES = {
    NEWEST: "newest",
    OLDEST: "oldest"
}
```

* Defines allowed sorting modes.

---

### 🚫 Validate sort type

```js
if (!Object.values(SORT_TYPES).includes(normalizeSortType)) {
    throw new apiError(400, 'Sort Type must be "newst" or "oldest"')
}
```

* Throws an error if the user passes an invalid sort type in the query.

---

### 🔁 Create sorting object

```js
const sortObject = {
    sortBy: normalizeSortType === SORT_TYPES.NEWEST ? 1 : -1
}
```

* Defines how to sort the results.

  * If `newest`, sort ascending (`1`).
  * If `oldest`, sort descending (`-1`).

*(⚠️ Small bug here: this doesn’t actually work in MongoDB — you should use `{ [sortBy]: 1 }` instead of `{ sortBy: 1 }`.)*

---

### 🧮 Get total saved posts

```js
const totalSavedPost = (await Save.find({ savedBy: userId })).length
```

* Counts how many posts the user has saved (for pagination info later).

---

### 📊 Aggregation pipeline begins

```js
const existingSave = await Save.aggregate([
```

* Runs a MongoDB aggregation pipeline on the **Save** collection.
* Each document in `Save` represents a user saving a post.

---

### 🧱 Stage 1 — Filter only user’s saved posts

```js
{ $match: { savedBy: userId } },
```

* Only keep documents where `savedBy` matches the logged-in user.

---

### 🔗 Stage 2 — Lookup post details

```js
{
    $lookup: {
        from: "posts",
        localField: "savedPost",
        foreignField: "_id",
        as: "postDetails",
```

* Joins each saved document with the **posts** collection.
* Matches the `savedPost` field in the save with the post `_id`.
* Stores the matched posts in `postDetails`.

---

### 🔗 Stage 2.1 — Nested lookup for post owner

```js
pipeline: [
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    },
```

* Inside each post, it also joins with the **users** collection to get owner info.

---

### 🧱 Stage 2.2 — Flatten owner array

```js
{
    $addFields: {
        owner: {
            $first: "$owner"
        }
    }
}
```

* Since `$lookup` returns an array, `$first` extracts the first (and only) element.

---

### 🧱 Stage 2.3 — Select only needed fields

```js
{
    $project: {
        title: 1,
        description: 1,
        images: 1,
        video: 1,
        "owner.userName": 1,
        "owner.fullName": 1,
        "owner.avatar": 1
    }
}
```

* Only includes required fields from the post and its owner.

---

### 🧱 Stage 3 — Keep only needed save fields

```js
{
    $project: {
        savedBy: 1,
        savedPost: 1,
        postDetails: 1
    }
}
```

* Keeps the essential fields from the **Save** collection after lookup.

---

### 🔢 Stage 4 — Sort the results

```js
{
    $sort: { sortObject }
},
```

* Tries to sort the data based on the earlier `sortObject`.
* (⚠️ Should be `$sort: sortObject` instead of `$sort: { sortObject }`.)

---

### 📄 Stage 5 — Limit results

```js
{ $limit: maximumNoOfDocument },
```

* Limits how many documents are returned per page.

---

### ↩️ Stage 6 — Skip (for pagination)

```js
{ $skip: offset }
```

* Skips results from previous pages.

---

### ❌ Handle no results

```js
if (!existingSave) {
    throw new apiError(404, "No Saved Post Found")
}
```

* If no saved posts are found, throws an error.

---

### 📄 Calculate pagination details

```js
const totalPages = Math.ceil(totalSavedPost / maximumNoOfDocument)
```

* Determines total pages based on total saves and limit.

---

### 📦 Prepare response data

```js
const responseData = {
    existingSave,
    pagination: {
        currentPageNo: pageNo,
        totalSavedPost,
        maximumNoOfDocument,
        savedPostPerPage: Number(limit),
        hasNextPage: pageNo < maximumNoOfDocument,
        hasPrevPage: pageNo > 1
    }
}
```

* Packages the results and pagination info into one object.

---

### ✅ Send the response

```js
return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                responseData,
                totalSaves: existingSave.length
            },
            "Fetched all users saved post"
        )
    )
```

* Sends a successful response with:

  * The saved posts and their post details.
  * Pagination info.
  * A success message.

---

### 🧠 TL;DR (Summary)

This controller:

1. Gets the logged-in user’s ID.
2. Validates sort and pagination query params.
3. Fetches all posts that the user has saved.
4. Joins (via `$lookup`) each saved post with its post and owner details.
5. Sorts, paginates, and sends the formatted response.

---

Would you like me to rewrite this code with **fixed sorting + proper pagination logic** and cleaner syntax? It’ll be easier to maintain and bug-free.
