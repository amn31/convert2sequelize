
# Send your Sequelize queries from frontend to the backend 

On the Backend side, [Sequelize](https://sequelize.org) allows you to create database query requests from a 
[specific model](https://sequelize.org/master/manual/model-querying-basics.html).

To send querying from a client like [Angular](https://angular.io/), a JSON can be sent to the backend
and can be converted by the Convert2Sequelize module in order to create the final Sequelize query.

Sequelize also offers to perform raw queries using SQL queries .
Convert2Sequelize module converts the JSON to generate the SQL query.


# Frontend: Define request from Angular Client or other

```ts

    // Example of request 
    let whereJSON = [ 
            [
                "Imei",
                "not like",
                "'%33680090%'"
            ],
            "and",
            [
                [
                    "EnrollmentStatus",
                    "=",
                    "Unnrolled"
                ],
                "or",
                [
                    "EnrollmentStatus",
                    "=",
                    "Enrolled"
                ],
            ]
        ]
    ]
```

# Backend: Installation

$ npm install @amn31/convert2sequelize


# Backend: Convert JSON to Sequelize

How use Convert2Sequelize ?

```ts
  
   import { CompleteConditions , Convert2Sequelize} from "../lib/db-convert";

    // Create instance
    const convert = new Convert2Sequelize();

    /* Example: 1 */
    // Convert JSON 
    let whereSequelize = convert.convertToSequelize(whereJSON);
    // Example with findAndCountAll 
    dataModel.findAndCountAll( {
        // the where has been converted
        where: whereSequelize,

        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('isLeasing')), 'distinct_Leasing']
        ]
    });

    /* Example: 2 */
    // Convert JSON to SQL :
    // ( Imei not like '%33680090%' ) and (  ( EnrollmentStatus = 'Enrolled' ) or ( EnrollmentStatus = 'Unenrolled' )  
         
    // Sequelize can be used for Raw Queries 
    let SQLquery = 'SELECT * From Users WHERE ' + convert.convertToSQL(conditions);
    const { QueryTypes } = require('sequelize');

    const users = await sequelize.query(SQLquery, { type: QueryTypes.SELECT });
```

### Operators 

```sql
    and
    or
    '='
    '!='
    '>'
    '<'
    '>='
    '<='
    like
    'not like'
    ilike
    'not ilike'
    regex
    notRegexp
    iregex
    'not iregex'
    startswith
    endswith
    contains
    isnull
    isnotnull
```

## License

[MIT](LICENSE)

[Angular](https://angular.io/)

[Sequelize](https://sequelize.org/master/manual/model-querying-basics.html)

