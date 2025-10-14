# Backend Development TODO

## Phase 1: Core MVP Features
- [x] Set up MongoDB connection (config/db.js)
- [x] Create User model (models/User.js)
- [x] Create Property model (models/Property.js)
- [x] Create auth middleware (middleware/auth.js)
- [x] Create auth routes (routes/auth.js) - Login/Signup with JWT
- [x] Create properties routes (routes/properties.js) - CRUD
- [x] Create analytics routes (routes/analytics.js) - Data for charts
- [x] Create main server file (index.js)
- [x] Update package.json scripts
- [x] Create .env file

## Phase 2: Pro Features
- [x] Add SavedSearch model (models/SavedSearch.js)
- [x] Add Favorite model (models/Favorite.js)
- [x] Enhance properties routes with advanced filters
- [x] Add admin routes (routes/admin.js)
- [x] Add image upload (Cloudinary integration)
- [x] Add favorites routes (routes/favorites.js)
- [x] Add saved searches routes (routes/savedSearches.js)
- [x] Add uploads routes (routes/uploads.js)

## Phase 3: AI & Future-Ready Features
- [ ] Integrate AI for insights (OpenAI API)
- [ ] Predictive analytics
- [ ] Notifications
- [ ] Data export

## Testing
- [ ] Test server startup
- [ ] Test auth endpoints
- [ ] Test property CRUD
- [ ] Test analytics data

## EstateIntel API Integration
- [ ] Install axios for HTTP requests
- [x] Create services/estateintel.js with API fetch functions
- [x] Update models/Property.js: Add neighborhood to location schema
- [x] Create routes/locations.js: GET /api/locations endpoint
- [x] Update routes/properties.js: Enhance filters with location validation
- [x] Update routes/analytics.js: Integrate external prices into analytics
- [ ] Update README.md: Document new features and endpoints
- [ ] Test integration (fetch locations/prices, verify no errors)
