# Real Estate Intelligence Dashboard - Backend

A comprehensive backend API for a Real Estate Intelligence Dashboard built with Node.js, Express, and MongoDB. This API supports property management, user authentication, analytics, and advanced features like favorites and saved searches.

## Features

### Phase 1: Core MVP Features
- **Property Management**: CRUD operations for properties with detailed attributes
- **User Authentication**: JWT-based auth with role-based access (user/admin)
- **Analytics Dashboard**: Data aggregation for visualizations (average price by city, listings per city, price trends)
- **Responsive API**: RESTful endpoints with proper error handling

### Phase 2: Pro Features
- **Advanced Filtering**: Search properties by city, state, price range, bedrooms, property type
- **Favorites & Saved Searches**: Users can save favorite properties and custom search filters
- **Admin Dashboard**: Manage users and view statistics
- **Image Upload**: Cloudinary integration for property images

### Phase 3: AI & Future-Ready Features (Planned)
- **AI Property Insights**: OpenAI integration for market analysis
- **Predictive Analytics**: Future price predictions
- **Smart Notifications**: Alerts for price changes and new listings

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Development**: Nodemon for auto-restart

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rea-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   MONGO_URI=mongodb://localhost:27017/rea-backend
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ESTATEINTEL_API_KEY=your_estateintel_api_key
   ```

4. Start MongoDB:
   - For local MongoDB: Ensure MongoDB is running on port 27017
   - For MongoDB Atlas: Update MONGO_URI with your Atlas connection string

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```
Starts the server with Node.js.

The server will run on `http://localhost:5000` (or the port specified in .env).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Properties
- `GET /api/properties` - Get all properties (with optional filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)

### Analytics
- `GET /api/analytics/avg-price-by-city` - Average price by city (enhanced with EstateIntel market data if city specified)
- `GET /api/analytics/listings-per-city` - Listings count by city
- `GET /api/analytics/price-trends` - Price trends over time
- `GET /api/analytics/summary` - Dashboard summary stats
- `GET /api/analytics/market-prices?location=lagos-ikeja&type=sale&beds=3` - Residential prices from EstateIntel API

### Favorites
- `GET /api/favorites` - Get user's favorites (protected)
- `POST /api/favorites` - Add property to favorites (protected)
- `DELETE /api/favorites/:id` - Remove favorite (protected)

### Saved Searches
- `GET /api/saved-searches` - Get user's saved searches (protected)
- `POST /api/saved-searches` - Create saved search (protected)
- `PUT /api/saved-searches/:id` - Update saved search (protected)
- `DELETE /api/saved-searches/:id` - Delete saved search (protected)

### Locations
- `GET /api/locations` - Get supported locations from EstateIntel API (neighborhoods, cities, countries)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/stats` - Get admin statistics (admin only)

### Uploads
- `POST /api/uploads` - Upload image to Cloudinary (admin only)

## Request/Response Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Get Properties with Filters
```bash
curl "http://localhost:5000/api/properties?city=Lagos&minPrice=100000&maxPrice=500000"
```

### Create Property (Admin)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful Apartment",
    "description": "Spacious 3-bedroom apartment",
    "location": {"city": "Lagos", "state": "Lagos", "coordinates": {"lat": 6.5244, "lng": 3.3792}},
    "price": 250000,
    "bedrooms": 3,
    "bathrooms": 2,
    "imageUrl": "https://example.com/image.jpg",
    "propertyType": "Apartment"
  }'
```

## Testing

1. Start the server in development mode
2. Use tools like Postman or curl to test endpoints
3. Test authentication flow: register → login → use token for protected routes
4. Test CRUD operations for properties
5. Verify analytics endpoints return correct aggregated data

## External API Integration

The backend integrates with the EstateIntel API for real estate market data:
- **Supported Locations**: Fetches available neighborhoods and cities for validation and filtering.
- **Residential Prices**: Provides average sale/rent prices by location, enhancing local analytics.
- **Usage**: New endpoints fetch data on-demand. Location validation in property routes ensures data consistency.
- **Dependencies**: Axios for HTTP requests; requires `ESTATEINTEL_API_KEY` in `.env`.
- **Caching**: Not implemented yet; consider Redis for production to avoid API rate limits.

## Project Structure

```
rea-backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User schema
│   ├── Property.js        # Property schema (with neighborhood support)
│   ├── Favorite.js        # Favorite schema
│   └── SavedSearch.js     # Saved search schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── properties.js      # Property CRUD routes (with location validation)
│   ├── analytics.js       # Analytics routes (enhanced with market data)
│   ├── locations.js       # EstateIntel locations routes
│   ├── admin.js           # Admin routes
│   ├── favorites.js       # Favorites routes
│   ├── savedSearches.js   # Saved searches routes
│   └── uploads.js         # Image upload routes
├── services/
│   └── estateintel.js     # EstateIntel API client
├── index.js               # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
