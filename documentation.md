# Overview

Application works with cycling routes data on the map and it's most important features are:
- show cycling routes and their data - name and length
- show their weather data - 1 route has more weather points based on it's length
- filtering cycling routes by desired minimal temperature and maximal humidity
- filtering cycling routes by their length

This is it in action:

![Screenshot 1](doc-images/action1.png)

![Screenshot 2](doc-images/action2.png)

![Screenshot 3](doc-images/action3.png)

The application has 2 separate parts, the client which is a [frontend web application](#frontend) using mapbox API and mapbox.js and the [backend application](#backend) written in [Node.js](https://nodejs.org/en/), backed by PostGIS. The frontend application communicates with backend using an [API](#api). API is documented in interactive form with Swagger tool.

# Frontend

The frontend application consists of two HTML pages: (`index.html`) and (`filter.html`). Both of the HTML files are displaying showing cycling routes geodata on the map via JS Mapbox library. 

*Filter page* contains formular with selecting user's preferencies on routes and after submitting calls Backend's API with selected parameters. API will return routes that fit into user's preferences. All dynamic JavaScript actions are done via JQuery library - mainly validating form inputs, sending API request via AJAX and initializing map with obtained cycling routes. 

*Index page* contains a map with all cycling routes and their corresponding weather data.

*Map initialization scripts* are stored in (`js/map.js`) file. *Filtering validations and API calls* are stored in (`js/filter.js`) file. *Script file for index file* is stored in (`js/main.js`).

*Route colors* are generated randomly via a Color generator script.

*Weather icons* are obtained from *OpenWeatherMap repository*.

# Backend

The backend application powered by Node.js and is responsible for:
- importing cycling routes data into POSTGIS database from gpx format
- continually gathering weather data relevant to saved routes data
- serving static files
- serving API
- communication with Postgres database
- serving API documentation
- logging application events into log files

## Data
### Cycling routes data
Cycling routes data are imported via an *bash* script that uses *ogr2ogr* tool for importing gpx formated data into POSTGIS database. Before import, script runs DDL commands that create required tables. DDL file is stored in (`backend/data_definition/ddl.sql`). Import script consists of bash file (`backend/data_import/import.sh`) and 2 supporting SQL scripts (`backend/data_import/import1.sql`) and (`backend/data_import/import2.sql`).
### Weather data
Weather data is obtained from *OpenWeatherMap API*. Count of weather query points for 1 route depends on route's length. Routes with length < 30km are queried only for their starting and finishing points. Routes with length >= 30km and < 100km are queried for starting, finishing points and for middle route point. Routes longer than 100km are queried for start, first quarter, middle, third quarter and finish points. 

*Gathering script* runs every X miliseconds - acording to configuration value stored in (`backend/config.json`). It queries every route for actual weather data and stores it into database. 

## Api
*API* is documented interactively through Swagger. When application runs, its interactive docs are accessible via URL: (`localhost:3000/api-docs`). There you can check all parameters needed and response value formats. You can also execute API calls from there as well. 
![Screenshot 4](doc-images/swagger.png)

**Find hotels in proximity to coordinates**

`GET /search?lat=25346&long=46346123`

**Find hotels by name, sorted by proximity and quality**

`GET /search?name=hviezda&lat=25346&long=46346123`

### Response

API calls return json responses with 2 top-level keys, `hotels` and `geojson`. `hotels` contains an array of hotel data for the sidebar, one entry per matched hotel. Hotel attributes are (mostly self-evident):
```
{
  "name": "Modra hviezda",
  "style": "modern", # cuisine style
  "stars": 3,
  "address": "Panska 31"
  "image_url": "/assets/hotels/652.png"
}
```
`geojson` contains a geojson with locations of all matched hotels and style definitions.
