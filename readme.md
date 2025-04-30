
# School Management API

This is a simple REST API for managing schools. The API allows users to add schools, list all schools, and calculate the distance from a given location to each school using the Haversine formula. The data is stored in a MySQL database.

## Features

- **Add a school** with name, address, latitude, and longitude.
- **List all schools** and calculate the distance from the user's location to each school.
- **Sort schools by distance** in ascending order.
- **Error handling** for invalid inputs and internal server issues.

## Requirements

- Node.js (v14 or higher)
- MySQL (or any MySQL-compatible database)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-management-api.git
   ```

2. Install dependencies:
   ```bash
   cd school-management-api
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_PORT=3306  # or your custom port
   PORT=3000  # or your desired port
   ```

4. (Optional) Initialize the database:
   You can initialize the database table by uncommenting the `initializeDatabase` function call in the `index.js` file and running the app once to create the table.

## API Endpoints

### 1. Add School

**POST** `/addSchool`

Adds a new school to the database.

**Request Body:**
```json
{
  "name": "School Name",
  "address": "School Address",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Response:**
```json
{
  "message": "School added successfully",
  "schoolId": 1
}
```

### 2. List Schools

**GET** `/listSchools`

Lists all schools in the database and calculates the distance from the user's location.

**Query Parameters:**
- `latitude` (User's latitude)
- `longitude` (User's longitude)

**Response:**
```json
[
  {
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "created_at": "2023-12-01T12:00:00Z",
    "distance": 5.6
  },
  ...
]
```

### 3. Welcome Message

**GET** `/`

Returns a simple welcome message.

**Response:**
```text
Welcome to the School Management API!
```

## Deployed URL

You can access the API on the following URL:

**Base URL:**  
`https://internship-production-a21b.up.railway.app`

### Example API Calls:

- Add a school:  
  **POST** `https://internship-production-a21b.up.railway.app/addSchool`
  
- List schools:  
  **GET** `https://internship-production-a21b.up.railway.app/listSchools?latitude=12.9716&longitude=77.5946`

## Error Handling

The API includes error handling for:

- Missing or invalid parameters (e.g., missing latitude/longitude)
- Internal server errors

## Run the Application Locally

To run the application locally, use the following command:

```bash
npm start
```

By default, the server will run on port `3000`, but you can change it by setting the `PORT` variable in your `.env` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

