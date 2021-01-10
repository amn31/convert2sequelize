# Send your Sequelize queries from frontend to the backend 

    On the Backend side, Sequelize allows you to create database query requests from a [specific model]

    To send querying from a client like [Angular], a JSON can be sent to the backend
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

# Backend: Convert JSON to Sequelize

How use Convert2Sequelize ?

```ts
  
   import { CompleteConditions , Convert2Sequelize} from "../lib/db-convert";

    // Creat converter instance
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
[specific model](https://sequelize.org/master/manual/model-querying-basics.html)

