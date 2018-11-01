class DbMaker {
    constructor(pool) {
        this.pool = pool;
    }

    populateCityTable() {
        const cityListJson = require('./resources/city.list.json');

        this.pool.query('DELETE FROM city', function(err) {
            if (!err) {
                console.log('Deleting previous data from `city` table');
            }
            else {
                throw err;
            }
        });

        cityListJson.forEach(function(city) {
            this.pool.query(
                'INSERT INTO city(name, country, coord, api_city_id) VALUES($1, $2, ST_SetSRID(ST_MakePoint($3::double precision, $4::double precision), 4326)::point, $5)',
                [city.name, city.country, city.coord.lon, city.coord.lat, city.id],
                function(err) {
                    if (err) {
                        throw err;
                    }
                }
            );
        }, this);
    }
}

module.exports = DbMaker;